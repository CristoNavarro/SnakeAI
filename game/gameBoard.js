"use strict";

/**
 * @desc Esta clase representa el tablero de juego del videojuego snake
 */
class GameBoard {
  /**
   * @desc constructor de un gameBoard. Solo necesitaremos uno
   * @param {Number} cellsPerRow - Cantidad de filas que tiene el tablero
   * @param {Number} cellsPerCol - Cantidad de columnas que tiene el tablero
   */
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

  /**
   * @desc Getter del tablero de juego.
   * @return {Array} - Tablero del juego.
   */
  get board() {
    return this._board;
  }

  /**
   * @desc Comprueba si un determinado punto está en una pared o no
   * @param {Number} point - Punto que queremos comprobar donde está
   * @return {bool} - true si el punto esta en una pared, false otro caso
   */
  onWall(point) {
    return this.board[point.x][point.y] === CELL_TYPE.WALL;
  }

  /**
   * @desc Resetea el tablero para que todo sean casillas vacías.
   */
  reset() {
    for (let i = 1; i < this.board.length - 1; i++) {
      for (let j = 1; j < this.board[i].length - 1; j++) {
        this.board[i][j] = CELL_TYPE.EMPTY;
      }
    }
  }

  /**
   * @desc Dibuja el tablero en el canvas, cada casilla es un cuadrado
   * con los bordes redondeados. 
   */
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

  /**
   * @desc Actualiza el estado actual del tablero colocando la serpiente
   * correspondiente así como la comida actual de la que dispone.
   * @param {Snake} snake - Serpiente actual en el tablero.
   * @param {Food} food - Comida actual en el tablero.
   */
  setCurrentStatus(snake, food) {
    this._setSnake(snake);
    this._setFood(food)
  }

  /**
   * @desc fija la posición de la comida en el tablero
   * @param {Food} food - nueva comida que vamos a fijar en el tablero
   */
  _setFood(food) {
    this.board[food.x][food.y] = CELL_TYPE.FOOD; 
    this._food = new Point(food.x, food.y);
  }

  /**
   * @desc Esta función recibe una serpiente, resetea el tablero 
   * y coloca en las casillas correspondientes a la serpiente.
   * @param {Snake} snake - Serpiente que va a ser colocada en el tablero.
   */
  _setSnake(snake) {
    this.reset();
    for (let bodyPart of snake.body) {
      this.board[bodyPart.x][bodyPart.y] = CELL_TYPE.SNAKE;
    }
    this.board[snake.head.x][snake.head.y] = CELL_TYPE.HEAD;
    this._head = snake.head;
  }

  /**
   * @desc esta función recopila datos sobre el estado actual del tablero, desde la perspectiva de la serpiente
   *    Los datos que devuelve serán usados por las redes neuronales como entrada
   * @return {Array} - Estado actual desde la perspectiva de la serpiente 
   *    (en 8 direcciones, mira por comida, peligro inminente, y 1/distancia a obstaculo)
   */
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

  /**
   * @desc recopila, en una de las 8 direcciones descritas en getStatus, la información correspondiente de getStatus
   * @return {Array} - Información recopilada en una dirección concreta
   */
  lookInDirection(horizontal, vertical) {
    let result = [0, 0, 0]; //{inmediate danger, food, 1 / distance}
    let i = this._head.x + horizontal;
    let j = this._head.y + vertical;
    if (this.board[i][j] === CELL_TYPE.SNAKE || this.board[i][j] === CELL_TYPE.WALL) {
      result[0] = 1
    }
    else {
      result[0] = 0;
    }
    let distance = 0;
    let value;
    let bodyFound = false;
    let foodFound = false;
    let dangerFound = false;
    do {
      value = this.board[i][j];
      if (!foodFound && value === CELL_TYPE.FOOD) {
        foodFound = true;
        result[1] = 1;
      }
      i += horizontal;
      j += vertical;
      distance++;
    } while(value !== CELL_TYPE.WALL && value !== CELL_TYPE.SNAKE);
    result[2] = 1 / distance;
    return result;
  }
};