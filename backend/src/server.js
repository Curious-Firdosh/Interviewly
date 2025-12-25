// const express = require("express")  -- common js 
import express from "express"
import { ENV } from "./lib/env.js"
import { connectDb } from "./lib/db.js"

// Create Server 
const app = express()


// Then Snd Get Http Request 
app.get('/' , (req,res) => {
    res.json("Hello Welcome To The Project what ar ")
});


// Best Way To Start The Server 
const startServer = async () => {

    try {
        
        await  connectDb();
        app.listen(ENV.PORT, () => {
            console.log(`app is running SuccessFullyy at port ${ENV.PORT}`) 
        })

    }
    catch(e) {
        console.error("Faild To Start Server " , e);
    }
}


// Calling TO Start the server 
startServer();