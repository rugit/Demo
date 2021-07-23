var express     = require("express"),
    router      = express.Router(),
    Semester    = require("../models/semester"),
    User        = require("../models/user");

// ============================
//  User Semester Detail Route
// ============================

//display all semester details - INDEX
router.get("/semesters", isLoggedIn, (req, res)=>{
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
router.get("/semesters/new", isLoggedIn, (req,res)=>{
    res.render("semesters/new");
})


//add semester details to database - CREATE
router.post("/semesters", isLoggedIn, (req, res)=>{
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
router.get("/semesters/:id", isLoggedIn, (req,res)=>{
    Semester.findById(req.params.id, (err, foundSemester)=>{
        if(err)
            console.log(err);
        else{
            res.render("semesters/show", {semester: foundSemester});
        }
    });
});

//edit semester
router.get("/semesters/:id/edit", isLoggedIn, (req, res)=>{
    Semester.findById(req.params.id, (err, foundSemester)=>{
        if(err)
            console.log(err);
        else{
            res.render("semesters/edit", {semester: foundSemester});
        }
    });
});

//update semester
router.put("/semesters/:id",(req, res)=>{

    var semester = req.body.semester;
    var subject = {};

    (req.body.subject).forEach((key,i) => {
        subject[key] = req.body.subject_score[i];
        
    });

    //create new Semester and add it to the database
    var updatedSemester = {semester: semester, subject: subject};

    Semester.findByIdAndUpdate(req.params.id, updatedSemester, (err, Semester)=>{
        if(err)
            console.log(err);
        else{
            console.log(Semester);
            res.redirect("/semesters/"+ req.params.id);
        }
    });
});

//delete semester route

router.delete("/semesters/:id",(req, res)=>{
    Semester.findByIdAndRemove(req.params.id, (err)=>{
        if(err)
            console.log(err);
        else
            res.redirect("/semesters");
    });
});


//Functions 
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
