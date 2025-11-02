const express= require("express");
const router = express.Router();
const User = require("C:/MajorProject/models/user.js");
const wrapAsync = require("C:/MajorProject/utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("C:/MajorProject/middleware.js");
const userController = require("C:/MajorProject/controllers/users.js")

router.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;