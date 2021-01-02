"use strict";

//import GameController from './gameController.js';

let game;

function setup() {
  const canvasWidth = 900;
  const canvasHeight = 900;
  const cellsPerRow = 7;
  const cellsPerCol = 7;
  createCanvas(canvasWidth, canvasHeight);
  background('black');
  game = new GameController(cellsPerRow, cellsPerCol, canvasWidth, canvasHeight);
  game.gameCicle();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    game.gameCicle(DIRECTIONS.NORTH);
  } else if (keyCode === DOWN_ARROW) {
    game.gameCicle(DIRECTIONS.SOUTH);
  } else if (keyCode === RIGHT_ARROW) {
    game.gameCicle(DIRECTIONS.EAST);
  } else if (keyCode === LEFT_ARROW) {
    game.gameCicle(DIRECTIONS.WEST);
  }
}
