import {StreamChat} from "stream-chat";
import { ENV } from "./env.js";
import {StreamClient} from "@stream-io/node-sdk"

const apikey = ENV.STREAM_API_KEY
const apisecret = ENV.STREAM_API_SECRET

if (!apikey || !apisecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const streamClient = new StreamClient(apikey , apisecret); // This IS Used For Video Call 
export const chatClient =  StreamChat.getInstance(apikey , apisecret); // This Is For Chat Messaging

export const upsertStreamUser = async (userdata) => {

    try{

        await chatClient.upsertUser(userdata);
        console.log("Successfully upserted User" ,userdata);
        

    } catch (e){
         console.error("Erorr In Upserting Stream User" , e);
         
    }
};



export const deleteStreamUser = async (userid) => {

    try{

        await chatClient.deleteUser(userid)
        console.log("Stream User Deleted Successfully " , userid);
        

    } catch (e){
         console.error("Erorr In Deleteing Stream User" , e);
         
    }
}    