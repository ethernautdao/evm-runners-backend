import "dotenv/config";
import express, { Express } from "express";
import levelsRouter from "./routes/levelRouter";
import submissionRouter from "./routes/submissionRouter";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import {
  checkGetRequestLimit,
  checkPostRequestLimit,
} from "./middleware/rateLimiterMiddleware";

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// Apply rate limiter middleware for GET requests
app.get("*", checkGetRequestLimit);

// Apply rate limiter middleware for POST requests
app.post("*", checkPostRequestLimit);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/levels", levelsRouter);
app.use("/submissions", submissionRouter);

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
