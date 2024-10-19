const http = require("http");
const socketIo = require("socket.io");

// Create an HTTP server
const server = http.createServer();

// Initialize Socket.IO with CORS options
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5500", 
    methods: ["GET", "POST"],
    credentials: true, 
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });

});

// Start the server on port 8000
server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
