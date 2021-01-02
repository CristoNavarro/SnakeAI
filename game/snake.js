'use strict';

/*import DIRECTIONS from "./utils.js";
import Point from "./point.js";*/

class Snake {
  constructor(initialPoint, increaseSize) {
    this._body = [initialPoint];
    this._remainingIncrease = 0;
    this._increaseSize = increaseSize;
    this._nextPoint;
  }

  get head() {
    return this._body[0];
  }

  get body() {
    return this._body;
  }

  predictMovement(direction) {
    switch(direction) {
      case DIRECTIONS.NORTH:
        this._nextPoint = new Point(this.head.x, this.head.y - 1);
        break;
      case DIRECTIONS.SOUTH:
        this._nextPoint = new Point(this.head.x, this.head.y + 1);
        break;
      case DIRECTIONS.EAST:
        this._nextPoint = new Point(this.head.x + 1, this.head.y);
        break;
      case DIRECTIONS.WEST:
        this._nextPoint = new Point(this.head.x - 1, this.head.y);
        break;
    }
    return this._nextPoint;
  }

  move(grow) {
    this.body.unshift(this._nextPoint);
    if (grow) {
      this._remainingIncrease += this._increaseSize;
    }
    if (this._remainingIncrease > 0) {
      this._remainingIncrease--;
    } else {
      this.body.pop();
    }
  }

  insideBody(point) {
    for (let bodyPart of this._body) {
      if (point.equals(bodyPart)) {
        return true;
      }
    }
    return false;
  }
}