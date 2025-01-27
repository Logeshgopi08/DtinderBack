const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../Models/connection");
const User = require("../Models/userModel");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        console.log(toUserId);

        const allowedStatus = ["interested","ignored"];

        if(!allowedStatus.includes(status)){
            return  res.status(400).json({message:"Invalid Status Type "+ status});
          };

          const toUser = await User.findById(toUserId);
          console.log(toUser);

          if(!toUser){
            return res.status(400).json({message:"User Not Found"});
           };

           const existingConnection = await ConnectionRequest.findOne({
            $or:[
              {fromUserId,toUserId},
              {fromUserId:toUserId,toUserId:fromUserId}
            ]
          });

          if(existingConnection){
            return res.status(400).json({message:"Connection Request Already Send !!"});
           }

           const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
          });

          const connectionData = await connectionRequest.save();

          res.json({
            message:req.user.firstName + " is " + status + " in " + toUser.firstName,
            connectionData
          })
        
    } catch (error) {
        res.status(400).json({message:"Error" + error.message});
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{

    try {

        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
          return res.status(400).json({ messaage: "Status not allowed!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
          });
          if (!connectionRequest) {
            return res
              .status(404)
              .json({ message: "Connection request not found" });
          }

          connectionRequest.status = status;

          const data = await connectionRequest.save();
          res.json({ message: "Connection request " + status, data });
        
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});


module.exports = requestRouter;
