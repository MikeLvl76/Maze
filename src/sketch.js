const cells = [];

function setEntry() {
    cells[Math.floor(Math.random() * cells.length)].value = 1;
}

function setExit() {
    let idx = Math.floor(Math.random() * cells.length);

    // Prevent having exit at the same location than entry
    while (true) {
        idx = Math.floor(Math.random() * cells.length);
        if (cells[idx].value === 0) {
            cells[idx].value = 2;
            return;
        }
    }
}

function setup() {
  createCanvas(600, 600);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = new Cell();
      cell.setDimension(width / 10, height / 10);
      cell.setPosition((width / 10) * i, (height / 10) * j);
      cells.push(cell);
    }
  }

  setEntry();
  setExit();
}

function draw() {
  background(0);
  cells.forEach((cell) => cell.draw());
}
