import {
  WalletClient,
  createWalletClient,
  createPublicClient,
  Abi,
  http,
  PrivateKeyAccount,
  PublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, sepolia } from "viem/chains";
import { CONTRACT_ABI } from "./utils/constants";
import { Submission } from "./model/submission";

let ethereumClient: PublicClient;
let account: PrivateKeyAccount;
let walletClient: WalletClient;

const connect = async () => {
  try {
    account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

    ethereumClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });

    walletClient = createWalletClient({
      chain: sepolia,
      transport: http(),
    });
  } catch (error) {
    console.log(error);
  }
};

connect();

const storeSubmissionOnChain = async (submission: Submission) => {
  console.log("## HERE");
  const { request } = await ethereumClient.simulateContract({
    account: account,
    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI as Abi,
    functionName: "submitSubmission",
    args: [submission],
  });
  await walletClient.writeContract(request);
};

export { storeSubmissionOnChain };
