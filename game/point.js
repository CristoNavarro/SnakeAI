'use strict';

class Point{
  constructor(x, y, random = false) {
    if (random) {
      this._x = Math.floor(Math.random() * x);
      this._y = Math.floor(Math.random() * y);
    } else {
      this._x = x;
      this._y = y
    }
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  equals(otherPoint) {
    return this.x === otherPoint.x && this.y === otherPoint.y;
  }
}