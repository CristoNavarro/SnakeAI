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
    let result = [];
    const LEFT = [-1, 0];
    const RIGHT = [1, 0];
    const UP = [0, -1];
    const DOWN = [0, 1];
    const LEFT_UP = [-1, -1];
    const LEFT_DOWN = [-1, 1];
    const RIGHT_UP = [1, -1];
    const RIGHT_DOWN = [1, 1];
    const LOOK_DIRECTIONS = [LEFT, RIGHT, UP, DOWN, LEFT_UP, LEFT_DOWN, RIGHT_UP, RIGHT_DOWN];
    for (let direction of LOOK_DIRECTIONS) {
      result = result.concat(this.lookInDirection(...direction));
    }
    return result;
  }

  lookInDirection(horizontal, vertical) {
    let result = [0, 0, 0]; //{food: 0, body: 0, wall: 0}
    let i = this._head.x + horizontal;
    let j = this._head.y + vertical;
    let distance = 1;
    let value;
    let bodyFound = false;
    let foodFound = false;
    do {
      value = this.board[i][j];
      if (!bodyFound && value === CELL_TYPE.SNAKE) {
        bodyFound = true;
        result[1] = 1;
      }
      if (!foodFound && value === CELL_TYPE.FOOD) {
        foodFound = true;
        result[0] = 1;
      }
      i += horizontal;
      j += vertical;
      distance++;
    } while(value !== CELL_TYPE.WALL);
    result[2] = 1 / distance;
    return result;
  }

};