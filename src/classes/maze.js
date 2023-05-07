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

    this.path = [];
  }

  getIndices(cell) {
    const indices = [];
    this.cells.forEach((row, i) => {
      row.forEach((elt, j) => {
        if (elt === cell) {
          indices.push(i, j);
          return;
        }
      });
    });
    return indices;
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

  getEntry() {
    return this.cells
      .find((row) => row.some((cell) => cell.value === 1))
      .find((cell) => cell.value === 1);
  }

  getExit() {
    return this.cells
      .find((row) => row.some((cell) => cell.value === 2))
      .find((cell) => cell.value === 2);
  }

  dig(cell, iteration = 100) {
    if (iteration === 0) return cell;

    // Get cell's indices
    const [i, j] = this.getIndices(cell);

    // Get cell walls
    const walls = Object.keys(cell.walls);

    // Get randomly one wall
    const wall = walls[Math.floor(Math.random() * walls.length)];

    // Unset this wall
    cell.walls[wall] = false;
    const opposite = cell.getOpposite(wall);

    // Update neighbor's wall
    const neighbors = this.getNeighbors(i, j);
    const neighbor = this.updateNeighbor(cell, neighbors, wall, opposite);
    if (neighbor === this.getExit()) return neighbor;

    if (!this.path.includes(neighbor) && neighbor !== this.getEntry()) {
      this.path.push(neighbor);
    }

    return this.dig(this.path[this.path.length - 1], iteration - 1);
  }

  createPath() {
    const entry = this.getEntry();
    const exit = this.getExit();

    this.path.push(entry);
    this.dig(entry, 10000);
    this.path.push(exit);
  }

  getNeighbors(row, col) {
    const neighbors = {
      left: [],
      right: [],
      up: [],
      down: [],
    };

    if (row - 1 >= 0) {
      neighbors.left.push(row - 1, col);
    }

    if (row + 1 < this.cells.length) {
      neighbors.right.push(row + 1, col);
    }

    if (col - 1 >= 0) {
      neighbors.up.push(row, col - 1);
    }

    if (col + 1 < this.cells.length) {
      neighbors.down.push(row, col + 1);
    }

    return neighbors;
  }

  updateNeighbor(cell, neighbors, wall, neighbor_wall) {
    if (!cell.walls[wall]) {
      if (neighbors[wall].length > 0) {
        const [x, y] = neighbors[wall];
        this.cells[x][y].walls[neighbor_wall] = false;
        return this.cells[x][y];
      }
    }
    return cell;
  }

  draw() {
    this.cells.forEach((row) => row.forEach((cell) => cell.draw()));
    stroke(255, 127, 127);
    strokeWeight(2);
    for (let i = 1; i < this.path.length; i++) {
      const current = this.path[i];
      const previous = this.path[i - 1];
      line(
        previous.x + previous.w / 2,
        previous.y + previous.h / 2,
        current.x + current.w / 2,
        current.y + current.h / 2
      );
    }
  }
}
