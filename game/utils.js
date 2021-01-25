"use strict";

/**
 * @desc Este objeto nos sirve de ENUM, para trabajar con direcciones y 
 *    poder cambiar nombre o tipo fácilmente sin tener que hacer más cambios en otras partes del código
 */
const DIRECTIONS = {
  NORTH: "north",
  SOUTH: "south",
  EAST: "east",
  WEST: "west"
}

/**
 * @desc Este objeto nos sirve de ENUM, para trabajar con los tipos de "celda" del gameBoard y 
 *    poder cambiar nombre o tipo fácilmente sin tener que hacer más cambios en otras partes del código
 */
const CELL_TYPE = {
  EMPTY: 'black',
  SNAKE: 'white',
  HEAD: 'green',
  FOOD: 'red',
  WALL: 'gray'
}

/**
 * @desc Esta función nos sirve para esperar cierta cantidad de tiempo en una punto del código concreto, de manera sínconra. Actualmente está en desuso.
 */
function wait(seconds) {
  let miliseconds = seconds * 1000;
  let date = new Date();
  let newDate = null;
  do {
    newDate = new Date();
  } while(newDate - date < miliseconds);
}

/**
 * @desc Esta función, dado un array y un conjunto de indices cantBe, 
 *     devuelve el mayor número del array cuyo índice no está en cantBe
 * @param {Array} arr - Array en el cuál vamos a buscar un máximo
 * @param {Array} cantBe - Array de índices que no pueden ser solución
 * @return {Number} - El índice de la mayor ocurrencia en el array (tal que el elemento no esté en cantBe)
 */
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
