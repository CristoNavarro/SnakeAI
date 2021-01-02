'use strict';

/*import DIRECTIONS from "./utils.js";
import Point from "./point.js";*/

class Snake {
  constructor(initialPoint, increaseSize) {
    this._body = [initialPoint];
    this._remainingIncrease = 0;
    this._increaseSize = increaseSize;
  }

  get head() {
    return this._body[0];
  }

  get body() {
    return this._body;
  }

  move(direction, grow) {
    let newPoint;
    switch(direction) {
      case DIRECTIONS.NORTH:
        newPoint = new Point(this.head.x, this.head.y - 1);
        break;
      case DIRECTIONS.SOUTH:
        newPoint = new Point(this.head.x, this.head.y + 1);
        break;
      case DIRECTIONS.EAST:
        newPoint = new Point(this.head.x + 1, this.head.y);
        break;
      case DIRECTIONS.WEST:
        newPoint = new Point(this.head.x - 1, this.head.y);
        break;
    }
    this.body.unshift(newPoint);
    if (grow) {
      this._remainingIncrease += this._increaseSize;
    }
    if (this._remainingIncrease > 0) {
      this._remainingIncrease--;
    } else {
      this.body.pop();
    }
  }
}