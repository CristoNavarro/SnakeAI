'use strict';

/*import GameBoard from './gameBoard.js';
import Snake from './snake.js';
import Food from './food.js';
import Point from './point.js';*/

class GameController {
  constructor(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight, growthByFood = 1, timeStep = 1) {
    this._growthByFood = growthByFood;
    this._initialPos = new Point(Math.trunc(cellsPerRow / 2), Math.trunc(cellsPerCol / 2));
    this._cellsPerCol = cellsPerCol;
    this._cellsPerRow = cellsPerRow;
    this._timeStep = timeStep;
    this._gameBoard = new GameBoard(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
    this._firstGenerationCreated = false;
    this._ordered = false;
    this._maxIterationsPerSnake = this._cellsPerCol + this._cellsPerRow;
  }

  get currentGeneration() {
    return this._currentGeneration;
  }

  configureStart(snakePopulation = 10, hiddenLayersNodes = [8], selectivePreassure = 1.5, numberOfPairs = 0.2) {
    const INPUTS_AMOUNT = 24;
    const OUTPUT_AMOUNT = 4;
    this._population = [];
    this._probabilities = [];
    this._numberOfPairs = Math.trunc(numberOfPairs * snakePopulation);
    for (let i = 0; i < snakePopulation; i++) {
      let snake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      let brain = new NeuralNetwork(INPUTS_AMOUNT, hiddenLayersNodes, OUTPUT_AMOUNT);
      let food = new Food(this._cellsPerCol, this._cellsPerRow, snake);
      this._population.push({snake: snake, brain: brain, food: food});
    }
    this._createProbabilities(selectivePreassure);
    this._currentGeneration = 1;
  }

  get currentGeneration() {
    return this._currentGeneration;
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
        let input = this._getInput(snake, food);
        let direction = this._predictionToDirection(brain.predict(input), snake);
        this._moveSnakePrivate(this._population[i], direction);
      }
    }
    return stillAlive;
  }

  computeNGenerations(numberOfGenerations) {
    for (let i = 0; i < numberOfGenerations; i++) {
      this.nextGeneration();
    }
  }

  // TODO, crear de verdad la nueva generación
  nextGeneration() {
    if (!this._firstGenerationCreated) {
      this._evaluateGeneration();
      this._firstGenerationCreated = true;
    } else {
      // Ordenar
      this._currentGeneration++;
      this._orderGeneration();
      //console.log("motrando ordenado");
      //for (let population of this._population) {
        //console.log(`${population.snake.score} points and ${population.snake.iterationsAlive} time`);
      //}
      // Seleccionar parejas
      let pairs = this._selectParents();
      // Generar y mutar hijos
      let offspring = this._createOffspring(pairs);
      // Reemplazo en la poblacion
      this._replaceWorstIndividuals(offspring);
      this._resetIndividuals();
      this._evaluateGeneration();
      this._ordered = false;
    }
  }

  _resetIndividuals() {
    for (let i = 0; i < this._population.length; i++) {
      let food = new Food(this._cellsPerCol, this._cellsPerRow, this._population[i].snake);
      let snake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      this._population[i].food = food;
      this._population[i].snake = snake;
    }
  }

  _evaluateGeneration() {
    let stillAlive = true;
    while(stillAlive) {
      stillAlive = false;
      for (let i = 0; i < this._population.length; i++) {
        if (this._population[i].snake.alive) {
          stillAlive = true
          let snake = this._population[i].snake;
          let brain = this._population[i].brain;
          let food = this._population[i].food;
          let input = this._getInput(snake, food);
          let direction = this._predictionToDirection(brain.predict(input), snake);
          this._moveSnakePrivate(this._population[i], direction);
        }
      }
    }
    return stillAlive;
  }

  moveSnake(snake, direction, food) {
    this._moveSnakePrivate({snake: snake, food: food}, direction);
  }

  draw(snake, food) {
    this._gameBoard.setCurrentStatus(snake, food);
    this._gameBoard.draw();
  }

  getBestSnake() {
    this._orderGeneration();
    return this._population[this._population.length - 1].snake;
  }

  _getInput(snake, food) {
    this._gameBoard.reset();
    this._gameBoard.setCurrentStatus(snake, food);
    let result = this._gameBoard.getStatus();
    return result;
  }

  _predictionToDirection(prediction, snake) {
    let indexOfPrediction = indexOfMax(prediction);
    if (Object.values(DIRECTIONS)[indexOfPrediction] === snake.cantMoveTo) {
      indexOfPrediction = indexOfMax(prediction, indexOfPrediction);
    }
    return Object.values(DIRECTIONS)[indexOfPrediction];

    /**switch(indexOfPrediction) {
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
    return false;*/
  }

  _orderGeneration() {
    if (!this._ordered) {
      this._ordered = true;
      this._population.sort((a, b) => {
        if (a.snake.score > b.snake.score) {
          return 1;
        }
        if (a.snake.score < b.snake.score) {
          return -1;
        }
        if (a.snake.iterationsAlive > b.snake.iterationsAlive) {
          return 1;
        }
        if (a.snake.iterationsAlive < b.snake.iterationsAlive) {
          return -1;
        }
        return 0;
      });
    }
  }

  _selectParents() {
    let pairs = [];
    let alreadySelected = {};
    let randomNumber;
    while (pairs.length < this._numberOfPairs) {
      randomNumber = Math.random() * this._probabilities[this._probabilities.length - 1];
      let newPair = [];
      for (let i = 0; i < this._population.length; i++) {
        if (randomNumber <= this._probabilities[i]) {
          newPair.push(i);
          randomNumber = Math.random() * this._probabilities[this._probabilities.length - 1];
          for (let j = 0; j < this._population.length; j++) {
            if (randomNumber <= this._probabilities[j]) {
              newPair.push(j);
              break;
            }
          }
          break;
        }
      }
      pairs.push(newPair);
    }
    return pairs;
  }

  _createOffspring(parents) {
    let offspring = [];
    for (let pair of parents) {
      let childBrain = this._population[pair[0]].brain.breed(this._population[pair[1]].brain);
      childBrain.mutate();
      let childSnake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      let childFood = new Food(this._cellsPerCol, this._cellsPerRow, childSnake);
      offspring.push({snake: childSnake, food: childFood, brain: childBrain});
    }
    return offspring;
  }

  _replaceWorstIndividuals(offspring) {
    /*console.log("~~~~~~~~~~Antes~~");
    this._population[0].brain.show();*/
    //console.log(`${this._population[0].snake.score}  | ${this._population[0].snake.iterationsAlive}`);
    let worstIndividuals = this._population.splice(0, offspring.length, ...offspring);
    /*console.log("~~Despues~~~~~~~~~~")
    this._population[0].brain.show();*/
    worstIndividuals.forEach(function(element) {
      element.brain.dispose();
    });
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

  _createProbabilities(selectivePreassure) {
    const snakePopulation = this._population.length;
    const lowestProbability = (2 - selectivePreassure) / snakePopulation;
    let initialProbability = lowestProbability;
    this._probabilities.push(initialProbability);
    for (let i = 1; i < this._population.length; i++) {
      let probability = lowestProbability + (2 * i * (selectivePreassure - 1)) / (snakePopulation * (snakePopulation - 1));
      probability += this._probabilities[i - 1];
      this._probabilities.push(probability);
    }
  }
}
