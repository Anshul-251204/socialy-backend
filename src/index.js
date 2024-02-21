import { config } from "dotenv";
config({
    path:"./.env"
})
import connectDB from "./db/connect.db.js";
import { v2 as cloudinary } from "cloudinary";
import app from "./app.js";


connectDB()
	.then(() => {
		app.listen(process.env.PORT, () =>
			console.log("⚙️  SERVER IS RUNNING ON PORT : ", process.env.PORT)
		);
	})
	.catch((err) => console.log("MONGO-DB CONNECTION IS FAILED : ", err));

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});