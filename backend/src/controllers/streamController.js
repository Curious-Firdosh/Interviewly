import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../model/Session.js";

export const  createSession = async (req,res) =>  {

    try{
        // user send some data 
        const {problem , difficulty } = req.body

        const userId = req.user.id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).json({message : "Problem  and Difficulty are Required"})
        };

        // generate Unique Call Id For Stream Video Call
        const callId = `session_${Date.now()}_${Math.random().toString().substring(7)}`;

        // create session  in db 
        const session = await Session.create({
            problem,
            difficulty,
            host : userId ,
            callId
        });

        // Create stream Video calll 
        await streamClient.video.call("default" , callId).getOrCreate({
            data : {
                created_by_id : clerkId,
                custom : {problem , difficulty , sessionId : session._id.toString() },
            }
        });

        // Chat Messageing Channel Creation Can Be Done Here

        const channel = chatClient.channel("messaging" , callId , {
            name : `${problem} Session`,
            created_by_id : clerkId,
            members :[clerkId]
        });

        return res.status(201).json({
            session
        })
    }
    catch (e) {
        console.log("Erorr While Creating Session " , e);
        return res.status(500).json({
            message : "Internal Server Error",
            data : e
        })
        
    }
};

export const  getActiveSessions = async (_ , res) => {
    
    try {
         
            const sessions = await Session.find({status : "Active"}
                            .populate("host" , "name profileImage email clerkId")
                            .sort({createdAt : -1})
                            .limit(20)
            );

            return res.status(200).json({
                message : "Successfully fetched  Active Session",
                sessions
            })
    }
    catch (e) {
        console.log("Erorr While  geting ActiveSessions  " , e);
        return res.status(500).json({
            message : "Internal Server Error",
            data : e
        })
        
    }
}

export const  getRecentSessions = async (req,res)  => {
    
    try {
            // getting the session where user is either host or participant 
            const userId = req.user._id 

            const recentSessions = await Session.find({
                status : "Compleated",
                $or : [{host : userId} , {participant : userId}]
            })
            .sort({createdAt : -1})
            .limit(20);

            return res.status(200).json({
                message : "Successfully fetched Completed Sessions",
                recentSessions
            })

    }
    catch (e) {
        console.log("Erorr While  geting RecentSessions " , e);
        return res.status(500).json({
            message : "Internal Server Error",
            data : e
        })
        
    }
}

export const  getSessionbyId = async (req,res) => {
    
    try {

        const {id} = req.params

        const selectedSession = await Session.findById(id)
                                             .populate("host" , "name  profileImage email clerkId ")
                                             .populate("participant" , "name profileImage email clerkId ")
        
         if(!selectedSession) {
            return res.status(404).json({
                message : "Id Details Not Found IN Db "
            })
        };

        return res.status(200).json({
            message : "Session Fetched SuccessFully ",
            selectedSession
        })
    }
    catch (e) {
        console.log("Erorr While gettingSession by Id " , e);
        return res.status(500).json({
            message : "Internal Server Error",
            data : e
        })
        
    }
}

export const  joinSession = async (req,res) =>  {
    
    try {
         const {id} = req.params ;

         const userId = req.user._id ;
         const clerkId = req.user.clerkId ;

         const session = await Session.findById(id);

         if(!session) {
            return res.status(404).json({
                message : "Id Details Not Found IN Db "
            })
        };

        
         if( session.status !== "Active") {
            return res.status(404).json({
                message : "Cannot Join To Completed Session "
            })
        };

         if( session.host.toString() ===  userId.toString()) {
            return res.status(400).json({
                message : "Host Can Not Join Its Own Session  "
            })
        };



        // Cheack Session is Full  has a participent 
        if(session.participant) {
            return res.status(409).json({
                message : "Session Is Full "
            })
        };

        session.participant = userId;

        await session.save();

        const channel = chatClient.channel("messaging" , session.callId);

        await channel.addMembers(clerkId);

        return res.status(200).json({
            message : "Session Joined SuccessFully SuccessFully ",
            session
        })

        
    }
    catch (e) {
        console.log("Erorr While Joining Session " , e);
        return res.status(500).json({
            message : "Internal Server Error",
            data : e
        })
        
    }
}




export const  endSession = async (req,res) => {
    
    try {

        const {id} = req.params

        const userId = req.user._id;

        const session = await Session.findById(id);

         if(!session) {
            return res.status(404).json({
                message : "Id Details Not Found IN Db "
             });
         }

        // cheack user is host or not 

        if(session.host.toString() !== userId.toString){
            return res.status.json({
                    message : "Only host can end the session "
            })
        }

        // Cheack Sessoin Is Completed OR Not 

        if(session.status === "Compleated"){
            return res.status(400).json({
                message : "Session Is Already Compleated "
            })
        };

        session.status = "Compleated"

       // delete the Stream Video Call 
        const call = streamClient.video.call("default" , session.callId);
        await call.delete({hard : true})


        // delete the Stream Chat

        const channel = chatClient.channel("messaging" , session.callId);
        await channel.delete();


        res.status(200).json({
            message : "Session Ended SuccessFully"
        })


    }
    catch (e) {
        console.log("Erorr While Ending Session " , e);
        return res.status(500).json({
            message : "Internal Server Error",
            data : e
        })
        
    }
}

