'use strict';

/*import GameBoard from './gameBoard.js';
import Snake from './snake.js';
import Food from './food.js';
import Point from './point.js';*/

class GameController {
  constructor(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight, growthByFood = 1) {
    this._score = 0;
    this._growthByFood = growthByFood;
    this._initialPos = new Point(0, 0);
    this._snake = new Snake(this._initialPos, growthByFood);
    this._food = new Food(cellsPerCol, cellsPerRow, this._snake);
    this._gameBoard = new GameBoard(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
  }

  gameCicle() {
    let status = this.getStatus();
    this._gameBoard.setCurrentStatus(this._snake, this._food);
    this._gameBoard.draw();
    this._snake.move(DIRECTIONS.SOUTH, true);
    this._snake.move(DIRECTIONS.EAST, false);
  }

  getStatus() {
    // TODO
    return 0;
  }
}
