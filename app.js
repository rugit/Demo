var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("login");
});

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

//display semester details
app.get("/semesters",(req, res)=>{
    res.render("semesters",{semesters:semesters});
});

//add semester details to database
app.post("/semesters", (req, res)=>{
    var semester = req.body.semester;
    var subject = {};

    (req.body.subject).forEach((key,i) => {
        subject[key] = req.body.subject_score[i];
        
    });

    console.log(subject);

    var newSemester = {semester: semester, subject: subject};
    semesters.push(newSemester);
    
    res.redirect("/semesters");

});

//add semester details
app.get("/semesters/new",(req,res)=>{
    res.render("new.ejs");
})

//url: localhost:3000
app.listen(3000,()=>{
    console.log("Server Running");
});