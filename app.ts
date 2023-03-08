import "dotenv/config";
import express, { Express } from "express";
import levelsRouter from "./routes/levelRouter";
import submissionRouter from "./routes/submissionRouter";
import userRouter from "./routes/userRouter";

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/users", userRouter);
app.use("/levels", levelsRouter);
app.use("/submissions", submissionRouter);

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
