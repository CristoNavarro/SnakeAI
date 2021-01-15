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
    this._score = 1;
    this._iterationsNoFood = 0;
    this._alive = true;
    this._maxIterationsWithoutFood = maxIterationsWithoutFood;
    this._movementsRecord = [];
    this._cantMoveTo = undefined;
    //this._initialMoves();
    this._muertoHambre = false;
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

  get cantMoveTo() {
    return this._cantMoveTo;
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
        this._cantMoveTo = DIRECTIONS.SOUTH;
        this._nextPoint = new Point(this.head.x, this.head.y - 1);
        break;
      case DIRECTIONS.SOUTH:
        this._cantMoveTo = DIRECTIONS.NORTH;
        this._nextPoint = new Point(this.head.x, this.head.y + 1);
        break;
      case DIRECTIONS.EAST:
        this._cantMoveTo = DIRECTIONS.WEST;
        this._nextPoint = new Point(this.head.x + 1, this.head.y);
        break;
      case DIRECTIONS.WEST:
        this._cantMoveTo = DIRECTIONS.EAST;
        this._nextPoint = new Point(this.head.x - 1, this.head.y);
        break;
    }
    return this._nextPoint;
  }

  move(grow) {
    this._iterationsNoFood++;
    this.body.unshift(this._nextPoint);
    //grow = true;
    if (grow) {
      this._remainingIncrease += this._increaseSize;
      this._score++;
      this._iterationsNoFood = 0;
    } else {
      if (this._iterationsNoFood >= this._maxIterationsWithoutFood) {
        //console.log("he muerto de hambre");
        this._muertoHambre = true;
        this._alive = false;
      }
    }
    if (this._remainingIncrease > 0) {
      this._remainingIncrease--;
    } else {
      this.body.pop();
    }
  }

  compare(otherSnake) {
    let myFitness = this._calculateFitness();
    let otherFitness = otherSnake._calculateFitness();
    if (myFitness > otherFitness) {
      return 1;
    } else if (myFitness === otherFitness) {
      return 0;
    }
    return -1;
  }

  _initialMoves() {
    this.predictMovement(DIRECTIONS.WEST);
    this.move(true);
    this.predictMovement(DIRECTIONS.WEST);
    this.move(true);
  }

  _calculateFitness() {
    //return 1 / (this._maxIterationsWithoutFood - this.iterationsAlive) + this.score;
    /*if (this.score < 10) {
      return this.iterationsAlive * Math.pow(2, this.score);
    } else {
      return this.iterationsAlive * Math.pow(2, 10) * (this.score - 9);
    }*/
    if (this.iterationsAlive >= this._maxIterationsWithoutFood) {
      return this._score + 1;
    } else {
      return this._score + this._maxIterationsWithoutFood / (this._maxIterationsWithoutFood - this.iterationsAlive);
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