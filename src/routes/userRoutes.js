const express = require("express");
const userRoutes = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../Models/connection");
const User = require("../Models/userModel"); 

const USER_POPULATE_DATA = "firstName lastName  gender photoUrl age";

userRoutes.get("/user/request/received",userAuth,async(req,res)=>{
    try {

        const loggesInuser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggesInuser._id,
            status:"interested"
        }).populate("fromUserId", USER_POPULATE_DATA);

        if(!connectionRequest){
            return res.status(400).json({message:"Invalid Request "})
        }

        const data = connectionRequest;

        res.json({message:"Data fetch Succesfully @$#$#",data});
        
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

userRoutes.get("/user/connections",userAuth,async(req,res)=>{
    try {

        const loggedInuser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInuser._id,status:"accepted"},
                {fromUserId:loggedInuser._id,status:"accepted"}
            ]
        }
        ).populate("fromUserId",USER_POPULATE_DATA).
        populate("toUserId",USER_POPULATE_DATA);
        
        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInuser._id.toString()){
                return row.toUserId;
            }
            return  row.fromUserId;
        });


        res.json({data});

        
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

userRoutes.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        const skip = (page -1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedUser._id},{toUserId:loggedUser._id}
            ]
        }).select("fromUserId toUserId").populate("fromUserId", "firstName").populate("toUserId", "firstName");

        const hideconnection = new Set();

        connectionRequest.forEach((req)=>{
            hideconnection.add(req.fromUserId._id.toString()),
            hideconnection.add(req.toUserId._id.toString())
        });


        const user = await User.find({
            $and:[
                {_id:{$nin: Array.from(hideconnection) }},
                {_id:{$ne:loggedUser._id}}
            ]
        }).select(USER_POPULATE_DATA).skip(skip).limit(limit);

        res.json({message:"Feed fetch Successfully !!!",data:user});



    } catch (error) {
        res.status(400).json({message:error.message});
    }
})


module.exports = userRoutes;