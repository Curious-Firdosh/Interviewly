// Imported All The Things
import { Inngest } from "inngest"
import { connectDb } from "./db.js"
import User from "../model/User.js"
import { deleteStreamUser, upsertStreamUser } from "./stream.js";


// it allows us to talk with ingest 
export const inngest =  new Inngest({id : "interviewlyyy"})


const createUserInDB =  inngest.createFunction (

    {id : "createUser"},
    {event : "clerk/user.created"},

    async({event}) => {
        
        
        await connectDb();
        
        const {id , email_addresses , first_name , last_name , image_url} = event.data;

         // CONNECTION WITH THE DB To Save the user 
        const newUser = {
            clerkId : id ,
            email : email_addresses[0]?.email_address,
            name : `${first_name || ""} ${last_name || ""}`,
            profileImage : image_url

        };

        await User.create(newUser);

        // CONNECTION WITH THE STREAM USER 
        await upsertStreamUser({
            id : newUser.clerkId.toString(),
            name  : newUser.name ,
            image : newUser.profileImage,
        });
    }
);


const deleteUserFromDB =  inngest.createFunction (

    {id : "deleteUser"},
    {event : "clerk/user.deleted"},

    async({event}) => {
        await connectDb();
        
        const {id} = event.data;

        await User.deleteOne({clerkId : id});
        await deleteStreamUser(id.toString())
    }
);

export const functions = [createUserInDB , deleteUserFromDB]