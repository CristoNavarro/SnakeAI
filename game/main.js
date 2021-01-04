"use strict";

//import GameController from './gameController.js';

let game;
let stillAlive = true;
let iterations = 0;
let bestSnake;
let currentSnake;
let moveIndex = 0;
let stop = false;
const GENERATIONS_TO_SHOW = 10;

function setup() {
  const canvasWidth = 900;
  const canvasHeight = 900;
  const cellsPerRow = 12;
  const cellsPerCol = 12;
  frameRate(50);
  createCanvas(canvasWidth, canvasHeight);
  background('black');
  game = new GameController(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
  game.configureStart(200, [18, 18], 1.5, 0.2);
  //game.gameCicle();
}

function draw() {
  if (!bestSnake) {
    game.computeNGenerations(GENERATIONS_TO_SHOW);
    bestSnake = game.getBestSnake();
    currentSnake = new Snake(bestSnake.initialPoint, bestSnake.increaseSize, bestSnake.maxIterationsWithoutFood);
    moveIndex = 0;
    console.log(game.currentGeneration);
  } else {
    if (currentSnake.alive) {
      let currentMove = bestSnake.movements[moveIndex];
      game.draw(currentSnake, currentMove.food);
      game.moveSnake(currentSnake, currentMove.direction, currentMove.food);
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

