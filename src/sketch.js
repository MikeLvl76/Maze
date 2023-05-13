let maze = null;
let enableHelp = false;
let startGame = false;
let timer = 300;
let interval = null;

let fieldset, textTime = null;

function menu() {
  textSize(32);
  textAlign(CENTER);
  fill(255);
  text("Click to play", width / 2, height / 2);

  if (mouseIsPressed) {
    startGame = true;
  }
}

function setup() {
  createCanvas(600, 600);
  frameRate(15);
  enableHelp = false;

  maze = new Maze(10 + Math.floor(Math.random() * 50));
  maze.generate();
  maze.createEntry();
  maze.createExit();

  maze.initGame(maze.getEntry());

  fieldset = createElement('fieldset');
  fieldset.position();

  const legend = createElement('legend', 'Stats');
  legend.style('color', '#ffffff');
  legend.position();

  textTime = createElement('p', '05:00');
  textTime.attribute('title', 'Remaining time');
  textTime.style('color', '#ffffff');
  textTime.position();

  fieldset.child(legend);
  fieldset.child(textTime);

  interval = setInterval(() => {
    /*if (!startGame) {
      return;
    }*/
    timer--;

    // calculate minutes and seconds elapsed
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    // add leading zeros if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    // create formatted timer string
    const timeString = `${formattedMinutes}:${formattedSeconds}`;

    textTime.html(timeString);
  }, 1000);
}

function draw() {
  background(0);
  maze.draw();
  maze.drawPlayer();
  if (enableHelp) {
    maze.drawPath();
    maze.highlightExit();
  }
  maze.moveInside(maze.getExit());
}

function keyPressed() {
  if (key === " ") {
    enableHelp = !enableHelp;
  }

  if (key === "r") {
    maze.resetPosition();
  }
}
