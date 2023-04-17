import express, { Request, Response } from 'express';
import { deleteUser, getUserById, getUserByPin, getUsers, insertOrUpdateUser } from '../controller/userController';
import { checkUserIdMiddleware, checkUserPinMiddleware, postUserMiddleware } from '../middleware/userMiddleware';

const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getUsers());
});

userRouter.get("/:id?", checkUserIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getUserById(Number.parseInt(req.params.id)));
});

userRouter.get("/info/:pin?", checkUserPinMiddleware, async (req: Request, res: Response) => {
    res.send(await getUserByPin(req.params.pin));
});

userRouter.post("/", postUserMiddleware, async (req: Request, res: Response) => {
    res.send(await insertOrUpdateUser(req.body));
});

userRouter.delete("/:id?", checkUserIdMiddleware, async (req: Request, res: Response) => {
    res.send(await deleteUser(Number.parseInt(req.params.id)));
});

export default userRouter;
