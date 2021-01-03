"use strict";

//import GameController from './gameController.js';

let game;
let stillAlive = true;
let iterations = 0;
let bestSnake;
let currentSnake;
let moveIndex = 0;
let stop = false;

function setup() {
  const canvasWidth = 900;
  const canvasHeight = 900;
  const cellsPerRow = 30;
  const cellsPerCol = 30;
  frameRate(10);
  createCanvas(canvasWidth, canvasHeight);
  background('black');
  game = new GameController(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
  game.configureStart(200, [5]);
  //game.gameCicle();
}

function draw() {
  /*if (stillAlive) {
    stillAlive = game.gameCicle();
  }*/
  if (!bestSnake) {
    game.nextGeneration();
    bestSnake = game.getBestSnake();
    currentSnake = new Snake(bestSnake.initialPoint, bestSnake.increaseSize, bestSnake.maxIterationsWithoutFood);
    moveIndex = 0;
    console.log("---------EMPIEZA----------");
  } else {
    if (currentSnake.alive) {
      let currentMove = bestSnake.movements[moveIndex];
      game.draw(currentSnake, currentMove.food);
      game.moveSnake(currentSnake, currentMove.direction, currentMove.food);
      moveIndex++;
    } else {
      console.log("------MUERE-------");
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

