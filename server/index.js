import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import DBConnection from './models/index.js';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import * as url from 'url';
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'
import ChatRoute from './routes/ChatRoute.js'
import MessageRoute from './routes/MessageRoute.js'

const app = express();
const server = http.createServer(app);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));



app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
    origin: "*"
}));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {

        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

    })

}



app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});




let activeUsers = [];

io.on('connection', (socket) => {


    socket.on("new-user-add", (newUser) => {

        if (!activeUsers.some((user) => user.user?._id === newUser?._id)) {
            activeUsers.push({ user: newUser, socketId: socket.id });
        }

        io.emit("get-users", activeUsers.filter((value) => {
            if (Object.keys(value.user).length !== 0) {
                return value;
            }
        }));
    })


    socket.on("disconnect", () => {
        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        // send all active users to all users
        io.emit("get-users", activeUsers);
    });

    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.user?._id === receiverId);
        if (user) {
            io.to(user?.socketId).emit("recieve-message", data);
        } else {
        }
    });


})

server.listen(process.env.PORT || 8000, async () => {

    console.log("Server Started");
    try {
        await DBConnection;
    } catch (e) {
        console.log(e);
    }
})