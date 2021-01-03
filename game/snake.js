'use strict';

/*import DIRECTIONS from "./utils.js";
import Point from "./point.js";*/

class Snake {
  constructor(initialPoint, increaseSize, maxIterationsWithoutFood = 10) {
    this._initialPoint = initialPoint;
    this._body = [initialPoint];
    this._remainingIncrease = 0;
    this._increaseSize = increaseSize;
    this._nextPoint;
    this._score = 0;
    this._iterationsNoFood = 0;
    this._alive = true;
    this._maxIterationsWithoutFood = maxIterationsWithoutFood;
    this._movementsRecord = [];
  }

  get head() {
    return this._body[0];
  }

  get body() {
    return this._body;
  }

  get score() {
    return this._score;
  }
  
  get iterationsNoFood() {
    return this._iterationsNoFood;
  }
  
  get alive() {
    return this._alive;
  }

  set alive(newStatus) {
    this._alive = newStatus;
  }

  get initialPoint() {
    return this._initialPoint;
  }

  get increaseSize() {
    return this._increaseSize;
  }
  
  get movements() {
    return this._movementsRecord;
  }

  get maxIterationsWithoutFood() {
    return this._maxIterationsWithoutFood;
  }

  get iterationsAlive() {
    return this._movementsRecord.length;
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
    this._iterationsNoFood++;
    this.body.unshift(this._nextPoint);
    if (grow) {
      this._remainingIncrease += this._increaseSize;
      this._score++;
      this._iterationsNoFood = 0;
    } else {
      if (this._iterationsNoFood >= this._maxIterationsWithoutFood) {
        console.log("he muerto de hambre");
        this._alive = false;
      }
    }
    if (this._remainingIncrease > 0) {
      this._remainingIncrease--;
    } else {
      this.body.pop();
    }
  }

  setMovement(direction, food) {
    this._movementsRecord.push({direction: direction, food: food});
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