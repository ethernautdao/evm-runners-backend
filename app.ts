import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { getLeaderboard } from "./db";

const app: Express = express();
const port = process.env.PORT;

app.get("/leaderboard", async (req: Request, res: Response) => {
  res.send(await getLeaderboard());
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
