const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const backgroundColor = document.getElementById("backgroundColor");

const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");
const lineBtn = document.getElementById("lineBtn");
const rectangleBtn = document.getElementById("rectangleBtn");
const circleBtn = document.getElementById("circleBtn");

const newBtn = document.getElementById("newBtn");
const saveBtn = document.getElementById("saveBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");

let drawing = false;
let tool = "brush";

let startX = 0;
let startY = 0;

let undoList = [];
let redoList = [];

ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.lineWidth = brushSize.value;
ctx.strokeStyle = colorPicker.value;

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function saveState() {
    undoList.push(canvas.toDataURL());
    redoList = [];

    if (undoList.length > 30) {
        undoList.shift();
    }
}

function drawShape(event) {
    const position = getPosition(event);

    ctx.beginPath();

    if (tool === "line") {
        ctx.moveTo(startX, startY);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
    }

    if (tool === "rectangle") {
        const width = position.x - startX;
        const height = position.y - startY;

        ctx.strokeRect(startX, startY, width, height);
    }

    if (tool === "circle") {
        const width = position.x - startX;
        const height = position.y - startY;

        const radius = Math.sqrt(width * width + height * height);

        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

canvas.addEventListener("mousedown", function(event) {

    drawing = true;

    const position = getPosition(event);

    startX = position.x;
    startY = position.y;

    saveState();

    if (tool === "brush" || tool === "eraser") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
});

canvas.addEventListener("mousemove", function(event) {

    if (!drawing) return;

    if (tool === "brush" || tool === "eraser") {

        const position = getPosition(event);

        ctx.lineTo(position.x, position.y);
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", function(event) {

    if (!drawing) return;

    if (
        tool === "line" ||
        tool === "rectangle" ||
        tool === "circle"
    ) {
        drawShape(event);
    }

    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mouseleave", function() {

    if (tool === "brush" || tool === "eraser") {
        drawing = false;
        ctx.beginPath();
    }
});

brushBtn.addEventListener("click", function() {

    tool = "brush";
    ctx.strokeStyle = colorPicker.value;
});

eraserBtn.addEventListener("click", function() {

    tool = "eraser";
    ctx.strokeStyle = "#ffffff";
});

lineBtn.addEventListener("click", function() {

    tool = "line";
    ctx.strokeStyle = colorPicker.value;
});

rectangleBtn.addEventListener("click", function() {

    tool = "rectangle";
    ctx.strokeStyle = colorPicker.value;
});

circleBtn.addEventListener("click", function() {

    tool = "circle";
    ctx.strokeStyle = colorPicker.value;
});

colorPicker.addEventListener("input", function() {

    ctx.strokeStyle = colorPicker.value;

    if (tool === "eraser") {
        tool = "brush";
    }
});

brushSize.addEventListener("input", function() {

    ctx.lineWidth = brushSize.value;
});

backgroundColor.addEventListener("input", function() {

    canvas.style.backgroundColor = backgroundColor.value;
});

clearBtn.addEventListener("click", function() {

    saveState();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

newBtn.addEventListener("click", function() {

    saveState();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.backgroundColor = "#ffffff";
    backgroundColor.value = "#ffffff";
});

saveBtn.addEventListener("click", function() {

    const link = document.createElement("a");

    link.download = "paintbox-drawing.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
});

undoBtn.addEventListener("click", function() {

    if (undoList.length === 0) return;

    redoList.push(canvas.toDataURL());

    const image = new Image();

    image.onload = function() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
    };

    image.src = undoList.pop();
});

redoBtn.addEventListener("click", function() {

    if (redoList.length === 0) return;

    undoList.push(canvas.toDataURL());

    const image = new Image();

    image.onload = function() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
    };

    image.src = redoList.pop();
});