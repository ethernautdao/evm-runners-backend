export interface User {
  id?: number;
  pin: string;
  discord_id: number;
  name: string;
  code: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  wallet_address?: string;
  admin: boolean;
}
