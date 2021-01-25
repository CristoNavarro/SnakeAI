'use strict';

/**
 * @desc Clase que representa un punto, con una coordenada x y una y.
 */
class Point {
  /**
   * @desc Constructor de la clase punto. Asigna los valores de las coordenadas,
   * ya sean aleatorios o los dados.
   * @param  {Number} x - Coordinate x
   * @param  {Number} y - Coordinate y
   * @param  {Boolean} random - True if the coordinates are random
   */
  constructor(x, y, random = false) {
    if (random) {
      this._x = Math.floor(Math.random() * x);
      this._y = Math.floor(Math.random() * y);
    } else {
      this._x = x;
      this._y = y
    }
  }

  /**
   * @desc Accede a la coordenada x del punto.
   * @return {Number} - Coordenada x
   */
  get x() {
    return this._x;
  }

  /**
   * @desc Accede a la coordenada y del punto.
   * @return {Number} - Coordenada y
   */
  get y() {
    return this._y;
  }
  /**
   * Comprueba si dos puntos son iguales mediante sus coordenadas.
   * @param  {Point} otherPoint - Punto con el que se compara
   * @return {Boolean} - True si son iguales, False si no.
   */
  equals(otherPoint) {
    return this.x === otherPoint.x && this.y === otherPoint.y;
  }
}