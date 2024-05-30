const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});

	socket.on("user joined", (username) => {
		console.log(`${username} joined the chat`);
		io.emit("chat message", {
			username: "System",
			message: `${username} has joined the chat`,
		});
	});

	socket.on("chat message", (data) => {
		const { username, message } = data;
		io.emit("chat message", { username, message });
	});
});

server.listen(3000, () => {
	console.log("Server started on port 3000");
});
