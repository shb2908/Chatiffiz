import express from 'express'
import { isAuthenticated, login, logout, register } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';
//import { login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authcontroller.js';


const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);



export default authRouter

