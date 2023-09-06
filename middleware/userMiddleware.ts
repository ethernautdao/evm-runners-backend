import { NextFunction, Request, Response } from "express";
import {
  isValidNumber,
  isValidString,
  isValidWalletAddress,
} from "../utils/shared";

export const checkUserIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isValidNumber(req.params.id)) {
    return res
      .status(400)
      .json({ error: "Invalid id: Must be a valid number." });
  }

  next();
};

export const checkUserPinMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isValidString(req.params.pin)) {
    return res
      .status(400)
      .json({ error: "Invalid pin: Must be a valid string." });
  }

  next();
};

export const checkWalletAddressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isValidWalletAddress(req.body.address ?? req.params.address)) {
    return res
      .status(400)
      .json({ error: "Invalid address: Must be a well formed address." });
  }

  next();
};

export const postUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const { validUser, userError } = isValidUser(name);

  if (!validUser) {
    return res.status(400).json({ error: userError });
  }

  next();
};

const isValidUser = (name: any) => {
  if (!isValidString(name)) {
    return {
      validUser: false,
      userError: "Invalid name: Must be a valid string",
    };
  }

  return { validUser: true, userError: undefined };
};
