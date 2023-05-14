let maze = null;
let enableHelp = false;
let startGame = false;
let timer = 0;
let interval = null;

let fieldset,
  textTime,
  moveCountText = null;

function saveResult() {
  const data = localStorage.getItem("maze_game_saves");
  const saves = data ? JSON.parse(data) : [];
  saves.push({
    moves: maze.moves,
    time: textTime.html(),
    exitFound: maze.isFound ? "Yes" : "No",
  });
  localStorage.setItem("maze_game_saves", JSON.stringify(saves));
  return saves.sort((a, b) => a.moves - b.moves);
}

function userWon() {
  clearInterval(interval);

  background(0);
  textSize(32);
  textAlign(CENTER);
  fill("#32CD32");
  text("You have found the exit!", width / 2, height / 4);
  text("Click on 'Play again'", width / 2, height / 4 + 50);

  const saves = saveResult();

  // Column positions and widths
  const positionsX = width / 2 - 150;
  const movesX = width / 2;
  const exitX = width / 2 + 150;
  const columnWidth = 150;

  fill(255);
  stroke(0, 255, 0);
  strokeWeight(1);

  // Table header
  textSize(24);
  text("Position", positionsX, height / 4 + 120);
  text("Moves", movesX, height / 4 + 120);
  text("Exit found?", exitX, height / 4 + 120);

  // Table separator
  const separatorY = height / 4 + 130;
  const separatorLength = 3 * columnWidth;
  for (let i = 0; i < separatorLength; i += 10) {
    line(
      width / 2 - separatorLength / 2 + i,
      separatorY,
      width / 2 - separatorLength / 2 + i + 5,
      separatorY
    );
  }

  // Table body
  textSize(20);
  saves.slice(0, 5).forEach((save, i) => {
    const positionText = `${i + 1}`;
    const moveText = `${save.moves}`;
    const exitText = `${save.exitFound}`;

    // Table row
    textAlign(CENTER);
    text(positionText, positionsX, height / 4 + 155 + i * 30);
    text(moveText, movesX, height / 4 + 155 + i * 30);
    text(exitText, exitX, height / 4 + 155 + i * 30);
  });

  noLoop();
}

function gameOver() {
  clearInterval(interval);

  background(0);
  textSize(32);
  textAlign(CENTER);
  fill(255, 0, 0);
  text("Game over!", width / 2, height / 4);
  text("Click on 'Play again'", width / 2, height / 4 + 50);

  const saves = saveResult();

  // Column positions and widths
  const positionsX = width / 2 - 150;
  const movesX = width / 2;
  const exitX = width / 2 + 150;
  const columnWidth = 150;

  fill(255);
  stroke(255, 0, 0);
  strokeWeight(1);

  // Table header
  textSize(24);
  text("Position", positionsX, height / 4 + 120);
  text("Moves", movesX, height / 4 + 120);
  text("Exit found?", exitX, height / 4 + 120);

  // Table separator
  const separatorY = height / 4 + 130;
  const separatorLength = 3 * columnWidth;
  for (let i = 0; i < separatorLength; i += 10) {
    line(
      width / 2 - separatorLength / 2 + i,
      separatorY,
      width / 2 - separatorLength / 2 + i + 5,
      separatorY
    );
  }

  // Table body
  textSize(20);
  saves.slice(0, 5).forEach((save, i) => {
    const positionText = `${i + 1}`;
    const moveText = `${save.moves}`;
    const exitText = `${save.exitFound}`;

    // Table row
    textAlign(CENTER);
    text(positionText, positionsX, height / 4 + 155 + i * 30);
    text(moveText, movesX, height / 4 + 155 + i * 30);
    text(exitText, exitX, height / 4 + 155 + i * 30);
  });

  noLoop();
}

function menu() {
  textSize(16);
  textAlign(CENTER);
  fill(255);
  text("Press 'r' to reset your position", width / 2, height / 4);
  text("Press 'space' to see your path and to highlight the exit", width / 2, height / 3);
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
  textTime.html("05:00");

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

  if (!startGame) {
    menu();
  } else {
    maze.draw();
    maze.drawPlayer();
    if (enableHelp) {
      maze.drawPath();
      maze.highlightExit();
    }
    maze.moveInside(maze.getExit());
    moveCountText.html(maze.moves.toString());

    if (maze.isFound) {
      userWon();
    }
  }
}

function keyPressed() {
  if (key === " ") {
    enableHelp = !enableHelp;
  }

  if (key === "r") {
    maze.resetPosition();
  }
}
