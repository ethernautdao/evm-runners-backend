import {
  WalletClient,
  createWalletClient,
  createPublicClient,
  Abi,
  http,
  PrivateKeyAccount,
  PublicClient,
  toHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { CONTRACT_ABI } from "./utils/constants";
import { Submission } from "./model/submission";
import { getUserById } from "./controller/userController";
import { getLevelById } from "./controller/levelController";

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
    console.log(error);
  }
};

connect();

const storeSubmissionOnChain = async (
  user_id: number,
  level_id: number,
  submissions: Submission[]
) => {
  const user = await getUserById(user_id);
  const level = await getLevelById(level_id);

  for (const s of submissions) {
    const { request } = await ethereumClient.simulateContract({
      account: account,
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "submitSubmission",
      args: [
        user?.wallet_address,
        s?.id,
        s?.level_id,
        level?.name,
        s?.user_id,
        user?.name,
        s?.bytecode,
        s?.gas,
        s?.size,
        Date.parse(s?.submitted_at.toString()),
        s?.type,
        s?.optimized_for,
      ],
    });

    const tx = await walletClient.writeContract(request);
  }
};

export { storeSubmissionOnChain };
