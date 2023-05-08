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

  getNeighbors(row, col) {
    const neighbors = {
      left: null,
      right: null,
      up: null,
      down: null,
    };

    if (row - 1 >= 0) {
      neighbors.left = this.cells[row - 1][col];
    }

    if (row + 1 < this.cells.length) {
      neighbors.right = this.cells[row + 1][col];
    }

    if (col - 1 >= 0) {
      neighbors.up = this.cells[row][col - 1];
    }

    if (col + 1 < this.cells.length) {
      neighbors.down = this.cells[row][col + 1];
    }

    return neighbors;
  }

  updateNeighborWall(cell, wall, neighbor) {
    if (!neighbor || cell.walls[wall]) {
      return;
    }
    const opposite = cell.getOpposite(wall);
    neighbor.walls[opposite] = false;
  }

  buildPath(current, start, end, tries = 100) {
    // No tries anymore
    if (tries === 0) return current;

    current.visited = true;

    // Have starting cell added to the path
    if (!this.path.includes(start)) {
      this.path.push(start);
    }

    // Have current cell added to the path
    if (!this.path.includes(current)) {
      this.path.push(current);
    }

    // End of path
    if (current === end) {
      return current;
    }

    let neighbor = null;
    let wall = '';

    while (!neighbor) {
      // Get current cell walls and pick one randomly
      const walls = Object.keys(current.walls);
      wall = walls[Math.floor(Math.random() * walls.length)];

      // Unset the wall
      current.walls[wall] = false;

      // Get current cell's neighbors
      const neighbors = this.getNeighbors(...current.indices);

      // Get neighbor base on wall
      neighbor = neighbors[wall];
    }

    if (neighbor.visited) {
      return this.buildPath(current, start, end, tries - 1);
    }

    // Unset neighbor wall
    this.updateNeighborWall(current, wall, neighbor);

    // Save the neighbor once
    if (!this.path.includes(neighbor)) {
      this.path.push(neighbor);
    }

    // Recursive call but the neighbor becomes the future current cell and
    // decrease tries number
    return this.buildPath(neighbor, start, end, tries - 1);
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
