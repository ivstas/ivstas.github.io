window.addEventListener("load", startScreenFix)

function startScreenFix() {
    window.requestAnimationFrame(draw)
}

let canvas = document.getElementById('canvas');
let ctx = setupCanvas(canvas)
function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    let dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    let rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    let ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}

canvas.addEventListener("dragstart", handleDragStart);

const X_SHIFT_KEY = "X_SHIFT_KEY"
const Y_SHIFT_KEY = "Y_SHIFT_KEY"

function handleDragStart(e) {
    let rect = e.target.getBoundingClientRect()

    e.dataTransfer.setData(X_SHIFT_KEY, (e.clientX - rect.left).toString());
    e.dataTransfer.setData(Y_SHIFT_KEY, (e.clientY - rect.top).toString());
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}
function dropHandler(e) {
    e.preventDefault();

    const shiftX = Number(e.dataTransfer.getData(X_SHIFT_KEY))
    const shiftY = Number(e.dataTransfer.getData(Y_SHIFT_KEY))

    canvas.style.left = (e.x - shiftX) + "px";
    canvas.style.top = (e.y - shiftY) + "px";
}
function draw() {
    const blockSize = 64;
    const imageData = ctx.createImageData(blockSize, blockSize);

    for (let i = 0; i < blockSize * blockSize; i++) {
        const p = i * 4;

        imageData.data[p] = Math.random() >= 0.5 ? 255 : 0;
        imageData.data[p + 1] = Math.random() >= 0.5 ? 255 : 0;
        imageData.data[p + 2] = Math.random() >= 0.5 ? 255 : 0;
        imageData.data[p + 3] = 255;
    }

    for (let y = 0; y < canvas.height; y += blockSize) {
        for (let x = 0; x < canvas.width; x += blockSize) {
            ctx.putImageData(imageData, x, y);
        }
    }

    window.requestAnimationFrame(draw)
}
