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
  FOOD: 'black',
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

function indexOfMax(arr, cantBe = [-1]) {
  if (arr.length === 0) {
    return -1;
  }
  let max = -Infinity;
  let maxIndex = 0;
  if (cantBe.length && cantBe[0] === - 1) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max && arr[i]) {
        maxIndex = i;
        max = arr[i];
      }
    }
  }
  else {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        let can = true;
        for (let j = 0; j < cantBe.length; j++) {
          if (i == cantBe[j])
            can = false;
        }
        if (can) {
          maxIndex = i;
          max = arr[i];
        }
      }
    }
  }
  return maxIndex;
}

/*export default {
  DIRECTIONS,
  CELL_TYPE
}*/