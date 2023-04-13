import express, { Request, Response } from 'express';
import { DISCORD_GET_USER_INFO, DISCORD_GET_USER_TOKEN, DISCORD_REDIRECT, REDIRECT_CALLBACK } from '../utils/constants';
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

    fetch(DISCORD_GET_USER_TOKEN, { method: "POST", body: body }).then((response: any) => response.json()).then((data: any) => {
        fetch(DISCORD_GET_USER_INFO, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${data.access_token}`,
                "Content-Type": "application/json"
            }
        })
            .then((response: any) => {
                if (!response.ok) {
                    return res.status(500).json({ error: "Get user info response was not ok" });
                }
                return response.json();
            })
            .then((data: any) => {
                res.status(200).send(data);
            })
            .catch((error: any) => {
                return res.status(500).json({ error: error });
            });
    });
});

export default authRouter;
