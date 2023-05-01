/* DISCORD AUTH */
export const REDIRECT_CALLBACK = "https://evm-runners.fly.dev/auth/discord/";
export const DISCORD_REDIRECT = `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${REDIRECT_CALLBACK}`;
export const DISCORD_GET_USER_TOKEN = "https://discord.com/api/oauth2/token";
export const DISCORD_GET_USER_INFO = "https://discord.com/api/users/@me";

/* SOLUTION TESTING */
export const BYTECODE_REGEX: RegExp = /^0x[0-9A-Fa-f]+$/;
export const FORGE_TEST_COMMAND = "forge test --silent --json --match-contract";
