'use strict';

/**
 * @desc Clase encargada de generar comida y almacenarla, de tal forma que se
 *    pueda utilizar para obtener una aleatoria, o mantener la misma secuencia
 *    de comidas.
 */
class FoodDispenser {
  /**
   * @desc Constructor de la clase FoodDispenser. Necesita las dimensiones maximas
   *    en las que puede generar comida y el punto del que parten las serpientes.
   * @param  {Number} maxXPosition - Max coordinate of the X axis
   * @param  {Number} maxYPosition - Max coordinate of the Y axis
   * @param  {Point} initialPos - Punto en el que aparecen incialmente las serpientes
   */
  constructor(maxXPosition, maxYPosition, initialPos) {
    this._foodSet = [];
    this._maxXPosition = maxXPosition;
    this._maxYPosition = maxYPosition;
    this._auxSnake = new Snake(initialPos, 1);
    for (let i = 0; i < maxXPosition * maxYPosition; i++)
      this._generateRandomFood();
  }

  /**
   * @desc Crea y devuelve una comida para la serpiente dada.
   * @param {Snake} snake - Serpiente para la que vamos a generar una comida
   */
  getFood(snake) {
    let newFood = new Food(this._maxXPosition, this._maxXPosition, snake);
    this._foodSet.push(newFood);
    return newFood;
  }
  /**
   * @desc Esta función genera una nueva comida en una posición aleatoria
   *    y la añade al dispensador de comida.
   */
  _generateRandomFood() {
    let newFood = new Food(this._maxXPosition, this._maxXPosition, this._auxSnake);
    this._foodSet.push(newFood);
  }
}