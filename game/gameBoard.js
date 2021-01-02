"use strict";

//import {CELL_TYPE} from './utils.js'

class GameBoard {
  constructor(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight) {
    this._board = new Array(cellsPerCol);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(cellsPerRow);
    }
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = CELL_TYPE.EMPTY;
      }
    }
    this._widthOfCell = canvasWidth / cellsPerRow;
    this._heightOfCell = canvasHeight / cellsPerCol;
  }

  get board() {
    return this._board;
  }

  reset() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
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
  }

  _setSnake(snake) {
    this.reset();
    for (let bodyPart of snake.body) {
      //console.log(`${bodyPart.x} ,  ${bodyPart.y}`)
      this.board[bodyPart.x][bodyPart.y] = CELL_TYPE.SNAKE;
    }
  }

};