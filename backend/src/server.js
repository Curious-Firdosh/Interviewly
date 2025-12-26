// const express = require("express")  -- common js 
import express from "express"
import { ENV } from "./lib/env.js"
import { connectDb } from "./lib/db.js"
import cors from "cors"
import { inngest , functions} from "./lib/ingest.js"
import { serve } from "inngest/express"



//@ Create Server 
const app = express();



//@ Add Middilewares 
app.use(express.json());

// ! Cors : cross origin Creadential : true --> server allows browser to include cookies on request 
app.use(cors({ origin : ENV.CLIENT_URL , credentials : true}))

app.use('/api/inngest' , serve({client : inngest , functions}))


//** Give me my project’s main folder path.”
// const __dirname = path.resolve()

//** Then Send Get Http Request 
app.get('/testing' , (req,res) => {
    res.json("Hello Welcome To The Project what ar ")
});

app.post('/testing-post' , (req,res) => {
    const data = req.body;
    console.log("Data Received " , data);
    res.json({message : "Data Received Successfully" , data})
});


// //** Removed THAT LINE BECOUSE THAT IS GIVING MORE LOAD TO THE SERVER
// if(ENV.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));

//     app.get("/{*any}" , (req,res) => {
//         res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"))
//     })
// }


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