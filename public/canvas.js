//const  {Socket} = require("socket.io");


// canvas is an HTML element
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorElems = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let eraseAllElem = document.querySelector(".erase-all-cont");
let downloadIcon = document.querySelector(".download");
let undoIcon = document.querySelector(".undo");
let redoIcon = document.querySelector(".redo");

let pencilColor = "black";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

// let pencilIconFlag = "false";
let eraserIconFlag = false;

let undoRedoTracker = [];
let track = 0;

// API
let tool = canvas.getContext("2d");
tool.fillStyle = "white";
tool.fillRect(0, 0, canvas.width, canvas.height);
undoRedoTracker.push(canvas.toDataURL());
tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;


// mousedown -> start path, mousemove -> path fill 
let mouseDown = false;
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    // tool.beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // });
    // tool.moveTo(e.clientX, e.clientY);

    let data = {
        x: e.clientX,
        y: e.clientY
    }
    console.log(tool.strokeStyle, tool.lineWidth)
    // send data to server
    socket.emit("beginPath", data);
})

// let move = false;
canvas.addEventListener("mousemove", (e) => {
    // move = true;
    if (mouseDown) {
        // drawStroke({
        //     x: e.clientX,
        //     y: e.clientY
        // });
        console.log(eraserIconFlag, eraserColor, pencilColor)
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserIconFlag ? eraserColor : pencilColor,
            width: eraserIconFlag ? eraserWidth : pencilWidth
        }
        console.log(data.color);
        // send data to server
        socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    // if (move == true) {
        let url = canvas.toDataURL();
        undoRedoTracker.push(url);
        track = undoRedoTracker.length - 1;
        // console.log(track);
        // move = false;
    // }
})

function beginPath(strokeObj) {
    console.log(eraserIconFlag);
    console.log(tool.strokeStyle);
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    console.log(strokeObj.color);
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

// function changeColor(width, color) {
//     console.log("Color changed", color);
//     tool.strokeStyle = color;
//     tool.lineWidth = width;
// }


pencilColorElems.forEach(colorElem => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        pencilColor = color;
        tool.strokeStyle = pencilColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})

pencilIcon.addEventListener("click", (e) => {
    eraserIconFlag = false;
    setDefaultUI(pencilIcon);
    console.log(pencilColor, pencilWidth)
    // pencilIconFlag = !pencilIconFlag;
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    tool.lineWidth = eraserWidthElem.value;
})

eraserIcon.addEventListener("click", (e) => {
    setDefaultUI(eraserIcon);
    eraserIconFlag = !eraserIconFlag;
    console.log(eraserIconFlag);
    if (eraserIconFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
    // socket.emit("colorChange", {color:"white", width:eraserWidthElem.value});
})

eraseAllElem.addEventListener("click", (e) => {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    tool.fillStyle = "white";
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;

    // let a = document.createElement("a");
    // a.href = url;
    // a.download = "board.jpg";
    // a.click();
})

downloadIcon.addEventListener("click", (e) => {
    setDefaultUI(downloadIcon);
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

undoIcon.addEventListener("click", (e) => {
    setDefaultUI(undoIcon);

    if (track > 0) track--;

    // track actions
    let data = {
        trackValue: track,
        undoRedoTracker
    }

    // console.log(undoRedoTracker);
    // undoRedoCanvas(data);

    socket.emit("undoRedoCanvas", data);
})

redoIcon.addEventListener("click", (e) => {
    setDefaultUI(redoIcon);

    if (track < undoRedoTracker.length - 1) track++;

    // track actions
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    // console.log(undoRedoTracker);
    // undoRedoCanvas(data);

    socket.emit("undoRedoCanvas", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    console.log(track);

    let url = undoRedoTracker[track];
    // console.log(url, track);
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        // tool.clearRect(0, 0, canvas.width, canvas.height);
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}


socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("undoRedoCanvas", (data) => {
    undoRedoCanvas(data);
})

// socket.on("colorChange", (data)=> {
//     changeColor(data.width, data.color);
// })