import p5Types from "p5";

type Walls = {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
};

export class Cell {

    position: number[];
    dimension: number[];
    indices: number[];
    value: number;
    visited: boolean;
    walls: Walls;

    constructor(position: number[], dimension: number[], indices: number[]) {
        this.position = position;
        this.dimension = dimension;
        this.indices = indices;
        this.value = 0;
        this.visited = false;
        this.walls = {
            left: true,
            right: true,
            up: true,
            down: true,
        };
    }

    getWall(key: string) {
        return Object.entries(this.walls).find(([wall]) => wall === key);
    }

    setWall(key: string) {
        if (key === 'left') {
            this.walls.left = !this.walls.left;
        }
        if (key === 'right') {
            this.walls.right = !this.walls.right;
        }
        if (key === 'up') {
            this.walls.up = !this.walls.up;
        }
        if (key === 'down') {
            this.walls.down = !this.walls.down;
        }
    }

    getOpposite(key: string) {
        if (key === "left") return "right";
        if (key === "right") return "left";
        if (key === "up") return "down";
        if (key === "down") return "up";
        return key;
    }

    getWalls(_active = true) {
        return Object.entries(this.walls).filter(([, active]) => active === _active);
    }

    draw(p5: p5Types) {
        p5.stroke(255);
        p5.strokeWeight(2);

        const [x, y] = this.position;
        const [w, h] = this.dimension;

        if (this.walls.left) {
            p5.line(x, y, x, y + h);
        }

        if (this.walls.right) {
            p5.line(x + w, y, x + w, y + h);
        }

        if (this.walls.up) {
            p5.line(x, y, x + w, y);
        }

        if (this.walls.down) {
            p5.line(x, y + h, x + w, y + h);
        }

        if (this.value === 1) {
            p5.noStroke();
            p5.fill(0, 127, 0);
            p5.rect(x, y, w, h);
        } else if (this.value === 2) {
            p5.noStroke();
            p5.fill(127, 0, 0);
            p5.rect(x, y, w, h);
        }
    }
}
