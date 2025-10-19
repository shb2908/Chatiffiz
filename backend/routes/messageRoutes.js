import express from "express";
import userAuth from "../middleware/userAuth.js";
import { allMessages, sendMessage } from "../controller/messageController.js";

const messageRouter = new express.Router();

messageRouter.get("/:chatId", userAuth, allMessages);
messageRouter.post("/", userAuth, sendMessage);

export default messageRouter;