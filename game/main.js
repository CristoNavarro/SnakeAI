"use strict";

//import GameController from './gameController.js';

function setup() {
  const canvasWidth = 900;
  const canvasHeight = 900;
  const cellsPerRow = 7;
  const cellsPerCol = 7;
  createCanvas(canvasWidth, canvasHeight);
  background('black');
  let game = new GameController(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
  game.gameCicle();
  game.gameCicle();
}

