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
    tool.beginPath({
        x: e.clientX,
        y: e.clientY
    });
    tool.moveTo(e.clientX, e.clientY);
})
let move = false;
canvas.addEventListener("mousemove", (e) => {
    move = true;
    if (mouseDown) drawStroke({
        x: e.clientX,
        y: e.clientY
    });
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    if (move == true) {
        let url = canvas.toDataURL();
        undoRedoTracker.push(url);
        track = undoRedoTracker.length - 1;
        console.log(track);
        move = false;
    }
})

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}


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
    setDefaultUI(pencilIcon);
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    tool.lineWidth = eraserWidthElem.value;
})

eraserIcon.addEventListener("click", (e) => {
    setDefaultUI(eraserIcon);
    tool.strokeStyle = "white";
    tool.lineWidth = eraserWidthElem.value;
})

eraseAllElem.addEventListener("click", (e) => {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    tool.fillStyle = "white";
    tool.fillRect(0, 0, canvas.width, canvas.height);
    
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
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
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }

    // console.log(undoRedoTracker);
    undoRedoCanvas(trackObj);
})

redoIcon.addEventListener("click", (e) => {
    setDefaultUI(redoIcon);

    if (track < undoRedoTracker.length - 1) track++;

    // track actions
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    // console.log(undoRedoTracker);
    undoRedoCanvas(trackObj);
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