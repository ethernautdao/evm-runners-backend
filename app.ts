import "dotenv/config";
import express, { Express } from "express";
import leaderboardRouter from "./routes/leaderboardRouter";
import levelsRouter from "./routes/levelsRouter";
import submissionRouter from "./routes/submissionRouter";

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/leaderboard", leaderboardRouter);
app.use("/levels", levelsRouter);
app.use("/submissions", submissionRouter);

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
