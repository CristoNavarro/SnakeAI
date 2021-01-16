'use strict';

class FoodDispenser {
  constructor(maxXPosition, maxYPosition, initialPos) {
    this._foodSet = [];
    this._maxXPosition = maxXPosition;
    this._maxYPosition = maxYPosition;
    this._auxSnake = new Snake(initialPos, 1);
    for (let i = 0; i < maxXPosition * maxYPosition; i++)
      this._generateRandomFood();
  }

  getFood(snake) {
    /*let score = snake.score;
    for (let i = score - 1; i < this._foodSet.length; i++) {
      if (!snake.insideBody(this._foodSet[i].currentPos)) {
        return this._foodSet[i];
      }
    }*/
    let newFood = new Food(this._maxXPosition, this._maxXPosition, snake);
    this._foodSet.push(newFood);
    return newFood;
  }

  _generateRandomFood() {
    let newFood = new Food(this._maxXPosition, this._maxXPosition, this._auxSnake);
    this._foodSet.push(newFood);
  }
}