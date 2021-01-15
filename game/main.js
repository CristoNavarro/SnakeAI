"use strict";

//import GameController from './gameController.js';

let game;
let stillAlive = true;
let iterations = 0;
let bestSnake;
let currentSnake;
let moveIndex = 0;
let stop = false;
const GENERATIONS_TO_SHOW = 15;

function setup() {
  const canvasWidth = 900;
  const canvasHeight = 900; 
  const cellsPerRow = 10;
  const cellsPerCol = 10;
  frameRate(1);
  tf.setBackend('cpu');
  createCanvas(canvasWidth, canvasHeight);
  background('black');
  game = new GameController(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
  game.configureStart(200, [4], 2, 0.6, 0.3);
  //game.gameCicle();
}

function draw() {
  if (!bestSnake) {
    //game.computeNGenerations(GENERATIONS_TO_SHOW);
    game.forDataComputeNGenerations();
    bestSnake = game.getBestSnake();
    currentSnake = new Snake(bestSnake.initialPoint, bestSnake.increaseSize, bestSnake.maxIterationsWithoutFood);
    moveIndex = 0;
    console.log(game.currentGeneration);
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

