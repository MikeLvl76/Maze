class Cell {
  constructor(position, dimension, indices) {
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

  getOpposite(key) {
    if (key === "left") return "right";
    if (key === "right") return "left";
    if (key === "up") return "down";
    if (key === "down") return "up";
    return key;
  }

  getWalls(_active = true) {
    return Object.entries(this.walls).filter((_, active) => active === _active);
  }

  draw() {
    stroke(255);
    strokeWeight(2);

    const [x, y] = this.position;
    const [w, h] = this.dimension;

    if (this.walls.left) {
      line(x, y, x, y + h);
    }

    if (this.walls.right) {
      line(x + w, y, x + w, y + h);
    }

    if (this.walls.up) {
      line(x, y, x + w, y);
    }

    if (this.walls.down) {
      line(x, y + h, x + w, y + h);
    }

    if (this.value === 1) {
      noStroke();
      fill(0, 127, 0);
      rect(x, y, w, h);
    } else if (this.value === 2) {
      noStroke();
      fill(127, 0, 0);
      rect(x, y, w, h);
    }
  }
}
