let maze = null;

function setup() {
  createCanvas(600, 600);
  maze = new Maze(30);
  maze.generate()
}

function draw() {
  background(0);
  maze.draw();
  
}