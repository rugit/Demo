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

seedDB();


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");




//landing route
app.get("/", (req, res)=>{
    res.render("login");
});

//login route
app.get("/login", (req,res)=>{
    res.render("login");
});


//display all semester details - INDEX
app.get("/semesters",(req, res)=>{
    Semester.find({}, (err, allSemesters)=>{
        if(err)
            console.log(err);
        else{
            sortByKey(allSemesters, "semester");
            res.render("index",{semesters:allSemesters});
        }
    })
    
});

//add semester details - NEW
app.get("/semesters/new",(req,res)=>{
    res.render("new.ejs");
})


//add semester details to database - CREATE
app.post("/semesters", (req, res)=>{
    var semester = req.body.semester;
    var subject = {};

    (req.body.subject).forEach((key,i) => {
        subject[key] = req.body.subject_score[i];
        
    });

    //create new Semester and add it to the database
    var newSemester = {semester: semester, subject: subject};
    Semester.create(newSemester, (err, newlyCreated)=>{
        if(err)
            console.log(err);
        else{
            res.redirect("/semesters");
        }
    })
});

//show semester Details - SHOW
app.get("/semesters/:id", (req,res)=>{
    Semester.findById(req.params.id, (err, foundSemester)=>{
        if(err)
            console.log(err);
        else{
            res.render("show", {semester: foundSemester});
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


//url: localhost:3000
app.listen(3000,()=>{
    console.log("Server Running");
});