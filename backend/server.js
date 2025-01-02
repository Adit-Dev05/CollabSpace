const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, getUser, removeUser } = require("./utils/users");

const io = new Server(server);

let roomIdGlobal, imgURLGlobal;

// Handle connection
io.on("connection", (socket) => {
  // Handle user joining the room
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);

    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });

    socket.broadcast.to(roomId).emit("allUsers", users);

    // Emit message after a short delay
    setTimeout(() => {
      socket.broadcast
        .to(roomId)
        .emit("userJoinedMessageBroadcasted", { name, userId, users });
      socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
        imgURL: imgURLGlobal,
      });
    }, 1000);
  });

  // Handle whiteboard data
  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imgURL: data,
    });
  });

  // Handle incoming chat message
  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if (user) {
      // Send message to everyone except the sender (avoid duplication)
      socket.to(roomIdGlobal).emit("messageResponse", { message, name: user.name });
    }
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted", {
        name: user.name,
        userId: user.userId,
      });
    }
  });
});

const port = process.env.PORT || 5001;
server.listen(port, () => console.log("Server is running on http://localhost:5001"));
