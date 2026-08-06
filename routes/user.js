const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const review = require("../models/review.js");
const {saveRedirectUrl} = require("../middleware.js");


const userController = require("../controllers/users.js");
// get signup from route
router.get("/signup",userController.renderSignupForm);

// post signup data 
router.post("/signup", wrapAsync(userController.signUp));

//get login page
router.get("/login",userController.renderLoginForm);

// post login data check this use is exits or not
router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true,
    // authentication (login) 
//     local system ke database se karna,
// na ki kisi external service (like Google, Facebook, GitHub, etc.) se.
}),
userController.login
);

// logout route
router.get("/logout",userController.logOut);

// ye loginpst rout me passport authnticate use hua ki ye check rega user exist krta h ki nhi 
module.exports = router;