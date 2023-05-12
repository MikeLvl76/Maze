class Maze {
  constructor(size) {
    this.cells = Array(size)
      .fill(Array(size).fill(null))
      .map((row, i) => {
        return row.map(
          (_, j) =>
            new Cell(
              [(width / size) * i, (height / size) * j],
              [width / size, height / size],
              [i, j]
            )
        );
      });

    this.stack = [];
    this.playerCell = null;
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

  initGame(start) {
    if (!start) return alert("No entry set!");
    this.playerCell = start;
  }

  moveInside(end) {
    if (!end) return;

    function move(maze, dx, dy, direction) {
      const [i, j] = maze.playerCell.indices;
      const row = i + dx;
      const col = j + dy;

      if (
        row >= 0 &&
        row < maze.cells.length &&
        col >= 0 &&
        col < maze.cells.length
      ) {
        const nextCell = maze.cells[row][col];

        const nextCellWall = maze.playerCell.getOpposite(direction);

        if (
          !maze.playerCell.walls[direction] &&
          !nextCell.walls[nextCellWall]
        ) {
          maze.playerCell = nextCell;

          if (maze.playerCell === end) {
            console.log("You won!");
          }
        }
      }
    }

    if (keyIsPressed) {
      if (keyCode === LEFT_ARROW) {
        move(this, -1, 0, "left");
      } else if (keyCode === RIGHT_ARROW) {
        move(this, 1, 0, "right");
      } else if (keyCode === UP_ARROW) {
        move(this, 0, -1, "up");
      } else if (keyCode === DOWN_ARROW) {
        move(this, 0, 1, "down");
      }
    }
  }

  drawPlayer() {
    const [x, y] = this.playerCell.position;
    const [w, h] = this.playerCell.dimension;

    noStroke();
    fill(0, 0, 255);
    rect(x, y, w * 0.9, h * 0.9);
  }

  draw() {
    if (this.cells.length > 0) {
      this.cells.forEach((row) => row.forEach((cell) => cell.draw()));
    }
  }
}
