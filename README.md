# 🌍 WanderLust — Travel Stay & Accommodation Platform

WanderLust is a full-stack web application inspired by Airbnb, where users can explore travel stays, create property listings, upload images, view categories, and manage their rental spaces.  
It is built using **Node.js**, **Express**, **MongoDB**, and **EJS** with full CRUD features and Cloudinary image hosting.

---

## 🚀 Live Deployment
- 🌐 **Website:** https://wanderlust-z5k6.onrender.com/listings
- 📦 **GitHub Repo:** https://github.com/iprabhakersingh/WanderLust

---

## 🎯 Project Overview

WanderLust is designed as a complete rental/listing platform where:

- Users can browse properties, filter by category, and view detailed pages.
- Hosts can log in and manage their listings with full Create, Edit, and Delete capabilities.
- Cloudinary handles image uploading.
- MongoDB stores listing, user, and category data.
- EJS provides dynamic server-side rendering for clean UI templates.

The project follows an organized MVC architecture with reusable components and clean routes.

---

## ⭐ Key Features

### 👥 User Features
- User registration & login (Session-based authentication)
- Explore all listings with category navigation
- View detailed property pages: images, description, price, taxes
- Mobile-friendly views (via responsive CSS)

### 🏡 Host / Admin Features
- Create new property listings with form validation
- Upload property images via Cloudinary
- Edit existing listings
- Delete listings
- Automatic data validation using Joi
- Built an AI feature that auto-generates and improves property descriptions

### 🔧 Backend Features
- MVC design structure (models, controllers, routes)
- Clean RESTful routes using Express Router
- Centralized authentication middleware
- Schema validation through Joi
- Reusable partials (navbar, cards, footers) in EJS

---

## 🧰 Tech Stack

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  

### **Frontend**
- EJS  
- CSS  
- Bootstrap  
- Vanilla JavaScript  

### **Utilities**
- Cloudinary for image upload  
- Multer for file handling  
- Joi for schema validation  
- Express-session for authentication
- OpenAI for listing description improver

---

## 📁 Project Structure

```bash
WanderLust/
│
├── controllers/         # Logic for handling user actions
├── init/                # Seed files or initialization scripts
├── models/              # MongoDB Mongoose schemas
├── public/              # CSS, JS, static files
│   ├── css/
│   ├── js/
│   └── images/
├── routes/              # Express route handlers
├── utils/               # Helper utilities
├── views/               # EJS templates
│   ├── partials/        # Components like header/footer
│   └── listings/        # Listing page templates
│
├── app.js               # Main Express application
├── cloudconfig.js       # Cloudinary configuration
├── middleware.js        # Auth & validation middleware
├── schema.js            # Joi validation schemas
├── package.json
└── README.md
```

---

## ⚙️ Installation & Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/iprabhakersingh/WanderLust.git
cd WanderLust
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create Environment Variables  
Create a `.env` file in the project root:

```env
# MongoDB connection
MONGO_URL=your_mongo_connection

# Cloudinary keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Map Keys
MAP_TOKEN = your_token

# Authentication secret
SECRET=session_secret

# Port
PORT=3000
```

### 4️⃣ Start Development Server
```bash
npm start
```

Visit the local app at:  
👉 http://localhost:3000

---

## 🧪 Available Scripts
```bash
npm install      # Install dependencies
npm start        # Start production server
npm run dev      # For nodemon (if configured)
```

---

## 📦 Core Functionalities

### 🏠 Listings
- Create, read, update, delete listings  
- Display all listings with responsive UI  
- Category icons for quick navigation  
- Price, tax, and location details
- AI-powered listing description improver that generates or enhances property descriptions using OpenAI, helping hosts create clear, engaging, and professional listings.

### 🖼 Image Uploads
- Managed using Cloudinary  
- Multer middleware handles uploads  
- Secure and optimized imagery  

### 🔐 Authentication & Security
- Session-based login  
- Routes protection middleware  
- Input validation using Joi  

---

## 📘 Code Quality & Structure

The project maintains:
- Clean folder segregation  
- Separate controllers for logic  
- Reusable EJS components  
- Fully modularized Express routes  
- Proper schema validations  

This improves maintainability and scalability.

---

## 🤝 Contributing

We welcome contributions!

```bash
# 1. Fork the repo
# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Commit changes
git commit -m "Added new feature"

# 4. Push branch
git push origin feature/new-feature
```

Open a Pull Request after pushing changes.

---

## 👨‍💻 Author
**Prabhaker Singh**  
GitHub: https://github.com/iprabhakersingh

---

## ⭐ Support the Project

If you found this project helpful, please consider giving a **GitHub Star ⭐**  
This helps others discover the project and supports its growth.

