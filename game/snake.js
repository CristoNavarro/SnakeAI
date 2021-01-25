'use strict';

/**
 * @desc Clase que representa una serpiente en el juego Snake. Esta formada por
 * un array de Point y se puede mover en cuatro direcciones y crecer.
 */
class Snake {
  /**
   * @desc Constructor de la clase Snake.
   * @param  {Point} initialPoint - Punto del que parte la serpiente
   * @param  {Number} increaseSize - Numero de celdas que crece al comer
   * @param  {Number} maxIterationsWithoutFood - Movimientos que puede hacer sin comer antes de morir
   */
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
    this._muertoHambre = false;
  }

  /**
   * @desc Getter de la cabeza de la serpiente.
   * @return {Point} - Punto en el que está colocada la cabeza.
   */
  get head() {
    return this._body[0];
  }

  /**
   * @desc Getter del cuerpo entero de la serpiente.
   * @return {Array} - Conjunto de puntos que conforman a la serpiente.
   */
  get body() {
    return this._body;
  }

  /**
   * @desc Getter de la puntuacion de la serpiente.
   * @return {Number} - Puntuacion obtenida por lasepiente.
   */
  get score() {
    return this._score;
  }

  /**
   * @desc Getter del movimiento que no puede realizar en este momento.
   * @return {String} - Movimiento que no puede hacer
   */
  get cantMoveTo() {
    return this._cantMoveTo;
  }
  
  /**
   * @desc Getter de las iteraciones que lleva la serpiente sin comer.
   * @return {Number} - Numero de movimientos que lleva la serpiente sin comer
   */
  get iterationsNoFood() {
    return this._iterationsNoFood;
  }
  
  /**
   * @desc Getter del estado actual de la serpiente.
   * @return {Boolean} - true si sigue viva.
   */
  get alive() {
    return this._alive;
  }

  /**
   * @desc Establece un nuevo estado para la serpiente.
   * @param  {Boolean} newStatus - Nuevo estado
   */
  set alive(newStatus) {
    this._alive = newStatus;
  }

  /**
   * @desc Getter del punto en el que aparece la serpiente.
   * @return {Point} - Punto inicial de la serpiente.
   */
  get initialPoint() {
    return this._initialPoint;
  }

  /**
   * @desc Getter del tamaño en el que crece la serpiente al comer.
   * @return {Number} - Numero de celdas que crece la serpiente despues de comer
   */
  get increaseSize() {
    return this._increaseSize;
  }
  
  /**
   * @desc Getter de los movimientos que ha hecho la serpiente.
   * @return {Array} - Conjunto de puntos que ha visitado.
   */
  get movements() {
    return this._movementsRecord;
  }

  /**
   * @desc Getter del número máximo de iteraciones que puede sobrevivir sin comer.
   * @return {Number} - Número máximo
   */
  get maxIterationsWithoutFood() {
    return this._maxIterationsWithoutFood;
  }

  /**
   * @desc Getter del numero total de movimientos de la serpiente.
   * @return {Number} - Numero de movimientos que ha efectuado la serpiente
   */
  get iterationsAlive() {
    return this._movementsRecord.length;
  }

  /**
   * @desc Este método se encarga de generar el siguiente punto al que debe ir la serpiente
   *    es decir, hacia dónde debe desplazarse su cabeza en el siguiente instante. 
   * @param {String} direction - Dirección a la que debería moverse.
   */
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

  
  /**
   * @desc Mueve la serpiente al siguiente punto. Si habia comida, crece (no se
   *    elimina el ultimo bloque de su cuerpo) y si no, se mantiene su tamaño.   
   * @param  {} grow
   */
  move(grow) {
    this._iterationsNoFood++;
    this.body.unshift(this._nextPoint);
    if (grow) {
      this._remainingIncrease += this._increaseSize;
      this._score++;
      this._iterationsNoFood = 0;
    } else {
      if (this._iterationsNoFood >= this._maxIterationsWithoutFood) {
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

  /**
   * @desc Método que compara dos serpientes basadas en el fitness de cada una.
   * @param {Snake} otherSnake - Serpiente a comparar
   */
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

  /**
   * @desc Calcula el fitness de la serpiente. Esta depende de su puntuacion
   *    y de las iteraciones que se a mantenido con vida, dando mas importancia
   *    a lo primero.
   * @return {Number} - Fitness de la serpiente
   */
  _calculateFitness() {
    if (this.iterationsAlive >= this._maxIterationsWithoutFood) {
      return this._score + 1;
    } else {
      return this._score + this.iterationsAlive / this._maxIterationsWithoutFood;
    }
  }

  /**
   * @desc Añade al registro de movimientos de la serpiente, el desplazamiento que ha hecho.
   *    Así como la comida de la que disponía.
   * @param {String} direction - Dirección a la que se desplaza.
   * @param {Food} food - Comida actual de la que dispone.
   */
  setMovement(direction, food) {
    this._movementsRecord.push({direction: direction, food: food});
  }
  
  /**
   * @desc Comprueba si el punto dado coincide con algun punto del cuerpo de la
   *    serpiente.
   * @param  {Point} point - Punto a comprobar
   * @return {Boolean} - True si esta en el cuerpo, False si no
   */
  insideBody(point) {
    for (let bodyPart of this._body) {
      if (point.equals(bodyPart)) {
        return true;
      }
    }
    return false;
  }
}