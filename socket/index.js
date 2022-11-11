

const io = require("socket.io")(8800, {
    cors: {
        origin: "http://localhost:3000",
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
            console.log("no", user);
        }
    });


})