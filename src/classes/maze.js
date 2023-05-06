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

  dig(cell, iteration = 5, unlimited = false, cb = false) {
    if (iteration === 0 && !unlimited) return;

    // Get cell's neighbors
    const [i, j] = this.getIndices(cell);
    const neighbors = this.getNeighbors(i, j);

    // Get cell walls
    const walls = Object.keys(cell.walls);

    // Get randomly one wall
    const wall = walls[Math.floor(Math.random() * walls.length)];

    // Unset this wall
    cell.walls[wall] = false;
    const opposite = cell.getOpposite(wall);

    // Update neighbor's wall
    const neighbor = this.updateNeighbor(cell, neighbors, wall, opposite);
    if (cb(neighbor) || !neighbor) return;

    return this.dig(neighbor, unlimited ? iteration : iteration - 1, unlimited, cb);
  }

  createPath() {
    const entry = this.getEntry();
    const exit = this.getExit();

    this.dig(entry, 0, true, (neighbor) => neighbor === exit);
  }

  //   removeWallsRandomly() {
  //     let count = 40;

  //     while (count > 0) {
  //       let i = Math.floor(Math.random() * this.cells.length);
  //       let j = Math.floor(Math.random() * this.cells.length);

  //       this.cells[i][j].updateWalls('left', 'up', 'right', 'bottom');
  //       count--;
  //     }
  //   }

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
    return null;
  }

  prepare() {
    //this.removeWallsRandomly();

    this.cells.forEach((row, i) =>
      row.forEach((cell, j) => {
        const neighbors = this.getNeighbors(i, j);
        this.updateNeighbor(cell, neighbors, "left", "right");
        this.updateNeighbor(cell, neighbors, "right", "left");
        this.updateNeighbor(cell, neighbors, "up", "down");
        this.updateNeighbor(cell, neighbors, "down", "up");
      })
    );
  }

  draw() {
    this.cells.forEach((row) => row.forEach((cell) => cell.draw()));

    // Debug
    // const neighbors = this.getNeighbors(3, 3);
    // Object.values(neighbors)
    //   .filter((value) => value.length > 0)
    //   .forEach((coord) => {
    //     const [i, j] = coord;
    //     const cell = this.cells[i][j];
    //     text(
    //       (cell.value + i).toString(),
    //       cell.x + cell.w / 2,
    //       cell.y + cell.h / 2
    //     );
    //   });
  }
}
