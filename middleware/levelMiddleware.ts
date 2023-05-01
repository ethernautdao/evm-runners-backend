import { NextFunction, Request, Response } from "express";
import { isValidNumber, isValidString } from "../utils/shared";

export const checkLevelIdMiddleware = (
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

export const postLevelMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, position, test_contract } = req.body;
  const { validLevel, levelError } = isValidLevel(
    name,
    position,
    test_contract
  );

  if (!validLevel) {
    return res.status(400).json({ error: levelError });
  }

  next();
};

const isValidLevel = (name: any, position: any, test_contract: any) => {
  if (!isValidString(name)) {
    return {
      validLevel: false,
      levelError: "Invalid name: Must be a valid string",
    };
  }

  if (!isValidNumber(position)) {
    return {
      validLevel: false,
      levelError: "Invalid position: Must be a valid number",
    };
  }

  if (!isValidString(test_contract)) {
    return {
      validLevel: false,
      levelError: "Invalid test contract: Must be a valid string",
    };
  }

  return { validLevel: true, levelError: undefined };
};
