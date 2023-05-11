class Maze {
  constructor(size) {
    this.cells = Array(size)
      .fill(Array(size).fill(null))
      .map((row, i) => {
        return row.map((_, j) => {
          const _cell = new Cell();
          _cell.setDimension(width / size, height / size);
          _cell.setPosition((width / size) * i, (height / size) * j);
          _cell.setIndices(i, j);
          return _cell;
        });
      });

    this.stack = [];
    this.resolverPath = [];
  }

  isEmpty() {
    return this.cells.length === 0;
  }

  resetVisit() {
    this.cells.forEach((row) =>
      row.forEach((cell) => {
        cell.visited = false;
      })
    );
  }

  createEntry() {
    if (this.isEmpty()) return;
    const entry = this.getOneRandomCell();
    if (entry) {
      entry.value = 1;
    }
  }

  createExit() {
    if (this.isEmpty()) return;
    let exit = this.getOneRandomCell();
    while (!exit || exit.value === 1) {
      exit = this.getOneRandomCell();
    }

    exit.value = 2;
  }

  getEntry() {
    if (this.isEmpty()) return null;
    return this.cells
      .find((row) => row.some((cell) => cell.value === 1))
      .find((cell) => cell.value === 1);
  }

  getExit() {
    if (this.isEmpty()) return null;
    return this.cells
      .find((row) => row.some((cell) => cell.value === 2))
      .find((cell) => cell.value === 2);
  }

  getOneRandomCell() {
    if (this.isEmpty()) return null;
    const row = this.cells[Math.floor(Math.random() * this.cells.length)];
    if (row) {
      return row[Math.floor(Math.random() * this.cells.length)];
    }
    return null;
  }

  getNeighbors(cell, visited = false) {
    const neighbors = {
      left: null,
      right: null,
      up: null,
      down: null,
    };

    if (!cell) {
      return [];
    }

    const [row, col] = cell.indices;

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

    return Object.entries(neighbors).filter(
      ([_, neighbor]) => neighbor && neighbor.visited === visited
    );
  }

  generate() {
    //     Randomized Depth-First Search
    //     1. Choose the initial cell, mark it as visited and push it to the stack
    //     2. While the stack is not empty
    // 	      1. Pop a cell from the stack and make it a current cell
    //      	2. If the current cell has any neighbours which have not been visited
    // 		      1. Push the current cell to the stack
    // 		      2. Choose one of the unvisited neighbours
    // 		      3. Remove the wall between the current cell and the chosen cell
    // 		      4. Mark the chosen cell as visited and push it to the stack

    const initialCell = this.getOneRandomCell();
    if (!initialCell) return;
    initialCell.visited = true;

    this.stack.push(initialCell);

    while (this.stack.length > 0) {
      const currentCell = this.stack.pop();
      const unvisitedNeighbors = this.getNeighbors(currentCell, false);

      if (unvisitedNeighbors.length > 0) {
        this.stack.push(currentCell);
        const [neighborWall, neighbor] =
          unvisitedNeighbors[
            Math.floor(Math.random() * unvisitedNeighbors.length)
          ];

        const currentWall = neighbor.getOpposite(neighborWall);

        currentCell.walls[neighborWall] = false;
        neighbor.walls[currentWall] = false;
        neighbor.visited = true;

        this.stack.push(neighbor);
      }
    }

    this.resetVisit();
  }

  resolve() {
    const entry = this.getEntry();
    const exit = this.getExit();

    if (!entry || !exit) return;

    const frontier = [entry];
    const visited = new Set([entry]);
    const parents = {};

    const resolverInterval = setInterval(() => {
      if (frontier.length > 0) {
        const currentCell = frontier.shift();

        if (currentCell === exit) {
          clearInterval(resolverInterval);

          this.resolved = true;

          let current = exit;
          while (current !== entry) {
            this.resolverPath.unshift(current);
            current = parents[current.indices.join("-")];
          }

          this.resolverPath.unshift(entry);
          console.log(this.resolverPath.map(cell => cell.indices))
          return;
        }

        this.getNeighbors(currentCell).forEach(([_, neighbor]) => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            frontier.push(neighbor);
            parents[neighbor.indices.join("-")] = currentCell;

            noStroke();

            fill(255, 127, 68);
            rect(neighbor.x, neighbor.y, neighbor.w, neighbor.h);

            fill(127);
            rect(currentCell.x, currentCell.y, currentCell.w, currentCell.h);
          }
        });
      } else {
        clearInterval(resolverInterval);
      }
    }, 50);
  }

  draw() {
    if (this.cells.length > 0) {
      this.cells.forEach((row) => row.forEach((cell) => cell.draw()));
    }
  }

  drawResolution() {
    stroke(0, 0, 255);
    noFill();
    for (let i = 1; i < this.resolverPath.length; i++) {
      const previous = this.resolverPath[i - 1];
      const current = this.resolverPath[i];
      line(
        previous.x + previous.w / 2,
        previous.y + previous.h / 2,
        current.x + current.w / 2,
        current.y + current.h / 2
      );
    }
  }
}
