// const express = require("express")  -- common js 
import express from "express"
import { ENV } from "./lib/env.js"
import { connectDb } from "./lib/db.js"
import cors from "cors"
import { inngest , functions} from "./lib/ingest.js"
import { serve } from "inngest/express"
import path from "path";
import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from "./middleware/protectRoute.js"
import chatRoute from "../src/routes/chatRoute.js"
import sessionRoute from "../src/routes/sessionRoute.js"


//@ Create Server 
const app = express();



//@ Add Middilewares 
app.use(express.json());

// ! Cors : cross origin Creadential : true --> server allows browser to include cookies on request 
app.use(cors({ origin : ENV.CLIENT_URL , credentials : true}))

app.use('/api/inngest' , serve({client : inngest , functions}));

// ! authentication middleware for clerk doing this will add user object to req
app.use(clerkMiddleware());

// for chatting and Video Cal
app.use('api/chat' , chatRoute)
app.use('api/sessions' , sessionRoute)


//** Give me my project’s main folder path.”
 const __dirname = path.resolve()

//** Then Send Get Http Request 
app.get('/testing' , (req,res) => {
    res.json("Hello Welcome To The Project what ar ")
});

app.get('/video-call',protectRoute, async(req , res) => {

    res.status(401).json({
        message : "This Is Protected Route"
    })
})

app.post('/testing-post' , (req,res) => {
    const data = req.body;
    console.log("Data Received " , data);
    res.json({message : "Data Received Successfully" , data})
});


//** Removed THAT LINE BECOUSE THAT IS GIVING MORE LOAD TO THE SERVER
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}" , (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"))
    })
}


// !! Best Way To Start The Server 
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