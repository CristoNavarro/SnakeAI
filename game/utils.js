"use strict";

const DIRECTIONS = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west"
}

const CELL_TYPE = {
  EMPTY: 'black',
  SNAKE: 'white',
  HEAD: 'green',
  FOOD: 'red',
  WALL: 'gray'
}

function wait(seconds) {
  let miliseconds = seconds * 1000;
  let date = new Date();
  let newDate = null;
  do {
    newDate = new Date();
  } while(newDate - date < miliseconds);
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }
  let max = arr[0];
  let maxIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }
  return maxIndex;
}

/*export default {
  DIRECTIONS,
  CELL_TYPE
}*/