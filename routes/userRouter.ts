import express, { Request, Response } from "express";
import {
  addWalletAddress,
  getUserById,
  getUserByPin,
  getUserByWalletAddress,
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

userRouter.get(
  "/wallet/:address?",
  checkAuthorizationTokenExistsMiddleware,
  checkIsAdminMiddleware,
  checkWalletAddressMiddleware,
  async (req: Request, res: Response) => {
    res.send(await getUserByWalletAddress(req.params.address));
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

/*userRouter.post("/", postUserMiddleware, async (req: Request, res: Response) => {
    res.send(await insertOrUpdateUser(req.body));
});

userRouter.delete("/:id?", checkUserIdMiddleware, async (req: Request, res: Response) => {
    res.send(await deleteUser(Number.parseInt(req.params.id)));
});*/

export default userRouter;
