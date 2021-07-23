var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost/demo");    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var semesterSchema = new mongoose.Schema({
    semester: Number,
    subject : {}
});

var Semester = mongoose.model("Semester", semesterSchema);

// Semester.create(
//     {   
//         semester: 1, 
//         subject : {English : 80, Maths: 30, Science: 70, Computer: 90}
    
//     },(err, semester)=>{
//         if(err)
//             console.log(err);
//         else{
//             console.log("Created New Semester");
//             console.log(semester);
//         }
//     })

//     Semester.create(
//         {   
//             semester: 1, 
//             subject : {English : 80, Maths: 30, Science: 70, Computer: 90}
        
//         },(err, semester)=>{
//             if(err)
//                 console.log(err);
//             else{
//                 console.log("Created New Semester");
//                 console.log(semester);
//             }
//         })







//landing route
app.get("/", (req, res)=>{
    res.render("login");
});

//login route
app.get("/login", (req,res)=>{
    res.render("login");
});

//temp database
var semesters = [
    {semester: 1, subject : {English : 80, Maths: 30, Science: 70, Computer: 90}},
    {semester: 2, subject : {English : 20, Maths: 50, Science: 60, Computer: 70}},
    {semester: 3, subject : {English : 90, Maths: 90, Science: 100, Computer: 100}},
    {semester: 3, subject : {English : 90, Maths: 90, Science: 100, Computer: 100}},
    {semester: 3, subject : {English : 90, Maths: 90, Science: 100, Computer: 100}},
    {semester: 3, subject : {English : 90, Maths: 90, Science: 100, Computer: 100}}

]

//display semester details - INDEX
app.get("/semesters",(req, res)=>{
    Semester.find({}, (err, allSemesters)=>{
        if(err)
            console.log(err);
        else{
            sortByKey(allSemesters, "semester");
            res.render("semesters",{semesters:allSemesters});
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
    res.send("SHOW SEMESTER DETAILS");
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