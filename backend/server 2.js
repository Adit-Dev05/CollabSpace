const express = require("express");
const { connected } = require("process");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

// Routes
app.get("/", (req, res) => {
    res.send("This is a MERN realtime whiteboard collaboration webapp server");
});

io.on("connection", (socket)=>{
    console.log("User connected");
});

const port = process.env.PORT || 3000;

server.listen(port, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log(`Server is running on http://localhost:${port}`);
    }
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use.`);
        process.exit(1);
    }
});
