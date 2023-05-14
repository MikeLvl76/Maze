let maze = null;
let enableHelp = false;
let startGame = false;
let timer = 0;
let interval = null;

let fieldset,
  textTime,
  moveCountText = null;

function userWon() {
  if (maze) {
    if (maze.isFound) {
      background(0);
      textSize(32);
      textAlign(CENTER);
      fill(0, 255, 0);
      text("You have found the exit!", width / 2, height / 4);
      text("Click on 'Play again'", width / 2, height / 4 + 50);

      noLoop();
    }
  }
}

function gameOver() {
  background(0);
  textSize(32);
  textAlign(CENTER);
  fill(255, 0, 0);
  text("Game over!", width / 2, height / 4);
  text("Click on 'Play again'", width / 2, height / 4 + 50);

  noLoop();
}

function menu() {
  textSize(32);
  textAlign(CENTER);
  fill(255);
  text("Click to play", width / 2, height / 2);

  if (mouseIsPressed) {
    startGame = true;
  }
}

function resetSketch() {
  clearInterval(interval);

  maze = new Maze(10 + Math.floor(Math.random() * 50));
  maze.generate();
  maze.createEntry();
  maze.createExit();

  maze.initGame(maze.getEntry());

  timer = 300;
  textTime.html('05:00');

  if (!isLooping()) {
    loop();
  }

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

    if (timer === 0) {
      gameOver();
      clearInterval(interval);
    }
  }, 1000);
}

function setup() {
  createCanvas(600, 600);
  frameRate(15);

  fieldset = createElement("fieldset");
  fieldset.id("content");

  const legend = createElement("legend", "Stats");
  legend.style("color", "#ffffff");

  textTime = createElement("p", "05:00");
  textTime.attribute("title", "Remaining time");
  textTime.id("text_time");

  moveCountText = createElement("p", "0");
  moveCountText.attribute("title", "Number of moves");
  moveCountText.id("text_count");

  const playAgain = createElement("button", "Play again");
  playAgain.attribute("title", "Restart game");
  playAgain.id("play_again");

  fieldset.child(legend);
  fieldset.child(textTime);
  fieldset.child(moveCountText);
  fieldset.child(playAgain);

  playAgain.mousePressed(resetSketch);

  resetSketch();
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
  moveCountText.html(maze.moves.toString());
  userWon();
}

function keyPressed() {
  if (key === " ") {
    enableHelp = !enableHelp;
  }

  if (key === "r") {
    maze.resetPosition();
  }
}
