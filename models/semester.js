var mongoose = require("mongoose");

var semesterSchema = new mongoose.Schema({
    semester: Number,
    subject : {},
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports  = mongoose.model("Semester", semesterSchema);
