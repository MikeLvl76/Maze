let maze = null;

function setup() {
  createCanvas(600, 600);
  maze = new Maze(10);
  maze.setEntry();
  maze.setExit();

  //maze.dig(maze.cells[3][3]);
  maze.createPath();
  
  //maze.prepare();
}

function draw() {
  background(0);
  maze.draw();
}
