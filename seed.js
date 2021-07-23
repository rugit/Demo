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
            user.create({
                username : "Anupal102", 
                salt : "e8282082ec21ba4bc3627b3e7beac29306c42445eab1d89cc1ecb9d3f4c1feef", 
                hash : "63ef4533f5cdb2867ea60e05ca21131e11629f6d084bc0ad2ceaccc243f94501610b3ea8423594b66556df340a0804c76a5588ee38b09d4485fce5f6d99d93aa198dc38933b8a040a5a05a7f64c359f9dcaa3db192ac4e585bf610bc61d83638550a0a65a30a4593a38b8e8639962391239acc5e0cd282dddd4d5dfb2848493e3f75d23836549f1289689c41d4c885505494d5dbd14b1f13e6f5c04a049a8976b68476e1a308b426253221c4f650aab4d3bb57caa888776d0019c1d0ed79645da1d835f23b321cc83377f120f42c0a734531676c5e6e31374c35e844872fc2937ab04b32c87126d3f3774c85351ee85b7b455c71eeb8e4b15eb4d47f8881657b8fe4e74b66e36be3cecfc5394be39e5740fc89f6a70034540779e66564dabea8d6290e7996270be2e99780b167bcd23b2c8ad8e2139cdbe04dea3e41c46ea3a37a41724753db61e0e77e63f46391e06cce19e0910abe9b922f0e29983969556f2dcd95a82de445ed7d621cb9d7d406f154d4dc71784cede31df9963d300db048c43761ae65f46dd6654b6fb397a23ca1db203876e0bc4677ab93f1aa98d37ff2e4e552881ec279959bb59c7e39e09233050c6b4416c54477bfeb0c0400ce2fa5dccafd4782531c44f279eee84e1fb44092d938fdd3ba6407bac3663853bbacd8c8eab33e8bdfcf84623790b83736ad9602da76356479e419e74751348690a928"
            }, (err, user)=>{
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
                                
                        });
                    });
                } 
                    
            });
            
        });
    })
    
    
    
}

module.exports = seedDB;