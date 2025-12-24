// const express = require("express")  -- common js 
import express from "express"
import { ENV } from "./lib/env.js"

// Create Server 
const app = express()


// Then Snd Get Http Request 
app.get('/' , (req,res) => {
    res.json("Hello Welcome To The Project what ar ")
})

console.log(ENV.PORT);

app.listen(ENV.PORT, () => {
    console.log("app is running SuccessFullyy at port 300 ");
    
})
