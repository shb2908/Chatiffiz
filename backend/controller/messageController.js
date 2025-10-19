import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
export const allMessages = async (req, res) => {
    try {
        console.log(req.params.chatId);
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name profilePic")
            .populate("chat");
        return res.json({ success: true, message: messages });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.json({ success: false, message: "Data missing" });
    }

    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "Sender ID invlaid" })

    const newMessage = {
        sender: user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        // message = await Message.populate("sender", "name").execPopulate();
        // message = await Message.populate("chat").execPopulate();
        message = await message.populate("sender", "name profilePic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name profilePic",
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.json({ success: true, message: message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
