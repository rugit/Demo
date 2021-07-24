var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    passport    = require("passport");


//landing route
router.get("/", (req, res)=>{
    if(req.user)
        res.redirect("/semesters");
    else
        res.redirect("/login");
});

// =============
//  AUTH ROUTES
// =============

//register form
router.get("/register",(req,res)=>{
    res.render("register",{currentPath:req.route.path});
});

//handling register logic
router.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register( newUser, req.body.password, (err, user, info)=>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/semesters");
        });
            
    });
})

//login form
router.get("/login", (req,res)=>{
    res.render("login",{currentPath:req.route.path});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/semesters",
        failureRedirect: "/login",
        successFlash: "You Logged In!",
        failureFlash: "Invalid username or password!!"
    }), (req, res)=>{
    
});


//logout logic
router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success", "You Logged out");
    res.redirect("/login");
});

//middleware to check if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first");
    res.redirect("/login");
}

module.exports = router;