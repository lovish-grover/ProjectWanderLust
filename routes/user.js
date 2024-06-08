const express = require("express");
const router = express.Router();
const User =  require("../models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controller/users.js");

router.route("/signUp")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp))


router.route("/login")
.get(userController.renderLoginUpForm)
.post(saveRedirectUrl ,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true 
    }), userController.login
)

router.get("/logout", userController.logout);

module.exports = router;