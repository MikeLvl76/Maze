class Cell {
  constructor(left, right, up, down) {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.walls = {
      left: left,
      right: right,
      up: up,
      down: down,
    };
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setDimension(w, h) {
    this.w = w;
    this.h = h;
  }

  draw() {
    stroke(255);
    strokeWeight(1);

    if (this.walls.left) {
        line(this.x, this.y, this.x, this.y + this.h);
    }

    if (this.walls.right) {
        line(this.x + this.w, this.y, this.x + this.w, this.y + this.h);
    }

    if (this.walls.up) {
        line(this.x, this.y, this.x + this.w, this.y);
    }

    if (this.walls.down) {
        line(this.x, this.y + this.h, this.x + this.w, this.y + this.h);
    }
  }
}
