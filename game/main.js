"use strict";

//import GameController from './gameController.js';

let game;
let stillAlive = true;
let iterations = 0;
let bestSnake;
let currentSnake;
let moveIndex = 0;
let stop = false;
const GENERATIONS_TO_SHOW = 1;
let slider;
let pauseButton;
let playButton;
let startButton;
let snakeBuffer;
let outputBuffer;
let canStart = false;
let population;
let mutation;
let pressure;
let parents;
const initialPopulation = 200;
const initialMutation = 0.3;
const initialPressure = 2;
const initialParents = 0.6;
let populationValue = initialPopulation;
let mutationValue = initialMutation;
let pressureValue = initialPressure;
let parentsValue = initialParents;


function setup() {
  const canvasWidth = 1400;
  const canvasHeight = 900; 
  const cellsPerRow = 10;
  const cellsPerCol = 10;
  const snakeSize = 900;

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  // Dividir canvas
  snakeBuffer = createGraphics(900, 900);
  outputBuffer = createGraphics(500, 900);

  // Setup de cada parte
  outputSetup();

  // Botones
  pauseButton = createButton('Pause');
  playButton = createButton('Play');
  startButton = createButton('Start');
  setButtonStyles();
  setInitialColors();
  pauseButton.mousePressed(pauseExecution);
  pauseButton.mouseReleased(setInitialColors);
  playButton.mousePressed(resumeExecution);
  playButton.mouseReleased(setInitialColors);
  startButton.mousePressed(startExecution);
  startButton.mouseReleased(setInitialColors);

  // Slider
  slider = createSlider(5, 60, 1);
  slider.style('width', '120px');

  // Inputs
  population = createInput(initialPopulation);
  population.input(populationInput);
  pressure = createInput(initialPressure);
  pressure.input(pressureInput);
  parents = createInput(initialParents);
  parents.input(parentsInput);
  mutation = createInput(initialMutation);
  mutation.input(mutationInput);
  setInputStyle();

  // Position elements
  setPositions();

  // Ejecucion
  frameRate(slider.value());
  tf.setBackend('cpu');
  background('black');
  game = new GameController(cellsPerRow, cellsPerCol, snakeSize, snakeSize);
  game.configureStart(200, [24], 2, 0.6, 0.3);
  //game.gameCicle();
  fill(0, 102, 153, 51);
  textSize(32);
}

function draw() {
  frameRate(slider.value());
  if (canStart) {
    drawSnakeBuffer();
  } else {
    game.draw();
  }
  //drawSnakeBuffer();
  drawOutputBuffer();
  image(snakeBuffer, 0, 0);
  image(outputBuffer, 900, 0);
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    stop = !stop;
    if (stop) {
      noLoop();
    } else {
      loop();
    }
  } 
}

function pauseExecution() {
  pauseButton.style('background-color', 'gray');
  noLoop();
}

function setInitialColors() {
  pauseButton.style('background-color', color(200,255,255));
  playButton.style('background-color', color(200,255,255));
  startButton.style('background-color', color(200,255,255));
}

function resumeExecution() {
  playButton.style('background-color', 'gray');
  loop();
}

function startExecution() {
  startButton.style('background-color', 'gray');
  if (!canStart) {
    game.configureStart(populationValue, [24], pressureValue, parentsValue, mutationValue);
  }
  canStart = true;
}

function setButtonStyles() {
  pauseButton.style('font-size', '30px');
  pauseButton.style('width', '100px');
  playButton.style('font-size', '30px');
  playButton.style('width', '100px');
  startButton.style('font-size', '30px');
  startButton.style('width', '100px');
}

function setInputStyle() {
  population.style('font-size', '30px');
  population.style('width', '100px');
  pressure.style('font-size', '30px');
  pressure.style('width', '100px');
  parents.style('font-size', '30px');
  parents.style('width', '100px');
  mutation.style('font-size', '30px');
  mutation.style('width', '100px');
}

function setPositions() {
  // Button positions
  startButton.position(1250, 700);
  playButton.position(1400, 700);
  pauseButton.position(1550, 700);

  // Slider position
  slider.position(1400, 800);

  // Inputs position
  population.position(1550, 340);
  pressure.position(1550, 415);
  parents.position(1550, 490);
  mutation.position(1550, 565);
}

function drawSnakeBuffer() {
  if (!bestSnake) {
    game.computeNGenerations(GENERATIONS_TO_SHOW);
    //game.forDataComputeNGenerations();
    bestSnake = game.getBestSnake();
    currentSnake = new Snake(bestSnake.initialPoint, bestSnake.increaseSize, bestSnake.maxIterationsWithoutFood);
    moveIndex = 0;
    //console.log(game.currentGeneration);
    //console.log("EMPIEZO A MOSTRAR");
  } else {
    if (currentSnake.alive) {
      
      let currentMove = bestSnake.movements[moveIndex];
      game.moveSnake(currentSnake, currentMove.direction, currentMove.food);
      game.draw(currentSnake, currentMove.food);
      //console.log(currentSnake._muertoHambre);
      //console.log(game._getInput(currentSnake, currentMove.food));
      moveIndex++;
    } else {
      bestSnake = false;
    }
  }
}

function outputSetup() {
  outputBuffer.textSize(32);
  outputBuffer.fill(255, 255, 255);
}

function drawOutputBuffer() {
  outputBuffer.background('black');
  outputBuffer.textSize(40);
  outputBuffer.text('Snake AI Evolution', 80, 100);
  outputBuffer.textSize(32);
  outputBuffer.text('Current generation: ', 80, 200);
  outputBuffer.text(game._currentGeneration, 400, 200);
  outputBuffer.text('Maximum Score: ', 80, 250);
  outputBuffer.text(game._maxScore, 400, 250);
  outputBuffer.text('Population Size: ', 80, 350);
  outputBuffer.text('Selective Pressure: ', 80, 425);
  outputBuffer.text('Rate of parents: ', 80, 500);
  outputBuffer.text('Mutation Rate: ', 80, 575);
  outputBuffer.text('Speed: ', 80, 800);
}

function populationInput() {
  let value = parseInt(this.value());
  if (!value || value <= 0) {
    alert('El tamaño de la población tiene que ser un número positivo mayor que 0.');
  } else {
    populationValue = value;
  }
}

function mutationInput() {
  let value = parseFloat(this.value());
  if (!value || value <= 0.0 || value > 1.0) {
    alert('La probabilidad de mutacion es entre 0 y 1.');
  } else {
    pressureValue = value;
  }
}

function pressureInput() {
  let value = parseFloat(this.value());
  if (!value || value <= 0.0 || value > 2.0) {
    alert('La presión selectiva es entre 0 y 2.');
  } else {
    pressureValue = value;
  }
}

function parentsInput() {
  let value = parseFloat(this.value());
  if (!value || value <= 0.0 || value > 1.0) {
    alert('El indice de seleccion de padres va entre 0 y 1.');
  } else {
    parentsValue = value;
  }
}
