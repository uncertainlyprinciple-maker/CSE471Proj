import express from "express";
import userRouter from "./routes/user.route.js";

const app = express();
app.use(express.json());
app.use("/api/v1/users",userRouter);
//http://localhost:4000/api/v1/users/register
export default app;