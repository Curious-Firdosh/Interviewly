// Imported All The Things
import { Inngest } from "inngest"
import { connectDb } from "./db.js"
import User from "../model/User.js"


// it allows us to talk with ingest 
export const inngest =  new Inngest({id : "interviewlyyy"})


const createUserInDB =  inngest.createFunction (

    {id : "createUser"},
    {event : "clerk/user.created"},

    async({event}) => {
        await connectDb();
        
        const {id , email_addresses , first_name , last_name , image_url} = event.data;

        const newUser = {
            clerkId : id ,
            email : email_addresses[0]?.email_address,
            name : `${first_name || ""} ${last_name || ""}`,
            profileImage : image_url

        };

        await User.create(newUser)
    }
);


const deleteUserFromDB =  inngest.createFunction (

    {id : "deleteUser"},
    {event : "clerk/user.deleted"},

    async({event}) => {
        await connectDb();
        
        const {id} = event.data;

        await User.deleteOne({clerkId : id})
    }
);

export const functions = [createUserInDB , deleteUserFromDB]