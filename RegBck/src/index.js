import dotenv from "dotenv";
dotenv.config({path:'./.env'});
import connectDB from "./configx/database.js";
import express from "express";
import userRouter from "./routes/user.route.js";


const app = express();
app.use(express.json());
app.use("/api/v1/users", userRouter);

const startServer = async () => {
    try {
        await connectDB();
        app.on("error",(error)=>{
            console.log("Error",error);
            throw error;
        });
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on Port ${process.env.PORT}`);
        })
    }catch(error){
        console.log("MONGODB connection failed",error);
    }
}
startServer();