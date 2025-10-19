import express from "express";
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { createServer } from 'node:http'
import { Server } from "socket.io";

const app = express();
const port = process.env.port || 4000;
const server = createServer(app);
connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => {
    res.send("API WORKING");
})

app.use('/api/auth', authRouter);
app.use("/api/message", messageRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);

server.listen(port, () => console.log(`server started on port ${port}`));

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: allowedOrigins,
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on('setup', (userData) => {
        if (userData) {
            socket.join(userData._id);
            console.log(userData._id);
            socket.emit('connected');
        }
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('user joined room' + room);
    });

    socket.on('new message', (newMessageReceived) => {
        console.log(newMessageReceived);
        var chat = newMessageReceived.message.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.message.sender._id) return;

            socket.in(user._id).emit('message received', newMessageReceived.message);
        });
    })
})
