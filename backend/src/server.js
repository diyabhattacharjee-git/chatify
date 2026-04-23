// const express = require("express");
// import dotenv from "dotenv"
import express from "express"
import cookieParse from "cookie-parser"
import path from "path"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import {ENV} from "./lib/env.js"
import { app, server } from "./lib/socket.js"
import cors from "cors"

// dotenv.config();

// const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

//payload too large error
// app.use(express.json())  //req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))
app.use(cookieParse());

app.use("/api/auth",authRoutes);
app.use("/api/messages", messageRoutes);

//make ready for deployment
if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (_,res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// app.listen(3000, () => {
//    console.log("Server is running on port: "+ PORT)
//    connectDB()
// });

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
})
.catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1)
});

