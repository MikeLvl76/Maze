class Maze {
  constructor(size) {
    this.cells = Array(size)
      .fill(Array(size).fill(null))
      .map((row, i) => {
        return row.map((_, j) => {
          const _cell = new Cell();
          _cell.setDimension(width / 10, height / 10);
          _cell.setPosition((width / 10) * i, (height / 10) * j);
          return _cell;
        });
      });
  }

  setEntry() {
    this.cells[Math.floor(Math.random() * this.cells.length)][
      Math.floor(Math.random() * this.cells.length)
    ].value = 1;
  }

  setExit() {
    let i = Math.floor(Math.random() * this.cells.length);
    let j = Math.floor(Math.random() * this.cells.length);

    // Prevent having exit at the same location than entry
    while (true) {
      i = Math.floor(Math.random() * this.cells.length);
      j = Math.floor(Math.random() * this.cells.length);
      if (this.cells[i][j].value === 0) {
        this.cells[i][j].value = 2;
        return;
      }
    }
  }

  getNeighbors(row, col) {
    const neighbors = [];
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          i >= 0 &&
          i < this.cells.length &&
          j >= 0 &&
          j < this.cells.length &&
          (i !== row || j !== col)
        ) {
          neighbors.push(this.cells[i][j]);
        }
      }
    }
    return neighbors;
  }

  draw() {
    this.cells.forEach((row) => row.forEach((cell) => cell.draw()));
  }
}
