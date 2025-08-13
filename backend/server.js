const express = require("express");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const port = new SerialPort({
  path: "COM3", 
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

parser.on("data", (line) => {
  console.log("🔍 Raw serial line:", JSON.stringify(line.trim())); 

  let uid = null;
  if (line.startsWith("🆔 UID:")) {
    uid = line.replace("🆔 UID:", "").trim();
  } else if (line.startsWith("UID received:")) {
    uid = line.replace("UID received:", "").trim();
  }

  if (uid) {
    console.log("📥 UID received:", uid);
    io.emit("uid", uid);
  }
});




port.on("open", () => {
  console.log("📡 Serial Port Connected");
});

io.on("connection", (socket) => {
  console.log("✅ Frontend connected");
});

server.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
