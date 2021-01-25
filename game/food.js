'use strict';

/**
 * @desc Esta clase representa una comida del juego de la serpiente
 */
class Food {
  /**
   * @param  {Number} maxXPosition - posición X máxima donde puede aparecer la comida
   * @param  {Number} maxYPosition - posición Y máxima donde puede aparecer la comida
   * @param  {Snake} snake - serpiente con la que está relacionada la comida
   */
  constructor(maxXPosition, maxYPosition, snake) {
    this._maxXPosition = maxXPosition;
    this._maxYPosition = maxYPosition;
    this.selectNewPosition(snake);
  }

  /**
   * @desc getter de la posición de la comida
   * @return {Point} - Punto de la posición de la comida
   */
  get currentPos() {
    return this._currentPos;
  }

  /**
   * @desc getter de la posición x de la comida
   * @return {Number} - valor de la posición x
   */
  get x() {
    return this._currentPos.x;
  }
  /**
   * @desc getter de la posición y de la comida
   * @return {Number} - valor de la posición y
   */
  get y() {
    return this._currentPos.y;
  }
  
  /**
   * @desc esta función comprueba si un punto concreto está situado encima de una pared o no.
   * @param  {point} point - Posición que queremos comprobar si está en una pared o no
   */
  onWall(point) {
    if(point.x === 0 || point.x === this._maxXPosition - 1 ||
      point.y === 0 || point.y === this._maxYPosition - 1) {
        return true;
    }
    return false;
  }
  /**
   * @desc selecciona una nueva posición para la comida para asegurarse de que 
   * no esté encima de la serpiente o encima de una pared
   * @param {Snake} snake - serpiente para comparar la posición
   */
  selectNewPosition(snake) {
    let newPoint = new Point(this._maxXPosition, this._maxYPosition, true);
    while(snake.insideBody(newPoint) || this.onWall(newPoint)) {
      newPoint = new Point(this._maxXPosition, this._maxYPosition, true);
    }
    this._currentPos = newPoint;
  }
}