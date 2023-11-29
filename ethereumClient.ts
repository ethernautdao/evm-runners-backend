import {
  WalletClient,
  createWalletClient,
  createPublicClient,
  http,
  PrivateKeyAccount,
  PublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { CONTRACT_ABI } from "./utils/constants";
import { Submission } from "./model/submission";
import { getUserById } from "./controller/userController";
import { getLevelById } from "./controller/levelController";

enum SubmissionTypeConverter {
  "solidity" = 0,
  "yul" = 1,
  "vyper" = 2,
  "huff" = 3,
  "bytecode" = 4,
}

enum SubmissionOptimizedForConverter {
  "gas" = 0,
  "size" = 1,
}

let ethereumClient: PublicClient;
let account: PrivateKeyAccount;
let walletClient: WalletClient;
const transport = http(process.env.API_URL);

const connect = async () => {
  try {
    account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    ethereumClient = createPublicClient({
      chain: sepolia,
      transport,
    });

    walletClient = createWalletClient({
      chain: sepolia,
      transport,
    });
  } catch (error) {
    console.log("## ETHEREUM CLIENT CONNECT ERROR: ", error);
  }
};

connect();

const storeSubmissionOnChain = async (
  user_id: number,
  submissions: Submission[]
) => {
  const user = await getUserById(user_id);
  for (const s of submissions) {
    const { request } = await ethereumClient.simulateContract({
      account: account,
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "submit",
      args: [
        user?.wallet_address,
        {
          id: s?.id,
          level_id: s?.level_id,
          gas: s?.gas,
          size: s?.size,
          solutionType:
            SubmissionTypeConverter[
              s?.type as keyof typeof SubmissionTypeConverter
            ], //just to avoid warnings
          optimized_for:
            SubmissionOptimizedForConverter[
              s?.optimized_for as keyof typeof SubmissionOptimizedForConverter
            ], //just to avoid warnings
          submitted_at: Date.parse(s?.submitted_at.toString()),
          user_name: user?.name,
        },
      ],
    });

    await walletClient.writeContract(request);
  }
};

export { storeSubmissionOnChain };
