// const express = require("express")  -- common js 
import express from "express"
import { ENV } from "./lib/env.js"
import path from "path"

// Create Server 
const app = express()

//👉 “Give me my project’s main folder path.”
const __dirname = path.resolve()

// Then Send Get Http Request 
app.get('/testing' , (req,res) => {
    res.json("Hello Welcome To The Project what ar ")
})


// make aur app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}" , (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"))
    })
}

app.listen(ENV.PORT, () => {
    console.log("app is running SuccessFullyy at port 300 ");
    
})
