import "dotenv/config";
import express, { Express, Request, Response } from "express";
import { getLeaderboard, getLevelById, getLevels } from "./db";

const app: Express = express();
const port = process.env.PORT;

app.get("/levels", async (req: Request, res: Response) => {
  res.send(await getLevels());
});

app.get("/levels/:id?", async (req: Request, res: Response) => {
  res.send(await getLevelById(req.params.id));
});

app.get("/leaderboard", async (req: Request, res: Response) => {
  res.send(await getLeaderboard());
});

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
