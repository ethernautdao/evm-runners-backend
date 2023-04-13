import express, { Request, Response } from 'express';
import { DISCORD_GET_TOKEN, DISCORD_REDIRECT, REDIRECT_CALLBACK } from '../utils/constants';
const fetch = require("node-fetch");

const authRouter = express.Router();

authRouter.get("/", (req: Request, res: Response) => {
    res.redirect(DISCORD_REDIRECT);
});

authRouter.get("/discord", async (req: Request, res: Response) => {
    const code = req.query["code"]
    const body = new URLSearchParams({
        'client_id': `${process.env.CLIENT_ID}`,
        'client_secret': `${process.env.CLIENT_SECRET}`,
        'grant_type': 'authorization_code',
        'redirect_uri': `${REDIRECT_CALLBACK}`,
        'code': `${code}`
    });

    fetch(DISCORD_GET_TOKEN, { method: "POST", body: body }).then((response: any) => response.json()).then((data: any) => {
        res.send('AUTHORIZED: ' + JSON.stringify(data));
    });
});

export default authRouter;
