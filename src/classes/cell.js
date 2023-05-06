class Cell {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.value = 0;
    this.walls = {
      left: true,
      right: true,
      up: true,
      down: true,
    };
  }

  updateWalls(...keys) {
    keys.forEach((key) => {
      this.walls[key] = !this.walls[key];
    });
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setDimension(w, h) {
    this.w = w;
    this.h = h;
  }

  getOpposite(key) {
    if (key === 'left') return 'right';
    if (key === 'right') return 'left';
    if (key === 'up') return 'down';
    if (key === 'down') return 'up';
    return null;
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

    if (this.value !== 0) {
      const color = this.value === 1 ? [0, 255, 0] : [255, 0, 0];
      fill(...color);
      rect(this.x, this.y, this.w, this.h);
    }
  }
}
