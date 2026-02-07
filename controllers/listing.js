const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
        })
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send()
    let locationGeometry = response.body.features[0].geometry;
    let url = req.file.path;
    let filename = req.file.filename;

    const duplicateImage = await Listing.findOne({
        "image.hash": filename
    });

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    
    newListing.image = {
        url,
        filename,
        hash: filename
    };

    
    if (duplicateImage) {
        newListing.isSuspicious = true;
        newListing.suspiciousReasons.push("Duplicate image detected");
    }
    
    const avgPrice = await Listing.aggregate([
        { $match: { location: newListing.location } },
        { $group: { _id: null, avg: { $avg: "$price" } } }
    ]);

    if (avgPrice.length > 0) {
        const areaAvg = avgPrice[0].avg;
        if (newListing.price < areaAvg * 0.5) {
            newListing.isSuspicious = true;
            newListing.suspiciousReasons.push(
                "Price significantly lower than area average"
            );
        }
    }

    newListing.geometry = locationGeometry;
    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    // let {title, description, image, price, country, location} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_300");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async(req,res) => {
    // if(!req.body.listing) {
    //         throw new ExpressError(400, "Send valid data for listing");
    //     }
    let{id}= req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {new: true});

    let response = await geocodingClient.forwardGeocode({
    query: listing.location,
    limit: 1
    })
    .send()
    
    let locationGeometry = response.body.features[0].geometry;
    listing.geometry = locationGeometry;
    await listing.save();
    console.log(listing);

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=> {
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.fiterIndex = async (req, res) => {
    let {category}= req.params;
    let allListings = await Listing.find({category: category});
    res.render("listings/index.ejs", {allListings});
};

module.exports.searchIndex = async (req, res) => {
    let {q} = req.query;
    let allListings = await Listing.find({$or: [{country: q}, {location: q}]});
    res.render("listings/index.ejs", {allListings});
};

module.exports.aiImproveDescription = async (req, res) => {
  try {
    const { description, title, location, country, category, price } = req.body;

    if (!title || !location || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userContent = description && description.trim().length > 0
      ? `Improve this property description:\n"${description}"`
      : `Write a professional property description from scratch.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel listing copywriter. Write clear, honest, ATS-friendly property descriptions. Do not invent amenities. Limit to 80–120 words."
        },
        {
          role: "user",
          content: `
Title: ${title}
Category: ${category}
Location: ${location}, ${country}
Price: ${price}

${userContent}
          `
        }
      ]
    });

    const improvedDescription = response.choices[0].message.content;
    return res.status(200).json({ improvedDescription });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports.aiSuggestPrice = async (req, res) => {
  try {
    const { title, location, country, category, description } = req.body;

    if (!location || !country) {
      return res.status(400).json({ message: "Location and country required" });
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a pricing expert for vacation rentals in India. Suggest a fair nightly price in INR. Be realistic and competitive. Return ONLY a number."
        },
        {
          role: "user",
          content: `
Title: ${title}
Category: ${category}
Location: ${location}, ${country}
Description: ${description || "N/A"}

Suggest the best nightly price in INR.
          `
        }
      ]
    });

    const aiPrice = response.choices[0].message.content.trim();

    return res.status(200).json({ aiPrice });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.aiSearch = async (req, res) => {
  try {
    const { q } = req.query;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Convert a travel search query into MongoDB filters using ONLY these fields: location, country, category, price. Use category values like Mountains, Rooms, Farms, Boats. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: q
        }
      ]
    });

    let filters = {};
    try {
      filters = JSON.parse(response.choices[0].message.content);
    } catch {
      filters = {};
    }

    let allListings;

    if (Object.keys(filters).length === 0) {
      allListings = await Listing.find({
        $or: [
          { country: new RegExp(q, "i") },
          { location: new RegExp(q, "i") }
        ]
      });
    } else {
      allListings = await Listing.find(filters);

      if (allListings.length === 0) {
        allListings = await Listing.find({
          $or: [
            { country: new RegExp(q, "i") },
            { location: new RegExp(q, "i") },
            { category: new RegExp(q, "i") }
          ]
        });
      }
    }

    console.log("AI filters:", filters);
    console.log("Results count:", allListings.length);

    res.render("listings/index.ejs", { allListings });

  } catch (err) {
    console.error("AI Search Error:", err);
    res.redirect("/listings");
  }
};
