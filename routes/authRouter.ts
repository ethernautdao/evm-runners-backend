import express, { Request, Response } from 'express';
import { DISCORD_GET_USER_INFO, DISCORD_GET_USER_TOKEN, DISCORD_REDIRECT, REDIRECT_CALLBACK } from '../utils/constants';
import { User } from '../model/user';
import { insertOrUpdateUser } from '../controller/userController';

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
            .then(async (response: any) => {
                if (!response.ok) {
                    return res.status(500).json({ error: "Get user info response was not ok" });
                }

                let userInfo = await response.json();
                let formattedTimestamp = Date.now() + data.expires_in * 1000;

                const newUser: User = {
                    discord_id: userInfo.id,
                    pin: generatePIN(),
                    name: userInfo.username,
                    discriminator: userInfo.discriminator,
                    code: code as string,
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    expires_in: formattedTimestamp,
                    admin: false
                };

                await insertOrUpdateUser(newUser);

                return res.status(200).send(`PIN code: ${newUser.pin}`);;
            })
            .catch((error: any) => {
                return res.status(500).json({ error: error });
            });
    });
});

function generatePIN() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomStr1 = "";
    let randomStr2 = "";

    for (let i = 0; i < 4; i++) {
        randomStr1 += chars.charAt(Math.floor(Math.random() * chars.length));
        randomStr2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${randomStr1}-${randomStr2}`;
};

export default authRouter;
