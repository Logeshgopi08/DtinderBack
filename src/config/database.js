const mongoose = require("mongoose");


const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://Logesh:7jb2DunzD5AlVZzt@logesh.jolaj.mongodb.net/devTinder");
}

module.exports = connectDB;