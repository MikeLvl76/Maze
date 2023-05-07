class Maze {
  constructor(size) {
    this.cells = Array(size)
      .fill(Array(size).fill(null))
      .map((row, i) => {
        return row.map((_, j) => {
          const _cell = new Cell();
          _cell.setDimension(width / 10, height / 10);
          _cell.setPosition((width / 10) * i, (height / 10) * j);
          _cell.setIndices(i, j);
          return _cell;
        });
      });

    this.path = [];
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

  build(cell, iteration = 100) {

    const entry = this.getEntry();
    const exit = this.getExit();

    if (iteration === 0) return cell;

    // If current cell is undefined the path is reset
    if (!cell) {
      this.path.slice(0, this.path.length);
      this.path.push(entry);
      return this.build(entry, iteration - 1);
    }

    // Get cell walls
    const walls = Object.keys(cell.walls);

    // Get randomly one wall
    const wall = walls[Math.floor(Math.random() * walls.length)];

    // Unset this wall
    if (cell.walls[wall]) {
      cell.walls[wall] = false;
    }

    // Update neighbor's wall
    const neighbors = this.getNeighbors(...cell.indices);
    const neighbor = this.updateNeighbor(cell, neighbors, wall);

    // If neighbor is the exit
    if (neighbor === exit) return neighbor;

    // If path doesn't include neighbor and neighbor is not the entry then
    // the neighbor is added to the path
    if (!this.path.includes(neighbor) && neighbor !== entry) {
      this.path.push(neighbor);
    }

    if (neighbor === cell) {
      this.path.pop();
    }

    return this.build(this.path[this.path.length - 1], iteration - 1);
  }

  createPath() {
    const entry = this.getEntry();
    console.log('Entry:', entry)
    const exit = this.getExit();

    this.path.push(entry);
    console.log('Before building:', this.path)
    this.build(entry, 1000000);
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

  updateNeighbor(cell, neighbors, wall) {
    if (!cell.walls[wall]) {
      if (neighbors[wall].length > 0) {
        const [x, y] = neighbors[wall];
        const neighbor_wall = cell.getOpposite(wall);
        this.cells[x][y].walls[neighbor_wall] = false;
        return this.cells[x][y];
      }
    }
    return cell;
  }

  draw() {
    // Draw path with lines
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

    this.cells.forEach((row) => row.forEach((cell) => cell.draw()));
  }
}
