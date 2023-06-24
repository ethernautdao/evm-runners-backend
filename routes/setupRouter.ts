import express, { Request, Response } from "express";
import { SETUP_URL } from "../utils/constants";

const setupRouter = express.Router();

setupRouter.get("/", async (req: Request, res: Response) => {
  try {
    res.set("Content-Type", "text/plain");
    res.send(`curl -L ${SETUP_URL}| bash`);
  } catch (error) {
    res.status(500).send("Error retrieving the install script");
  }
});

export default setupRouter;
