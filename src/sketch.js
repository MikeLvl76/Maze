let maze = null;

let resolution = false;

function enableResolution() {
  resolution = true;
}

function setup() {
  createCanvas(600, 600);
  background(0);
  maze = new Maze(40);
  maze.generate();
  maze.createEntry();
  maze.createExit();

  resolve = createElement("button", "Resolve");
  resolve.mousePressed(enableResolution);
}

function draw() {
  maze.draw();

  // draw the resolver path in real-time
  if (resolution) {
    maze.resolve();
    resolution = false;
  }

  if (maze.resolved) {
    maze.drawResolution();
  }
}
