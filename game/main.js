"use strict";

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

/**
 * @desc Funcion de P5 que se ejecuta al cargar la pagina y prepara los canvas
 * donde se va a representar el juego y la informacion, asi como los elementos
 * de la interfaz y el propio juego.
 */
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

  // Setup de cada parte del canvas
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

  // Configuracion del juego
  game = new GameController(cellsPerRow, cellsPerCol, snakeSize, snakeSize);
  game.configureStart(200, [24], 2, 0.6, 0.3);

  fill(0, 102, 153, 51);
  textSize(32);
}

/**
 * @desc Funcion que se ejecuta en cada frame. Ejecuta y dibuja el juego en su
 * canvas correspondiente, y los datos de salida por el otro.
 */
function draw() {
  frameRate(slider.value());
  if (canStart) {
    drawSnakeBuffer();
  } else {
    game.draw();
  }
  drawOutputBuffer();
  image(snakeBuffer, 0, 0);
  image(outputBuffer, 900, 0);
}

/**
 * @desc Si se pulsa la tecla de retroceso, se para la ejecucion del juego.
 */
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

/**
 * @desc Funcion asociada al boton de pausa. Para la ejecucion de la funcion
 * draw, y por lo tanto, la ejecucion del juego.
 */
function pauseExecution() {
  pauseButton.style('background-color', 'gray');
  noLoop();
}

/**
 * @desc Establece los colores base de los botones de la interfaz.
 */
function setInitialColors() {
  pauseButton.style('background-color', color(200,255,255));
  playButton.style('background-color', color(200,255,255));
  startButton.style('background-color', color(200,255,255));
}

/**
 * @desc Funcion asociada al boton de play. Reanuda la ejecucion de la funcion
 * play, y por lo tanto, del juego.
 */
function resumeExecution() {
  playButton.style('background-color', 'gray');
  loop();
}

/**
 * @desc Comienza la ejecucion del juego, estableciendo como parametros los
 * obtenidos de los inputs de la interfaz.
 */
function startExecution() {
  startButton.style('background-color', 'gray');
  if (!canStart) {
    game.configureStart(populationValue, [24], pressureValue, parentsValue, mutationValue);
  }
  canStart = true;
}

/**
 * @desc Establece el estilo de los botones.
 */
function setButtonStyles() {
  pauseButton.style('font-size', '30px');
  pauseButton.style('width', '100px');
  playButton.style('font-size', '30px');
  playButton.style('width', '100px');
  startButton.style('font-size', '30px');
  startButton.style('width', '100px');
}

/**
 * @desc Establece el estilo de los inputs de texto de la interfaz.
 */
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

/**
 * @desc Coloca los elementos de la interfaz en sus correspondientes posiciones.
 */
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

/**
 * @desc Muestra los movimientos de la mejor serpiente de la generacion. Cuando
 * se muestra su ultimo movimiento, se computa una nueva generacion y se
 * obtiene nuevamente a la mejor serpiente para registrar sus movimientos.
 */
function drawSnakeBuffer() {
  if (!bestSnake) {
    game.computeNGenerations(GENERATIONS_TO_SHOW);
    bestSnake = game.getBestSnake();
    currentSnake = new Snake(bestSnake.initialPoint, bestSnake.increaseSize, bestSnake.maxIterationsWithoutFood);
    moveIndex = 0;
  } else {
    if (currentSnake.alive) {
      let currentMove = bestSnake.movements[moveIndex];
      game.moveSnake(currentSnake, currentMove.direction, currentMove.food);
      game.draw(currentSnake, currentMove.food);
      moveIndex++;
    } else {
      bestSnake = false;
    }
  }
}

/**
 * @desc Configura el estilo del texto del canvas que muestra la informacion al
 * usuario.
 */
function outputSetup() {
  outputBuffer.textSize(32);
  outputBuffer.fill(255, 255, 255);
}

/**
 * @desc Muestra en el canvas datos como la generacion actual y la maxima
 * puntuacion obtenida. Ademas, imprime la informacion que le corresponde
 * a cada input de la interfaz.
 */
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

/**
 * @desc Accede a la informacion introducida por el usuario en el input del
 * tamaño de la poblacion, comprobando que sea valida (mayor que 0). Si lo es,
 * sustituye el valor del parametro, y si no, muestra un aviso y mantiene el
 * valor por defecto.
 */
function populationInput() {
  let value = parseInt(this.value());
  if (!value || value <= 0) {
    alert('El tamaño de la población tiene que ser un número positivo mayor que 0.');
  } else {
    populationValue = value;
  }
}

/**
 * @desc Accede a la informacion introducida por el usuario en el input de la
 * probabilidad de mutacion, comprobando que sea valida (entre 0.0 y 1.0). Si
 * lo es, sustituye el valor del parametro, y si no, muestra un aviso y
 * mantiene el valor por defecto.
 */
function mutationInput() {
  let value = parseFloat(this.value());
  if (!value || value <= 0.0 || value > 1.0) {
    alert('La probabilidad de mutacion es entre 0 y 1.');
  } else {
    pressureValue = value;
  }
}

/**
 * @desc Accede a la informacion introducida por el usuario en el input de la
 * presion selectiva, comprobando que sea valida. Si lo es, sustituye el
 * valor del parametro, y si no, muestra un aviso y mantiene el valor por
 * defecto.
 */
function pressureInput() {
  let value = parseFloat(this.value());
  if (!value || value <= 0.0 || value > 2.0) {
    alert('La presión selectiva es entre 0 y 2.');
  } else {
    pressureValue = value;
  }
}

/**
 * @desc Accede a la informacion introducida por el usuario en el input de la
 * proporcion de la poblacion que se va a convertir en padres, comprobando que
 * sea valida (entre 0.0 y 1.0). Si lo es, sustituye el valor del parametro,
 * y si no, muestra un aviso y mantiene el valor por defecto.
 */
function parentsInput() {
  let value = parseFloat(this.value());
  if (!value || value <= 0.0 || value > 1.0) {
    alert('El indice de seleccion de padres va entre 0 y 1.');
  } else {
    parentsValue = value;
  }
}
