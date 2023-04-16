export interface User {
    id?: number;
    discord_id: number;
    name: string;
    discriminator: number;
    code: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    admin: boolean;
};
