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
  }

  getOneRandomCell() {
    return this.cells[Math.floor(Math.random() * this.cells.length)][
      Math.floor(Math.random() * this.cells.length)
    ];
  }

  getNeighbors(cell, visited = false) {
    const [row, col] = cell.indices;

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

    return Object.entries(neighbors).filter(
      ([_, neighbor]) => neighbor && neighbor.visited === visited
    );
  }
  
  generate() {
    //     1. Choose the initial cell, mark it as visited and push it to the stack
    //     2. While the stack is not empty
    // 	      1. Pop a cell from the stack and make it a current cell
    //      	2. If the current cell has any neighbours which have not been visited
    // 		      1. Push the current cell to the stack
    // 		      2. Choose one of the unvisited neighbours
    // 		      3. Remove the wall between the current cell and the chosen cell
    // 		      4. Mark the chosen cell as visited and push it to the stack

    const initialCell = this.getOneRandomCell();
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
  }

  draw() {
    this.cells.forEach((row) => row.forEach((cell) => cell.draw()));
  }
}
