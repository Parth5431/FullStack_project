const User = require("../models/user");

module.exports.signup = (req, res)=>{
    res.render("user/signup.ejs");
    }

module.exports.signupController = async(req, res)=>{
    try {
        let{username, email, password} = req.body;  
const newUser = new User({email, username});
const registeredUser = await User.register(newUser, password);
req.login(registeredUser,(err)=>{
  if(err){
    return next(err)
  }
  req.flash("success","Welcome to wanderlust");
  res.redirect("/listing");
})
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

};

module.exports.login = (req, res)=>{
    res.render("user/login.ejs");
};

module.exports.loginController = 
async(req, res)=>{
req.flash("success","Welcome to wanderlust");
let redirectUrl = res.locals.redirectUrl || "/listing"
res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logOut((err)=>{
      if(err){
          return next(err);
      }
      req.flash("success","you are logged out");
      res.redirect("/listing");
    })
};