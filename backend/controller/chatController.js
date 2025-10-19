import msgModel from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export const accessChat = async (req, res) => {
    const { recvId } = req.body;

    if (!recvId) {
        return res.json({ success: false, message: "User ID not sent" });
    }

    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "Sender ID invlaid" })

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: user._id } } },
            { users: { $elemMatch: { $eq: recvId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name",
    });

    if (isChat.length > 0) {
        res.send({ success: true, message: isChat[0] });
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [user._id, recvId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.json({ success: true, message: FullChat });
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
    }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
export const fetchChats = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId)
        if (!user) return res.json({ success: false, message: "Invalid UserID" });
        Chat.find({ users: { $elemMatch: { $eq: user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name",
                });
                res.json({ success: true, message: results });
            });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
export const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.json({ success: false, message: "Fields missing" });
    }

    const users = JSON.parse(req.body.users);


    const { userId } = req.body;
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }
    const user = await User.findById(userId)
    if (!user) return res.json({ success: false, message: "invalid user ID" })

    users.push(user);
    // JSON.stringify['679217c47a36fa486410a296', '6792181f7a36fa486410a29c']
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return res.json({ success: true, message: fullGroupChat });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        return res.json({ success: false, message: "Chat not found" });
    } else {
        return res.json({ success: true, message: updatedChat });
    }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
export const removeFromGroup = async (req, res) => {
    const { chatId, addId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: addId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        return res.json({ success: false, message: "Chat not found" });
    } else {
        return res.json({ success: true, message: removed });
    }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
export const addToGroup = async (req, res) => {
    const { chatId, addId } = req.body;
    console.log(addId)
    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: addId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        return res.json({ success: false, message: "Chat not found" });
    } else {
        return res.json({ success: true, message: added });
    }
};
