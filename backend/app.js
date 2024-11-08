import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
dotenv.config({});
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, // Allow client origin
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL, // Allow requests from localhost:3000
        methods: ["GET", "POST"], // Allowed HTTP methods
        credentials: true,
    })
);

io.on("connection", (socket) => {
    console.log("A new User Connected");

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });

    socket.on("moved", (objs) => {
        socket.broadcast.emit("movedShape", objs);
    });
    socket.on("rotated", (obj) => {
        socket.broadcast.emit("rotatedShape", obj);
    });
    socket.on("textChanged", (obj) => {
        socket.broadcast.emit("receiveText", obj);
    });
    socket.on("scaled", (obj) => {
        socket.broadcast.emit("scaledShape", obj);
    });
    socket.on("newShape", (shape) => {
        socket.broadcast.emit("receivedShape", shape);
    });
    socket.on("clearSelection", (shapes) => {
        socket.broadcast.emit("clearedShapes", shapes);
    });
    socket.on("freePath", (path) => {
        socket.broadcast.emit("receivedFreePath", path);
    });
});

app.get("/", (req, res) => res.send("Hello Satyam"));

server.listen(port, () => console.log(`server started at port : ${port}`));
