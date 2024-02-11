import mongoose from "mongoose";
import {DB_NAME} from "../contant.js"

async function connectDB () {
 
    const { connection } = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("MONGO DB is CONNECTED ON HOST : ", connection.host);
}


export default connectDB;