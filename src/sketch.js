let maze = null;

function setup() {
  createCanvas(600, 600);

  maze = new Maze(10);
  maze.setEntry();
  maze.setExit();
  maze.createPath();

}

function draw() {
  background(0);
  maze.draw();
}