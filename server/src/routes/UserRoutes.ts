import express from "express"
import { getAllUsers, getcurrentUser, getUserById } from "../controllers/UserController.js";
import { requireAuth } from "../middleware/clerkMiddleware.js";

const userRouter = express.Router();

userRouter.get('/me',requireAuth,getcurrentUser);
userRouter.get('/allUsers',requireAuth,getAllUsers);
userRouter.get('/:id',requireAuth,getUserById);

export default userRouter