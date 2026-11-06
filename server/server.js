import express from "express";
import http from "http";
import cors from "cors";
import {config} from "dotenv";
import { Server } from "socket.io";

config()

const PORT = process.env.PORT || 2000;

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());


// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

// Socket connection
io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Join room
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });

    // Receive message
    socket.on("send-message", (data) => {
        io.to(data.roomId).emit("receive-message", {
            message: data.message,
            sender: socket.id,
            createdAt: new Date(),
        });
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});

// Home route
app.get("/", (req, res) => {
    res.status(200).json({ status: 200 , message: "Socket Server is running" , success: true });
});

// Start server
const Start = async () => {
    try{
   server.listen(PORT, () => {
    console.log(`Socket Server running on port ${PORT}`);
});
    }catch(err){
        console.log(`Server Error ${err.message}`);
    }
}

Start();