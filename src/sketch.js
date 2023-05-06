let maze = null;

function setup() {
  createCanvas(600, 600);
  maze = new Maze(10);
  maze.setEntry();
  maze.setExit();

  maze.cells[3][3].updateWalls('right', 'left', 'up', 'down');
  maze.prepare();
}

function draw() {
  background(0);
  maze.draw();
}
