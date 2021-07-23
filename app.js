var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Semester        = require("./models/semester"),
    User            = require("./models/user"),           
    seedDB          = require("./seed");

mongoose.connect("mongodb://localhost/demo");    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
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
    next();
});




//landing route
app.get("/", (req, res)=>{
    if(req.user)
        res.redirect("/semesters");
    else
        res.redirect("/login");
});

// =============
//  AUTH ROUTES
// =============

//register form
app.get("/register",(req,res)=>{
    res.render("register",{currentPath:req.route.path});
});

//handling register logic
app.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register( newUser, req.body.password, (err, user, info)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/semesters");
        });
            
    });
})

//login form
app.get("/login", (req,res)=>{
    res.render("login",{currentPath:req.route.path});
});

//handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/semesters",
        failureRedirect: "/login"
    }), (req, res)=>{
    
});


//logout logic
app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
});

//middleware to check if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// ============================
//  User Semester Detail Route
// ============================

//display all semester details - INDEX
app.get("/semesters", isLoggedIn, (req, res)=>{
    var userName = req.user.username;

    Semester.find({"user.username": userName}, (err, allSemesters)=>{
        if(err)
            console.log(err);
        else{
            sortByKey(allSemesters, "semester");
            res.render("semesters/index",{semesters:allSemesters});
        }
    })
    
});

//add semester details - NEW
app.get("/semesters/new", isLoggedIn, (req,res)=>{
    res.render("semesters/new.ejs");
})


//add semester details to database - CREATE
app.post("/semesters", isLoggedIn, (req, res)=>{
    var semester = req.body.semester;
    var subject = {};

    (req.body.subject).forEach((key,i) => {
        subject[key] = req.body.subject_score[i];
        
    });

    //create new Semester and add it to the database
    var newSemester = {semester: semester, subject: subject};
    User.findOne({username: req.user.username},(err, user)=>{
        if(err)
            console.log(err);
        else{
            Semester.findOne({semester: newSemester.semester, "user.username": req.user.username }, (err, semester)=>{
                if(err)
                    console.log(err)
                else{
                    if(semester){
                        console.log(`Semester ${semester.semester} Data is already in Database`);
                        return res.redirect("/semesters/new");
                    }
                    Semester.create(newSemester, (err, semester)=>{
                        if(err)
                            console.log(err);
                        else {
                            semester.user.id = user._id;
                            semester.user.username = user.username;
                            semester.save();
                            res.redirect("/semesters");
                        }
                            
                    });
                }
            });
            
        }
    });

});

//show semester Details - SHOW
app.get("/semesters/:id", isLoggedIn, (req,res)=>{
    Semester.findById(req.params.id, (err, foundSemester)=>{
        if(err)
            console.log(err);
        else{
            res.render("semesters/show", {semester: foundSemester});
        }
    });
});





//Functions 
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}




//default route
app.get("*",function (req, res) {
	res.render("error404");
});



//url: localhost:3000
app.listen(3000,()=>{
    console.log("Server Running");
});