const e = require("express");
var mongoose = require("mongoose");
var Semester = require("./models/semester");
const user = require("./models/user");
var User = require("./models/user");


var data= [
    {
        semester: 1, 
        subject : {English : 80, Maths: 30, Science: 70, Computer: 90}
    },
    {
        semester: 2, 
        subject : {English : 20, Maths: 50, Science: 60, Computer: 70}
    },
    {
        semester: 3, 
        subject : {English : 90, Maths: 90, Science: 100, Computer: 100}
    },
    {
        semester: 4, 
        subject : {English : 95, Maths: 87, Science: 70, Computer: 92}
    },
    {
        semester: 5, 
        subject : {English : 92, Maths: 95, Science: 20, Computer: 99}
    },
    {
        semester: 6, 
        subject : {English : 91, Maths: 84, Science: 90, Computer: 94}
    }

]



function seedDB(){
    
    //Remove all users
    User.deleteMany({}, (err)=>{
        if(err)
            console.log(error);

        //Remove all semesters Data
        Semester.deleteMany({}, (err)=>{
            if(err)
                console.log(err);
            
            console.log("All semester Data removed")
    
            //Add some Semeters Data
            user.create({username: "anupal", password: "123"}, (err, user)=>{
                if(err)
                    console.log(err);
                else {
                    data.forEach((seed)=>{
                        Semester.create(seed, (err, semester)=>{
                            if(err)
                                console.log(err);
                            else {
                                semester.user.id = user._id;
                                semester.user.username = user.username;
                                semester.save();
                                console.log("Added "+ semester+ "to "+ user.username);
                            }
                                
                        })
                    });
                } 
                    
            });
            
        });
    })
    
    
    
}

module.exports = seedDB;