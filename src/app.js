const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/Profile");
const requestRouter = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes")
require("dotenv").config();

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  

  app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRoutes);





connectDB().then(()=>{
    console.log("Database is Connected");
    app.listen(process.env.PORT,()=>{
        console.log(`Server in running in ${process.env.PORT} `);
        
    })
    
}).catch(()=>{
    console.error("Database cannot be connected!!");
})

