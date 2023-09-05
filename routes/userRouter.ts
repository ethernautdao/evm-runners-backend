import express, { Request, Response } from "express";
import {
  addWalletAddress,
  getUserById,
  getUserByPin,
  getUsers,
} from "../controller/userController";
import {
  checkUserIdMiddleware,
  checkUserPinMiddleware,
  checkWalletAddressMiddleware,
} from "../middleware/userMiddleware";
import {
  checkAuthorizationTokenExistsMiddleware,
  checkIsAdminMiddleware,
} from "../middleware/authMiddleware";
import { formatAccessToken } from "../utils/shared";

const userRouter = express.Router();

userRouter.get(
  "/",
  checkAuthorizationTokenExistsMiddleware,
  checkIsAdminMiddleware,
  async (req: Request, res: Response) => {
    res.send(await getUsers());
  }
);

userRouter.get(
  "/:id?",
  checkAuthorizationTokenExistsMiddleware,
  checkIsAdminMiddleware,
  checkUserIdMiddleware,
  async (req: Request, res: Response) => {
    res.send(await getUserById(Number.parseInt(req.params.id)));
  }
);

userRouter.get(
  "/info/:pin?",
  checkUserPinMiddleware,
  async (req: Request, res: Response) => {
    res.send(await getUserByPin(req.params.pin));
  }
);

userRouter.post(
  "/wallet",
  checkAuthorizationTokenExistsMiddleware,
  checkWalletAddressMiddleware,
  async (req: Request, res: Response) => {
    res.send(
      await addWalletAddress(
        req.body.address,
        formatAccessToken(req.headers.authorization ?? "")
      )
    );
  }
);

export default userRouter;
