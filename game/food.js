'use strict';

class Food {
  constructor(maxXPosition, maxYPosition, snake) {
    this._maxXPosition = maxXPosition;
    this._maxYPosition = maxYPosition;
    this.selectNewPosition(snake);
  }

  get currentPos() {
    this._currentPos;
  }

  get x() {
    return this._currentPos.x;
  }

  get y() {
    return this._currentPos.y;
  }

  isOnSnake(snake, newPoint) {
    const snakeBody = snake.body;
    for(const point of snakeBody) {
      if(newPoint.equals(point)) {
        return true;
      }
    }
    return false;
  }

  selectNewPosition(snake) {
    let newPoint = new Point(this._maxXPosition, this._maxYPosition, true);
    while(this.isOnSnake(snake, newPoint)) {
      newPoint = new Point(this._maxXPosition, this._maxYPosition, true);
    }
    this._currentPos = newPoint;
  }
}