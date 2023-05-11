let maze = null;

function setup() {
  createCanvas(600, 600);
  background(0);
  maze = new Maze(40);
  maze.generate();
  maze.createEntry();
  maze.createExit();
}

function draw() {
  maze.draw();
}
