import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));





import userRouter  from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comments.routes.js";
import likeRouter from "./routes/like.routes.js";
import storyRouter from "./routes/story.routes.js";
import followRouter from "./routes/follow.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/stories",storyRouter);
app.use("/api/v1/follows",followRouter);

export default app;
