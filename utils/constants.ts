/* SETUP */
export const SETUP_URL =
  "https://raw.githubusercontent.com/ethernautdao/evm-runners-cli/main/install.sh";

/* CACHE KEYS */
export const LEVELS_CACHE_KEY = "levels";
export const USERS_CACHE_KEY = "users";
export const SUBMISSIONS_CACHE_KEY = "submissions";
export const GAS_LEADERBOARDS_CACHE_KEY = "gas-leaderboard";
export const SIZE_LEADERBOARDS_CACHE_KEY = "size-leaderboard";

/* DISCORD AUTH */
export const REDIRECT_CALLBACK = "https://api.evmr.sh/auth/discord/";
export const DISCORD_REDIRECT = `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${REDIRECT_CALLBACK}`;
export const DISCORD_GET_USER_TOKEN = "https://discord.com/api/oauth2/token";
export const DISCORD_GET_USER_INFO = "https://discord.com/api/users/@me";

/* SOLUTION TESTING */
export const BYTECODE_REGEX: RegExp = /^0x[0-9A-Fa-f]+$/;
export const FORGE_TEST_COMMAND =
  "forge test --silent --json --block-prevrandao $BLOCK_PREV_RANDAO --match-contract";
export const MIN_BLOCK_NUMBER = 17273644;
export const MIN_BLOCK_DIFFICULTY = 5.8750003716598352816469e22;

/* ADDRESS REGEX */
export const ETH_ADDRESS_REGEX: RegExp = /^0x[a-fA-F0-9]{40}$/;

/* ETHEREUM */
export const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "userAddress", type: "address" }],
    name: "getSubmissionsForUser",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "level_id", type: "uint256" },
          { internalType: "string", name: "level_name", type: "string" },
          { internalType: "uint256", name: "user_id", type: "uint256" },
          { internalType: "string", name: "user_name", type: "string" },
          { internalType: "string", name: "bytecode", type: "string" },
          { internalType: "uint256", name: "gas", type: "uint256" },
          { internalType: "uint256", name: "size", type: "uint256" },
          { internalType: "uint256", name: "submitted_at", type: "uint256" },
          { internalType: "string", name: "solutionType", type: "string" },
          { internalType: "string", name: "optimized_for", type: "string" },
        ],
        internalType: "struct SubmissionContract.Submission[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "submissionsToUser",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "level_id", type: "uint256" },
      { internalType: "string", name: "level_name", type: "string" },
      { internalType: "uint256", name: "user_id", type: "uint256" },
      { internalType: "string", name: "user_name", type: "string" },
      { internalType: "string", name: "bytecode", type: "string" },
      { internalType: "uint256", name: "gas", type: "uint256" },
      { internalType: "uint256", name: "size", type: "uint256" },
      { internalType: "uint256", name: "submitted_at", type: "uint256" },
      { internalType: "string", name: "solutionType", type: "string" },
      { internalType: "string", name: "optimized_for", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "level_id", type: "uint256" },
      { internalType: "string", name: "level_name", type: "string" },
      { internalType: "uint256", name: "user_id", type: "uint256" },
      { internalType: "string", name: "user_name", type: "string" },
      { internalType: "string", name: "bytecode", type: "string" },
      { internalType: "uint256", name: "gas", type: "uint256" },
      { internalType: "uint256", name: "size", type: "uint256" },
      { internalType: "uint256", name: "submitted_at", type: "uint256" },
      { internalType: "string", name: "type_", type: "string" },
      { internalType: "string", name: "optimized_for", type: "string" },
    ],
    name: "submitSubmission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
