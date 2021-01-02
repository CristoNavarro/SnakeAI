'use strict';

class Food {
  constructor(maxXPosition, maxYPosition, snake) {
    this._maxXPosition = maxXPosition;
    this._maxYPosition = maxYPosition;
    this.selectNewPosition(snake);
  }

  get currentPos() {
    return this._currentPos;
  }

  get x() {
    return this._currentPos.x;
  }

  get y() {
    return this._currentPos.y;
  }

  onWall(point) {
    if(point.x === 0 || point.x === this._maxXPosition - 1 ||
      point.y === 0 || point.y === this._maxYPosition - 1) {
        return true;
    }
    return false;
  }

  selectNewPosition(snake) {
    let newPoint = new Point(this._maxXPosition, this._maxYPosition, true);
    while(snake.insideBody(newPoint) || this.onWall(newPoint)) {
      newPoint = new Point(this._maxXPosition, this._maxYPosition, true);
    }
    this._currentPos = newPoint;
  }
}