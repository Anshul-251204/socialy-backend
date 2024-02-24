import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
	cors({
		origin: [
			"http://localhost:5173/",
			"https://socially-frontend.vercel.app/",
		],
		credentials:true
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comments.routes.js";
import likeRouter from "./routes/like.routes.js";
import storyRouter from "./routes/story.routes.js";
import followRouter from "./routes/follow.routes.js";
import messageRouter from "./routes/message.routes.js";
import conversationRouter from "./routes/conversation.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

app.get("/", (req, res) => {
	res.send("working fine");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/stories", storyRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/conversations", conversationRouter);

export default app;

app.use(errorMiddleware);
