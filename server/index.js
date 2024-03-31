const express = require("express");
const { createServer } = require("node:http");

const app = express();
const server = createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
});

const usernameToSocketMap = new Map();
const socketToUsernameMap = new Map();

io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    const { username, room } = data;
    usernameToSocketMap.set(username, socket.id);
    socketToUsernameMap.set(socket.id, username);
    io.to(room).emit("user:joined", {
      username,
      id: socket.id,
    });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);

    socket.on("call:user", (data) => {
      const { offer, to } = data;
      io.to(to).emit("incoming:call", {
        offer,
        from: socket.id,
      });
    });

    socket.on("call:accepted", (data) => {
      const { to, ans } = data;
      io.to(to).emit("call:accepted", {
        ans,
        from: socket.id,
      });
    });

    socket.on("user:nego:needde", (data) => {
      const { offer, to } = data;
      io.to(to).emit("peer:nego:needde", {
        offer,
        from: socket.id,
      });
    });

    socket.on("peer:nego:done", (data) => {
      const { to, ans } = data;
      io.to(to).emit("peer:nego:final", {
        ans,
        from: socket.id,
      });
    });

  });

  io.emit("connection", socket.id);
});

server.listen(8000, () => {
  console.log("server running at http://localhost:8000");
});