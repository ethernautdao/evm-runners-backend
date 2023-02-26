import "dotenv/config";
import express, { Express, Request, Response } from "express";
import leaderboardRouter from "./routes/leaderboard";
import levelsRouter from "./routes/levels";

const app: Express = express();
const port = process.env.PORT;

app.use("/leaderboard", leaderboardRouter);
app.use("/levels", levelsRouter);

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
