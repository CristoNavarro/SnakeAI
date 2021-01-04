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

function indexOfMax(arr, cantBe = -1) {
  if (arr.length === 0) {
    return -1;
  }
  let max = -Infinity;
  let maxIndex = 0;
  if (cantBe === - 1) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max && arr[i]) {
        maxIndex = i;
        max = arr[i];
      }
    }
  }
  else {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max && i !== cantBe) {
        maxIndex = i;
        max = arr[i];
      }
    }
  }
  return maxIndex;
}

/*export default {
  DIRECTIONS,
  CELL_TYPE
}*/