import express from "express";
import env from "./config/env.js"
import morgan from "morgan";

export default function createApp(){
    const app = express();

    if(env.NODE_ENV === "production"){
        app.use(morgan("dev"));
    }
    
    // parsing req.body
    app.use(express.json({limit: "3mb"})); // limiting req.body to max 10mb
    app.use(express.urlencoded({extended: true, limit: "3mb"})) // limitng html form data to max 10mb

    app.get("/health", (req,res)=>{
        res.json({
            message: "healthy"
        })
    })

    return app;
};