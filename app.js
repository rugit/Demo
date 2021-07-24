var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    flash           = require("connect-flash"),
    Semester        = require("./models/semester"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),           
    seedDB          = require("./seed");

var semesterRoutes  = require("./routes/semesters"),
    indexRoutes     = require("./routes/index");


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/demo");    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
seedDB();


// ========================
//  PASSPORT CONFIGURATION
// ========================
app.use(require("express-session")({
    secret: "If it works, dont touch it",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//send logged in User and current route to all routes
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//Requiring routes
app.use(indexRoutes);
app.use(semesterRoutes);

//default route
app.get("*",function (req, res) {
	res.render("error404");
});



//url: localhost:3000
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server Running");
});