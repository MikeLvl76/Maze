let cell = null;

function setup() {
    createCanvas(600, 600);
    cell = new Cell(true, true, true, true);
    cell.setPosition(width / 2, height / 2);
    cell.setDimension(20, 20);
}

function draw() {
    background(0);
    cell.draw();
}