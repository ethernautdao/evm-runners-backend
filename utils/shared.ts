import { ETH_ADDRESS_REGEX } from "./constants";
import * as crypto from 'crypto';

export const isValidNumber = (number: any) => {
  let parsed = Number.parseInt(number);
  return !(typeof parsed === "number") || isNaN(parsed) ? false : true;
};

export const isValidString = (string: any) => {
  return !(typeof string === "string") || "" === string ? false : true;
};

export const formatAccessToken = (header: string) => {
  return header?.split(" ")[1] ?? "";
};

export const isValidWalletAddress = (address: string) => {
  return ETH_ADDRESS_REGEX.test(address);
};

export const generateSHA256Hash = (bytecode: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(bytecode, 'utf-8');
  return hash.digest('hex');
};
