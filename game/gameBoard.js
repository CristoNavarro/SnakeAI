"use strict";

//import {CELL_TYPE} from './utils.js'

class GameBoard {
  constructor(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight) {
    this._board = new Array(cellsPerCol);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(cellsPerRow);
    }
    for (let i = 1; i < this.board.length; i++) {
      for (let j = 1; j < this.board[i].length; j++) {
        this.board[i][j] = CELL_TYPE.EMPTY;
      }
    }
    for (let i = 0; i < this.board.length; i++) {
      this.board[i][0] = CELL_TYPE.WALL;
      this.board[i][this.board[i].length - 1] = CELL_TYPE.WALL;
    }
    for (let j = 0; j < this.board[0].length; j++) {
      this.board[0][j] = CELL_TYPE.WALL;
    }
    for (let j = 0; j < this.board[this.board.length - 1].length; j++) {
      this.board[this.board.length - 1][j] = CELL_TYPE.WALL;
    }
    this._widthOfCell = canvasWidth / cellsPerRow;
    this._heightOfCell = canvasHeight / cellsPerCol;
    this._food = new Point(0, 0);
    this._head = new Point(1, 0);
  }

  get board() {
    return this._board;
  }

  onWall(point) {
    return this.board[point.x][point.y] === CELL_TYPE.WALL;
  }

  reset() {
    for (let i = 1; i < this.board.length - 1; i++) {
      for (let j = 1; j < this.board[i].length - 1; j++) {
        this.board[i][j] = CELL_TYPE.EMPTY;
      }
    }
  }

  draw() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        let xPosition = i * this._widthOfCell;
        let yPosition = j * this._heightOfCell;
        fill(this.board[i][j]);
        rect(xPosition, yPosition, this._widthOfCell, this._heightOfCell, 20);
      }
    }
  }

  setCurrentStatus(snake, food) {
    this._setSnake(snake);
    this._setFood(food)
  }

  _setFood(food) {
    this.board[food.x][food.y] = CELL_TYPE.FOOD;
    this._food = new Point(food.x, food.y);
  }

  _setSnake(snake) {
    this.reset();
    for (let bodyPart of snake.body) {
      //console.log(`${bodyPart.x} ,  ${bodyPart.y}`)
      this.board[bodyPart.x][bodyPart.y] = CELL_TYPE.SNAKE;
    }
    this.board[snake.head.x][snake.head.y] = CELL_TYPE.HEAD;
    this._head = snake.head;
  }

  getStatus() {
    let originPoint = this._head;
    let result = {
      horizontalDistanceToFood: 0,
      verticalDistanceToFood: 0,
      leftDistanceToObstacle: 0,
      rightDistanceToObstacle: 0,
      upperDistanceToObstacle: 0,
      lowerDistanceToObstacle: 0
    }
    // Food
    result.horizontalDistanceToFood = originPoint.x - this._food.x;
    result.verticalDistanceToFood = originPoint.y - this._food.y;

    // Left distance
    for (let i = originPoint.x - 1; i >= 0; i--) { // End on 1 cos first col (0) is WALL
      let value = this.board[i][originPoint.y];
      if (value === CELL_TYPE.SNAKE || value === CELL_TYPE.WALL) {
        result.leftDistanceToObstacle = originPoint.x - i;
        break;
      }
    }

    // Right distance
    for (let i = originPoint.x + 1; i < this.board[originPoint.x].length; i++) {
      let value = this.board[i][originPoint.y];
      if (value === CELL_TYPE.SNAKE || value === CELL_TYPE.WALL) {
        result.rightDistanceToObstacle = i - originPoint.x;
        break;
      }
    }

    // Upper Distance
    for (let j = originPoint.y - 1; j >= 0; j--) {
      let value = this.board[originPoint.x][j];
      if (value === CELL_TYPE.SNAKE || value === CELL_TYPE.WALL) {
        result.upperDistanceToObstacle = originPoint.y - j;
        break;
      }
    }

    // Lower Distance
    for (let j = originPoint.y + 1; j < this.board.length; j++) {
      let value = this.board[originPoint.x][j];
      if (value === CELL_TYPE.SNAKE || value === CELL_TYPE.WALL) {
        result.lowerDistanceToObstacle = j - originPoint.y;
        break;
      } 
    }
    return result;
  }

};