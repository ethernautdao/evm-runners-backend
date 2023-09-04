import { ETH_ADDRESS_REGEX } from "./constants";

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
}
