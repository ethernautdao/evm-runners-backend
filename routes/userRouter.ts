import express, { Request, Response } from 'express';
import { deleteUser, getUserById, getUsers, insertOrUpdateUser } from '../controller/userController';
import { checkUserIdMiddleware, postUserMiddleware } from '../middleware/userMiddleware';

const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
    res.send(await getUsers());
});

userRouter.get("/:id?", checkUserIdMiddleware, async (req: Request, res: Response) => {
    res.send(await getUserById(Number.parseInt(req.params.id)));
});

userRouter.post("/", postUserMiddleware, async (req: Request, res: Response) => {
    res.send(await insertOrUpdateUser(req.body));
});

userRouter.delete("/:id?", checkUserIdMiddleware, async (req: Request, res: Response) => {
    res.send(await deleteUser(Number.parseInt(req.params.id)));
});

export default userRouter;
