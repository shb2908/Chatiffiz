import express from "express";
import userAuth from "../middleware/userAuth.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controller/chatController.js";


const chatRouter = express.Router();

chatRouter.post("/", userAuth, accessChat);
chatRouter.get("/", userAuth, fetchChats);
chatRouter.post("/group", userAuth, createGroupChat);
chatRouter.put("/rename", userAuth, renameGroup);
chatRouter.put("/groupremove", userAuth, removeFromGroup);
chatRouter.put("/groupadd", userAuth, addToGroup);

export default chatRouter;