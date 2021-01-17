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
    this._maxIterationsPerSnake = this._cellsPerCol * this._cellsPerRow / 1.5;
    this._foodDispenser = new FoodDispenser(this._cellsPerCol, this._cellsPerRow, this._initialPos)
    this._maxScore = 0;
    this._reached = false;
  }

  get currentGeneration() {
    return this._currentGeneration;
  }

  configureStart(snakePopulation = 10, hiddenLayersNodes = [8], selectivePreassure = 1.5, numberOfPairs = 0.2, mutationRate = 0.2) {
    this._mutationRate = mutationRate
    const INPUTS_AMOUNT = 24;
    const OUTPUT_AMOUNT = 4;
    this._population = [];
    this._probabilities = [];
    this._numberOfPairs = Math.trunc(numberOfPairs * snakePopulation);
    for (let i = 0; i < snakePopulation; i++) {
      let snake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      let brain = new NeuralNetwork(INPUTS_AMOUNT, hiddenLayersNodes, OUTPUT_AMOUNT);
      //let food = new Food(this._cellsPerCol, this._cellsPerRow, snake);
      let food = this._foodDispenser.getFood(snake);
      this._population.push({snake: snake, brain: brain, food: food});
    }
    this._createProbabilities(selectivePreassure);
    this._currentGeneration = 1;
  }

  forDataComputeNGenerations(maxGenerations = 400) {
    let maxScore = 0;
    let score = 0;
    while (score < 10 && this._currentGeneration < maxGenerations) {
      console.log(this._currentGeneration);
      this.nextGeneration();
      score = this.getBestSnake().score
      if (score > maxScore) {
        maxScore = score;
      }
    }
    console.log(`Ha llegado a ${score} puntos con ${this._currentGeneration} generaciones`);
    while (this._currentGeneration < maxGenerations) {
      this.nextGeneration();
      score = this.getBestSnake().score
      if (score > maxScore) {
        maxScore = score;
      }
    }
    console.log(`Puntuacion maxima con ${this._currentGeneration} generaciones: ${maxScore} puntos`);
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
      let score = this.getBestSnake().score;
      /*if (score >= 10 && !this._reached) {
        this._reached = true;
        console.log(`LLega a 10 puntos en ${this._currentGeneration} generaciones`)
      }*/
      if (score > this._maxScore) {
        this._maxScore = score;
      }
      this.nextGeneration();
    }
    //console.log(`Puntuacion maxima: ${this._maxScore}`)
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
      let fit = 0;
      for (let population of this._population) {
        fit += population.snake._calculateFitness()
        //console.log(`${population.snake.score} points and ${population.snake.iterationsAlive} time || Fit: ${population.snake._calculateFitness()}`);
      }
      //console.log(`Max Score: ${this._population[this._population.length - 1].snake.score}`)
      //console.log(`Overall Fitness: ${Math.round(fit / this._population.length * 100) / 100}`);
      //console.log(`${this._population[this._population.length - 1].snake.score} points and ${this._population[this._population.length - 1].snake.iterationsAlive} time (${this._population[this._population.length - 1].snake.fit})`);
      // Seleccionar parejas
      let pairs = this._selectParents();
      // Generar hijos
      let offspring = this._createOffspring(pairs);
      // Reemplazo en la poblacion
      this._replaceWorstIndividuals(offspring);
      // Mutar poblacion
      //this._population[0].brain.show();
      this._mutatePopulation();
      //this._population[0].brain.show();
      this._resetIndividuals();
      this._evaluateGeneration();
      this._ordered = false;
    }
  }

  _resetIndividuals() {
    for (let i = 0; i < this._population.length; i++) {
      //let food = new Food(this._cellsPerCol, this._cellsPerRow, this._population[i].snake);
      let snake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      let food = this._foodDispenser.getFood(snake);
      this._population[i].food = food;
      this._population[i].snake = snake;
      this._population[i].brain = this._population[i].brain.copy();
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
    if (snake && food) {
      this._gameBoard.setCurrentStatus(snake, food);
    }
    this._gameBoard.draw();
  }

  getBestSnake() {
    this._orderGeneration();
    return this._population[this._population.length - 1].snake;
    //return this._population[0].snake;
  }

  _getInput(snake, food) {
    this._gameBoard.reset();
    this._gameBoard.setCurrentStatus(snake, food);
    let result = this._gameBoard.getStatus();
    return Object.values(result);
  }

  _predictionToDirection(prediction, snake) {
    let cantMoveTo = [];
    let indexOfPrediction = indexOfMax(prediction, cantMoveTo);
    cantMoveTo.push(indexOfPrediction);
    //let cantMoveTo = [];
    /*for (let direction of snake.cantMoveTo) {
      if (Object.values(DIRECTIONS)[indexOfPrediction] === direction) {
        indexOfPrediction = indexOfMax(prediction, indexOfPrediction);
      }
    }*/
    /*if (Object.values(DIRECTIONS)[indexOfPrediction] === snake.cantMoveTo) {
      indexOfPrediction = indexOfMax(prediction, indexOfPrediction);
    }*/
    /*let iter = 0;
    let nextPoint = snake.predictMovement(Object.values(DIRECTIONS)[indexOfPrediction]);
    while (iter < 3 && (this._gameBoard.board[nextPoint.x][nextPoint.y] === CELL_TYPE.SNAKE || this._gameBoard.board[nextPoint.x][nextPoint.y] === CELL_TYPE.WALL)) {
      indexOfPrediction = indexOfMax(prediction, cantMoveTo);
      nextPoint = snake.predictMovement(Object.values(DIRECTIONS)[indexOfPrediction]);
      cantMoveTo.push(indexOfPrediction);
      iter++;
    }*/
    /*console.log('---');
    console.log(cantMoveTo);
    console.log(indexOfPrediction);
    console.log('---');*/
    return Object.values(DIRECTIONS)[indexOfPrediction];
  }

  _orderGeneration() {
    if (!this._ordered) {
      this._ordered = true;
      this._population.sort((a, b) => {
        return a.snake.compare(b.snake);
      });
        /*if (a.snake.score > b.snake.score) {
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
      });*/
    }
  }

  _selectParents() {
    let pairs = [];
    let alreadySelected = [];
    let randomNumber;
    while (pairs.length !== this._numberOfPairs) {
      randomNumber = Math.random();
      let newPair = [];
      let i = 0;
      let j = 0;
      for (i = 0; i < this._population.length; i++) {
        if (randomNumber <= this._probabilities[i]) {
          newPair.push(i);
          randomNumber = Math.random() * this._probabilities[this._probabilities.length - 1];
          for (j = 0; j < this._population.length; j++) {
            if (randomNumber <= this._probabilities[j]) {
              newPair.push(j);
              break;
            }
          }
          break;
        }
      }
      if (newPair.length == 2) {
        alreadySelected.push(i);
        alreadySelected.push(j);
        pairs.push(newPair);
      }
    }
    let sum = 0;
    for (let elem of pairs) {
      sum += (elem[0] + elem[1]) / 2
    }
    return pairs;
  }

  _createOffspring(parents) {
    let offspring = [];
    for (let pair of parents) {
      //console.log(pair);
      let childBrain = this._population[pair[0]].brain.breed(this._population[pair[1]].brain);
      //childBrain.mutate();
      let childSnake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      //let childFood = new Food(this._cellsPerCol, this._cellsPerRow, childSnake);
      let childFood = this._foodDispenser.getFood(childSnake);
      offspring.push({snake: childSnake, food: childFood, brain: childBrain});
    }
    return offspring;
  }

  _mutatePopulation() {
    const notMutable = Math.trunc(0.25 * this._population.length);
    for (let i = 0; i < this._population.length - notMutable; i++) {
      this._population[i].brain.mutate(this._mutationRate);
    }
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
      individual.food = this._foodDispenser.getFood(snake);
      //individual.food = new Food(this._cellsPerCol, this._cellsPerRow, snake);
    } else if (snake.insideBody(nextPoint)) {
      //console.log("Game Over");
      //snake._score = snake.score - 0.5; 
      snake.alive = false;
    } else if (this._gameBoard.onWall(nextPoint)) {
      //console.log("Wall");
      snake.alive = false;
      //snake._score = snake.score - 0.5; 
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
    //console.log(this._probabilities);
  }
}
