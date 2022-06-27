const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); // Initialized and server ready

app.use(express.static("public"));

let port = 9898;
let server = app.listen(port, () => {
    console.log("Listening to port " + port);
})


let io = socket(server);
io.on("connection", (socket) => {
    console.log("Made socket connection");

    // Received data
    socket.on("beginPath", (data) => {
        // data -> data from frontend
        // now transfer data to all connected computers
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    socket.on("undoRedoCanvas", (data) => {
        io.sockets.emit("undoRedoCanvas", data);
    })
    // socket.on("colorChange", (data)=> {
    //     io.sockets.emit("colorChange",data);
    // })
})