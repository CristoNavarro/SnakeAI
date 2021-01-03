'use strict';

/*import GameBoard from './gameBoard.js';
import Snake from './snake.js';
import Food from './food.js';
import Point from './point.js';*/

class GameController {
  constructor(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight, growthByFood = 1, timeStep = 1) {
    this._growthByFood = growthByFood;
    this._initialPos = new Point(1, 1);
    this._cellsPerCol = cellsPerCol;
    this._cellsPerRow = cellsPerRow;
    this._timeStep = timeStep;
    this._gameBoard = new GameBoard(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
    this._firstGenerationCreated = false;
  }

  configureStart(snakePopulation = 1, hiddenLayersNodes = [8]) {
    const INPUTS_AMOUNT = 6;
    const OUTPUT_AMOUNT = 4;
    this._population = [];
    for (let i = 0; i < snakePopulation; i++) {
      let snake = new Snake(this._initialPos, this._growthByFood, this._cellsPerCol * this._cellsPerRow * 0.5);
      let brain = new NeuralNetwork(INPUTS_AMOUNT, hiddenLayersNodes[0], OUTPUT_AMOUNT);
      let food = new Food(this._cellsPerCol, this._cellsPerRow, snake);
      this._population.push({snake: snake, brain: brain, food: food});
    }
  }

  gameCicle() {
    let stillAlive = false;
    if (this._population[0].snake.alive) {
      this._gameBoard.setCurrentStatus(this._population[0].snake, this._population[0].food);
      this._gameBoard.draw();
    }
    for (let i = 0; i < this._population.length; i++) {
      if (this._population[i].snake.alive) {
        stillAlive = true
        let snake = this._population[i].snake;
        let brain = this._population[i].brain;
        let food = this._population[i].food;
        let input = this.getInput(snake, food);
        let direction = this.predictionToDirection(brain.predict(input));
        this._moveSnakePrivate(this._population[i], direction);
      }
    }
    return stillAlive;
  }

  // TODO, crear de verdad la nueva generación
  nextGeneration() {
    if (!this._firstGenerationCreated) {
      this.evaluateGeneration();
    } else {
      
    }
  }

  evaluateGeneration() {
    let stillAlive = true;
    while(stillAlive) {
      stillAlive = false;
      for (let i = 0; i < this._population.length; i++) {
        if (this._population[i].snake.alive) {
          stillAlive = true
          let snake = this._population[i].snake;
          let brain = this._population[i].brain;
          let food = this._population[i].food;
          let input = this.getInput(snake, food);
          let direction = this.predictionToDirection(brain.predict(input));
          this._moveSnakePrivate(this._population[i], direction);
        }
      }
    }
    return stillAlive;
  }

  predictionToDirection(prediction) {
    let indexOfPrediction = indexOfMax(prediction);
    switch(indexOfPrediction) {
      case 0:
        return DIRECTIONS.NORTH;
        break;
      case 1:
        return DIRECTIONS.WEST;
        break;
      case 2:
        return DIRECTIONS.EAST;
        break;
      case 3:
        return DIRECTIONS.SOUTH;
        break;
    }
    return false;
  }

  getInput(snake, food) {
    this._gameBoard.reset();
    this._gameBoard.setCurrentStatus(snake, food);
    let result = this._gameBoard.getStatus();
    return Object.values(result);
  }

  moveSnake(snake, direction, food) {
    this._moveSnakePrivate({snake: snake, food: food}, direction);
  }

  _moveSnakePrivate(individual, direction) {
    let snake = individual.snake;
    let food = individual.food;
    let nextPoint;
    let snakeGrows = false;
    snake.setMovement(direction, food);
    nextPoint = snake.predictMovement(direction);
    //console.log(nextPoint);
    if (nextPoint.equals(food.currentPos)) {
      snakeGrows = true;
      snake.move(snakeGrows);
      individual.food = new Food(this._cellsPerCol, this._cellsPerRow, snake);
    } else if (snake.insideBody(nextPoint)) {
      //console.log("Game Over");
      snake.alive = false;
    } else if (this._gameBoard.onWall(nextPoint)) {
      //console.log("Wall");
      snake.alive = false;
    } else {
      snake.move(snakeGrows);
    }
  }

  draw(snake, food) {
    this._gameBoard.setCurrentStatus(snake, food);
    this._gameBoard.draw();
  }

  getBestSnake() {
    let maxScore = this._population[0].snake.score;
    let maxTimeAlive = this._population[0].snake.iterationsAlive;
    let bestSnakeIndex = 0;
    for (let i = 1; i < this._population.length; i++) {
      let score = this._population[i].snake.score;
      let timeAlive = this._population[i].snake.iterationsAlive;
      if (score > maxScore) {
        maxScore = score;
        maxTimeAlive = timeAlive;
        bestSnakeIndex = i;
      } else if (score === maxScore) {
        if (timeAlive > maxTimeAlive) {
          maxScore = score;
          maxTimeAlive = timeAlive;
          bestSnakeIndex = i;
        }
      }
    }
    return this._population[bestSnakeIndex].snake;
  }
}
