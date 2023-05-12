import p5Types from "p5";
import { Cell } from "./cell";

export class Maze {

    p5: p5Types;
    cells: Cell[][];
    stack: Cell[];
    playerCell: Cell | null;
    playerPath: Cell[];

    constructor(_p5: p5Types, size: number) {
        this.p5 = _p5;
        this.cells = Array(size)
            .fill(Array(size).fill(null))
            .map((row: Cell[], i: number) => {
                return row.map(
                    (_, j: number) =>
                        new Cell(
                            [(this.p5.width / size) * i, (this.p5.height / size) * j],
                            [this.p5.width / size, this.p5.height / size],
                            [i, j]
                        )
                );
            });

        this.stack = [];
        this.playerCell = null;
        this.playerPath = [];
    }

    isEmpty() {
        return this.cells.length === 0;
    }

    resetVisit() {
        this.cells.forEach((row: Cell[]) =>
            row.forEach((cell: Cell) => {
                cell.visited = false;
            })
        );
    }

    createEntry(classic = false) {
        if (this.isEmpty()) return;
        const entry = classic ? this.cells[0][0] : this.getOneRandomCell();
        if (entry) {
            entry.value = 1;
        }
    }

    createExit(classic = false) {
        if (this.isEmpty()) return;
        let exit = null;

        if (!classic) {
            exit = this.getOneRandomCell();
            while (!exit || exit.value === 1) {
                exit = this.getOneRandomCell();
            }
        } else {
            exit = this.cells[this.cells.length - 1][this.cells.length - 1];
        }


        exit.value = 2;
    }

    getEntry() {
        if (this.isEmpty()) return null;
        const row = this.cells
            .find((row: Cell[]) => row.some((cell) => cell.value === 1));

        if (row) {
            return row.find((cell: Cell) => cell.value === 1);
        }
        return null;
    }

    getExit() {
        if (this.isEmpty()) return null;
        const row = this.cells
            .find((row: Cell[]) => row.some((cell) => cell.value === 2));

        if (row) {
            return row.find((cell: Cell) => cell.value === 2);
        }
        return null;
    }

    getOneRandomCell() {
        if (this.isEmpty()) return null;
        const row = this.cells[Math.floor(Math.random() * this.cells.length)];
        if (row) {
            return row[Math.floor(Math.random() * this.cells.length)];
        }
        return null;
    }

    getNeighbors(cell: Cell, visited = false) {

        if (!cell) {
            return [];
        }

        type Neighbors = {
            left: Cell | null,
            right: Cell | null,
            up: Cell | null,
            down: Cell | null,
        }

        const neighbors: Neighbors = {
            left: null,
            right: null,
            up: null,
            down: null,
        };

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
            ([, neighbor]) => neighbor && neighbor.visited === visited
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

            if (currentCell) {
                const unvisitedNeighbors = this.getNeighbors(currentCell, false);

                if (unvisitedNeighbors.length > 0) {
                    this.stack.push(currentCell);
                    const [neighborWall, neighbor] =
                        unvisitedNeighbors[
                        Math.floor(Math.random() * unvisitedNeighbors.length)
                        ];

                    if (neighbor) {
                        const currentWall = neighbor.getOpposite(neighborWall);

                        currentCell.setWall(neighborWall);
                        neighbor.setWall(currentWall);
                        neighbor.visited = true;

                        this.stack.push(neighbor);
                    }

                }
            }

        }

        this.resetVisit();
    }

    initGame(start: Cell | null | undefined) {
        if (!start) return alert("No entry set!");
        this.playerCell = start;
        this.playerPath.push(start);
    }

    moveInside(end: Cell | null | undefined) {
        if (!end) return;

        function move(maze: Maze, dx: number, dy: number, direction: string) {

            if (!maze.playerCell) {
                return;
            }

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

                const wall = maze.playerCell.getWall(direction);
                const neighborWall = nextCell.getWall(nextCellWall);

                if (
                    (wall && neighborWall) &&
                    (!wall[1] && !neighborWall[1])
                ) {
                    if (maze.playerPath.includes(nextCell)) {
                        maze.playerPath.pop();
                        maze.playerCell = nextCell;
                    } else {
                        maze.playerCell = nextCell;
                        maze.playerPath.push(nextCell);
                    }

                    if (maze.playerCell === end) {
                        console.log("You won!");
                    }
                }
            }
        }

        if (this.p5.keyIsPressed) {
            if (this.p5.keyCode === this.p5.LEFT_ARROW) {
                move(this, -1, 0, "left");
            } else if (this.p5.keyCode === this.p5.RIGHT_ARROW) {
                move(this, 1, 0, "right");
            } else if (this.p5.keyCode === this.p5.UP_ARROW) {
                move(this, 0, -1, "up");
            } else if (this.p5.keyCode === this.p5.DOWN_ARROW) {
                move(this, 0, 1, "down");
            }
        }
    }

    drawPlayer() {

        if (!this.playerCell) {
            return;
        }

        const [x, y] = this.playerCell.position;
        const [w, h] = this.playerCell.dimension;

        this.p5.noStroke();
        this.p5.fill(249, 194, 14);
        this.p5.ellipse(x + w / 2, y + h / 2, w * 0.8, h * 0.8);
    }

    drawPath() {
        for (let i = 1; i < this.playerPath.length; i++) {
            this.p5.noFill();
            this.p5.stroke(255, 255, 0);
            const [px, py] = this.playerPath[i - 1].position;
            const [pw, ph] = this.playerPath[i - 1].dimension;
            const [x, y] = this.playerPath[i].position;
            const [w, h] = this.playerPath[i].dimension;
            this.p5.line(px + pw / 2, py + ph / 2, x + w / 2, y + h / 2);
        }
    }

    draw() {
        if (this.cells.length > 0) {
            this.cells.forEach((row) => row.forEach((cell) => cell.draw(this.p5)));
        }
    }
}
