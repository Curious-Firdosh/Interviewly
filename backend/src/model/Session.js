 import mongoose, { Schema } from "mongoose";


 // session means the user who start that 
const  SessionSchema = new mongoose.Schema({

    problem : {
        type : String ,
        required : true
    },
    difficulty : {
        type : String,
        enum : ["Easy" , "Medium" , "Hard"],
        required : true,
    },
    host : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"User",
        required : true
    },
    participant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null

    },
    status : {
        type : String ,
        enum : ["Active" , "Compleated"],
        default : "Active"

    }, // Stream Video Call Id
    callId : {
        type : String,
        default : ""

    }

  } , 
  {timestamps : true}
)

const Session = mongoose.model("Session" , SessionSchema);

export default Session;