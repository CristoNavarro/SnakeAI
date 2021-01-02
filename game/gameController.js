'use strict';

/*import GameBoard from './gameBoard.js';
import Snake from './snake.js';
import Food from './food.js';
import Point from './point.js';*/

class GameController {
  constructor(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight, growthByFood = 1) {
    this._score = 0;
    this._growthByFood = growthByFood;
    this._initialPos = new Point(1, 1);
    this._snake = new Snake(this._initialPos, growthByFood);
    this._food = new Food(cellsPerCol, cellsPerRow, this._snake);
    this._gameBoard = new GameBoard(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
  }

  gameCicle(direction = false) {
    let status = this.getStatus();
    let nextPoint;
    let snakeGrows = false;
    if (direction) {
      nextPoint = this._snake.predictMovement(direction);
      if (nextPoint.equals(this._food.currentPos)) {
        snakeGrows = true;
        this._snake.move(snakeGrows);
        this._food.selectNewPosition(this._snake);
      } else if (this._snake.insideBody(nextPoint)) {
        console.log("Game Over");
      } else if (this._gameBoard.onWall(nextPoint)) {
        console.log("Wall");
      } else {
        this._snake.move(snakeGrows);
      }
    }
    this._gameBoard.setCurrentStatus(this._snake, this._food);
    console.log(this._gameBoard.getStatus());
    this._gameBoard.draw();
  }

  getStatus() {
    // TODO
    return 0;
  }
}
