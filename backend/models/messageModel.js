import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
},
    { timestamps: true }
)

const msgModel = mongoose.models.msg || mongoose.model('Message', msgSchema);

export default msgModel;