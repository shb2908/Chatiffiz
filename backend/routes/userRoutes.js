import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserData, allUsers } from '../controller/userController.js';


const userRouter = express.Router();

userRouter.get('/all', userAuth, allUsers);
userRouter.get('/data', userAuth, getUserData);

export default userRouter;