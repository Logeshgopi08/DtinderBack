const socket = require("socket.io");
const crypto = require("crypto");


const getSecretRoomId = (userId,targetId)=>{
     return crypto.createHash("sha256").update([userId,targetId].sort().join("_")).digest("hex");
}


const InitialiseSocket = (server)=>{

    const io = socket(server,{
         cors :{
            origin:"http://localhost:5173"
         }
    });

    io.on("connection",(socket)=>{
        // handle Events

        socket.on("joinChat",({userId,targetId})=>{
            const roomId = getSecretRoomId(userId,targetId);

            console.log("Joining RoomId "+roomId);
            
            socket.join(roomId);
        });


        socket.on("sendMessage",({userId,targetId,text})=>{
            const roomId = getSecretRoomId(userId,targetId);
            io.to(roomId).emit("messageReceived",{text});
        });


        socket.on("disconnect",()=>{});
    })
}

module.exports = InitialiseSocket;