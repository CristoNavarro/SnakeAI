'use strict';

/**
 * @description Este es el controlador de juego. Es la clase principal de la aplicación. Crea el tablero de juego,
 *     recibe y configura los parámetros del algoritmo evolutivo además de otros parámetros del videojuego.
 *     Crea las neuvas poblaciones, aplicando el algoritmo evolutivo, y hace jugar a las serpientes.
 */
class GameController {
  /**
   * @desc El constructor del gameController.
   * @param {Number} cellsPerRow - Número de filas del juego
   * @param {Number} cellsPerCol - Número de columnas del juego
   * @param {Number} canvasWidth - Ancho del canvas
   * @param {Number} canvasHeight - Alto del canvas
   * @param {Number} growthByFood - Tamaño que crece cada serpiente al comer
   */
  constructor(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight, growthByFood = 1) {
    this._growthByFood = growthByFood;
    this._initialPos = new Point(Math.trunc(cellsPerRow / 2), Math.trunc(cellsPerCol / 2));
    this._cellsPerCol = cellsPerCol;
    this._cellsPerRow = cellsPerRow;
    this._gameBoard = new GameBoard(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
    this._firstGenerationCreated = false;
    this._ordered = false;
    this._maxIterationsPerSnake = this._cellsPerCol * this._cellsPerRow / 1.5;
    this._foodDispenser = new FoodDispenser(this._cellsPerCol, this._cellsPerRow, this._initialPos)
    this._maxScore = 0;
    this._reached = false;
  }

  /**
   * @description Getter de la generación actual.
   */
  get currentGeneration() {
    return this._currentGeneration;
  }
  
  /**
   * @desc Esta función configura por primera vez nuestra red neuronal.
   * @param {Number} snakePopulation - Número de serpientes que habrá por generación.
   * @param {Number} hiddenLayersNodes - Número de nodos de la capa oculta de nuestra red.
   * @param {Number} selectivePreassure - Valor que nos sirve para seleccionar a las mejores serpientes.
   * @param {Number} numberOfPairs - Porcentaje de parejas del total de la población que se harán.
   * @param {Number} mutationRate - Probabilidad de mutación.
   */
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
      let food = this._foodDispenser.getFood(snake);
      this._population.push({snake: snake, brain: brain, food: food});
    }
    this._createProbabilities(selectivePreassure);
    this._currentGeneration = 1;
  }

  /**
   * @desc Esta función nos computa las siguientes N generaciones 
   *    de serpientes, para mostrar los resultados obtenidos.
   * @param {Number} maxGenerations  
   */
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

  /**
   * @desc Esta función nos permite computar varias generaciones antes
   *    de mostrar los resultados obtenidos por la mejor serpiente.
   * @param {Number} numberOfGenerations - Número de generaciones a computar.
   */
  computeNGenerations(numberOfGenerations) {
    for (let i = 0; i < numberOfGenerations; i++) {
      let score = this.getBestSnake().score;
      if (score > this._maxScore) {
        this._maxScore = score;
      }
      this.nextGeneration();
    }
  }

  /**
   * @desc Hace todo el proceso para crear la siguiente generación. Si no hay ninguna generación en su lugar únicamente crea la primera.
   *    Este método se encarga de llamar ordenar la población según su fitness, llamar para seleccionar los padres, crear los hijos
   *    , reemplazar los peores de la anterior generación por los hijos, resetear las posiciones de cada serpiente para la siguiente iteración
   *    y finalmente evaluar la generación (dejandola evaluada para mostrar la mejor y obtener la siguiente generación)
   */
  nextGeneration() {
    if (!this._firstGenerationCreated) {
      this._evaluateGeneration();
      this._firstGenerationCreated = true;
    } else {
      // Ordenar
      this._currentGeneration++;
      this._orderGeneration();
      // Seleccionar parejas
      let pairs = this._selectParents();
      // Generar hijos
      let offspring = this._createOffspring(pairs);
      // Reemplazo en la poblacion
      this._replaceWorstIndividuals(offspring);
      // Mutar poblacion
      this._mutatePopulation();
      this._resetIndividuals();
      this._evaluateGeneration();
      this._ordered = false;
    }
  }
  
  /**
   * @desc Esta función resete a los individuos de la población
   *    para asegurarnos de que las serpientes, las comidas y sobre todo
   *    las redes neuronales que hacen de cerebro de las mismas se copien 
   *    y no sean referencias.
   */
  _resetIndividuals() {
    for (let i = 0; i < this._population.length; i++) {
      let snake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      let food = this._foodDispenser.getFood(snake);
      this._population[i].food = food;
      this._population[i].snake = snake;
      this._population[i].brain = this._population[i].brain.copy();
    }
  }

  /**
   * @desc Este método evalua la generación actual. Para ello mueve las serpientes por el tablero
   *    según lo que indique su red neuronal, dandole como input lo que nos devuelve el GameBoard,
   *    Este método terminará cuando todas las serpientes hayan terminado (no quede ninguna viva, recordamos
   *    que las serpientes pueden morir de hambre)
   */
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

  /**
   * @desc Este método se encarga de desplazar la serpiente en la dirección
   *    indicada. 
   * @param {Snake} snake - Serpiente que vamos a mover
   * @param {String} direction - Dirección hacia la que se va a desplazar
   * @param {Food} food - Comida actual de la serpiente
   */
  moveSnake(snake, direction, food) {
    this._moveSnakePrivate({snake: snake, food: food}, direction);
  }

  /**
   * @desc El método draw se encarga de actualizar el estado actual
   *    del tablero de juego para dibujar la serpiente actual
   *    así como la comida actual de la que dispone.
   * @param {Snake} snake - Serpiente que va a ser dibujada
   * @param {Food} food - Comida que va a ser dibujada
   */
  draw(snake, food) {
    if (snake && food) {
      this._gameBoard.setCurrentStatus(snake, food);
    }
    this._gameBoard.draw();
  }

  /**
   * @desc este método devuelve la mejor serpiente de la generación actual.
   */
  getBestSnake() {
    this._orderGeneration();
    return this._population[this._population.length - 1].snake;
  }

  /**
   * @desc Situa en el gameboard la serpiente y comida que se pasan como parámetros. Para posteriorente obtener y devolver
   *     el estado actual que percibe la serpiente, esto será usado como input de su red neuronal
   * @param {Snake} snake - Serpiente que vamos a situar en el gameBoard
   * @param {Food} food - Comida que vamos a situar en el gameBoard
   */
  _getInput(snake, food) {
    this._gameBoard.reset();
    this._gameBoard.setCurrentStatus(snake, food);
    let result = this._gameBoard.getStatus();
    return Object.values(result);
  }

  /**
   * @desc Una vez obtenida las predicciones desde la red neuronal (El grado de confianza para moverse a una dirección u otra)
   *    Aquí se convierte en una única dirección (Concretamente, la máxima)
   * @param {Array} prediction - Prediccion hecha por la red neuronal de la serpiente. Consiste en 4 números entre 0 y 1 
   *    (usamos soft max en la capa de salida). Que indican la probabilidad de ir hacia una dirección u otra
   */
  _predictionToDirection(prediction, snake) {
    let cantMoveTo = [];
    let indexOfPrediction = indexOfMax(prediction, cantMoveTo);
    cantMoveTo.push(indexOfPrediction);
    return Object.values(DIRECTIONS)[indexOfPrediction];
  }

  /**
   * @desc Este método se encarga de ordenar la generación actual de serpientes
   *    compara cada serpiente con un método de las mismas y las ordena, de esta forma
   *    la mejor serpiente siempre estará en la última posición.
   */
  _orderGeneration() {
    if (!this._ordered) {
      this._ordered = true;
      this._population.sort((a, b) => {
        return a.snake.compare(b.snake);
      });
    }
  }

  /**
   * @desc Se encarga de elegir los padres de la siguiente generación de serpientes. 
   *    Para ello se crea un número aleatorio que será comparado con las probabilidades
   *    previamente asignadas a cada serpiente. El primer padre se selecciona si la probabilidad es mayor
   *    que este número aleatorio, pero el siguiente padre se elige teniendo en cuenta la probabilidad
   *    de la mejor serpiente. 
   */
  _selectParents() {
    let pairs = [];
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
        pairs.push(newPair);
      }
    }
    return pairs;
  }

  /**
   * @desc Dado un conjunto de parejas de individuos (Serpiente con su red neuronal), creamos sus hijos y los devolvemos
   * @param {Array} parents - Conunto de parejas de individuos (Serpiente con su red neuronal) que serán los padres 
   * @return {Array} Conjunto de serpientes hijas
   */
  _createOffspring(parents) {
    let offspring = [];
    for (let pair of parents) {
      let childBrain = this._population[pair[0]].brain.breed(this._population[pair[1]].brain);
      let childSnake = new Snake(this._initialPos, this._growthByFood, this._maxIterationsPerSnake);
      let childFood = this._foodDispenser.getFood(childSnake);
      offspring.push({snake: childSnake, food: childFood, brain: childBrain});
    }
    return offspring;
  }

  /**
   * @desc En este método mutamos la población actual. Pasando como probabilidad de mutar this._mutationRate
   */
  _mutatePopulation() {
    const notMutable = Math.trunc(0.25 * this._population.length);
    for (let i = 0; i < this._population.length - notMutable; i++) {
      this._population[i].brain.mutate(this._mutationRate);
    }
  }

  /**
   * @desc En este método reemplazamos los peores individuos de la generación actual 
   *    por los hijos obtenidos que se pasan como parámetro
   * @param {Array} offspring - Individuos hijos que van a reemplazar a los peores individuos
   */
  _replaceWorstIndividuals(offspring) {
    let worstIndividuals = this._population.splice(0, offspring.length, ...offspring);
    worstIndividuals.forEach(function(element) {
      element.brain.dispose();
    });
  }

  /**
   * @desc Este método es un método auxiliar para mover una serpiente en una dirección concreta
   * @param {Object} individual - Objeto formado por una serpiente y su red neuronal asociada
   * @param {string} direction - Dirección a la que se va a mover la serpiente 
   */
  _moveSnakePrivate(individual, direction) {
    let snake = individual.snake;
    let food = individual.food;
    let nextPoint;
    let snakeGrows = false;
    snake.setMovement(direction, food);
    nextPoint = snake.predictMovement(direction);
    if (nextPoint.equals(food.currentPos)) {
      snakeGrows = true;
      snake.move(snakeGrows);
      individual.food = this._foodDispenser.getFood(snake);
    } else if (snake.insideBody(nextPoint)) {
      snake.alive = false;
    } else if (this._gameBoard.onWall(nextPoint)) {
      snake.alive = false;
    } else {
      snake.move(snakeGrows);
    }
  }

  /**
   * @desc Este método se ejecuta una vez, durante la configuración, para seleccionar los padres debemos darle a cada "individuo" 
   *    ( o para no tener que recalcular, a su posición) una probabilidad de ser seleccionado o no como padre. En este método obtenemos esas
   *    probabilidades que dependen del número de individuos de una población, y de un parámetro selectivePreassure
   * @param {Number} selectivePreassure - Este parámetro índica como de probable es que las serpientes "malas" sean seleccionadas o no.
   *    Va desde 0 a 2, si vale 2 las peores serpiente serán elegidas como padres una menor cantidad de veces. 
   *    Si vale 0 las peores serpientes tendrán mayor probabilidad de ser seleccionadas como padres
   */
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
