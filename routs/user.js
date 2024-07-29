const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

router.route("/signup")
.get((userController.signup))
.post(wrapAsync(userController.signupController));

router.route("/login")
.get(userController.login)
.post(saveRedirectUrl,passport.authenticate("local",{
  failureRedirect: "/login",
  failureFlash: true,
}),
  userController.loginController);

router.get("/logout",userController.logout);

module.exports = router;