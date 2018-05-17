/** Snake game */


const NROWS = 10;         // number of rows
const NCOLS = 15;         // number of columns
const NPELLETS = 5;       // number of growth pellets on board
const DELAY_SECS = 0.75;  // auto-move delay

let gameOver = false;

// coordinates (y-x) of snake, from head-to-tail (starts at top left)
let snake = ["0-2", "0-1", "0-0"]

// coordinates of pellets (order doesn't matter, so a set, not an array)
let pellets = new Set;

// direction snake is heading (UP/DOWN/LEFT/RIGHT)
let direction = "RIGHT";

// id of current auto-move timer (needed to cancel the timer)
let timerId;


/** sets style of (y-x) cell (styles are "snake" or "pellet") */

function setCellStyle(style, cell) {
  document.getElementById(cell).className = style
}


/* ************************* MAIN GAME FUNCTIONS *************************** */

/** endGame: do end-of-game announcement & cleanup */

function endGame(msg) {
  gameOver = true;
  clearAutoMoveTimer()
  document.removeEventListener("keydown", readKey);
  alert(msg)
}

/** moveSnake: move snake in direction
 * 
 * - detects crashes against wall/snake
 * - handles eating pellet (grows snake & adds replacement)
 * - updates snake cells on board
 */

function moveSnake(direction) {
  // get y, x coordinates of head cell
  let [y, x] = snake[0].split("-").map(Number)

  // get y.x of new head from the direction
  if (direction === "UP") y -= 1
  else if (direction === "DOWN") y += 1
  else if (direction === "LEFT") x -= 1
  else if (direction === "RIGHT") x += 1

  // check for crash into wall
  if (x < 0 || x >= NCOLS || y < 0 || y >= NROWS) {
    return endGame("Game over: crashed into wall")
  }

  // draw the new head
  let newHead = y + "-" + x
  setCellStyle("snake", newHead)

  // if new head collides with snake, end game
  if (snake.includes(newHead)) {
    return endGame("Game over: crashed into self")
  }

  // add new head to start of snake
  snake.unshift(newHead)

  // handle eating/not eating a pellet
  if (pellets.delete(newHead)) {
    // ate pellet: don't delete tail (snake grows), replace pellet
    addPellet();
  } else {
    // didn't eat pellet: pop off tail & remove style from table cell
    setCellStyle(null, snake.pop())
  }
}

/** addPellet: add pellet to board */

function addPellet() {
  // loop until finds random point not in snake or a current pellet
  while (true) {
    const x = Math.floor(Math.random() * NCOLS);
    const y = Math.floor(Math.random() * NROWS);
    pt = y + "-" + x

    if (!pellets.has(pt) && !snake.includes(pt)) {
      pellets.add(pt)
      setCellStyle("pellet", pt)
      return;
    }
  }
}

/** readKey: called when the user presses key (enters a move)
 * 
 * - reset auto-move timer
 * - determine new direction from arrow-key entered (don't allow U-turns)
 * - move snake
 */

function readKey(evt) {
  // since the user entered a move, reset the auto-move timer
  clearAutoMoveTimer()
  setAutoMoveTimer()

  const key = evt.code;

  // determine new direction: the snake can't U-turn into itself,
  // so attempts to do so (ex: can't go right if currently going left)
  if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT"
  else if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT"
  else if (key === "ArrowUp" && direction !== "DOWN") direction = "UP"
  else if (key === "ArrowDown" && direction !== "UP") direction = "DOWN"
  else return;

  evt.preventDefault();
  moveSnake(direction)
}


/* *************************** AUTO-MOVE TIMER ***************************** */

/** makeAutoMove: called auto-move timer: move in current direction */

function makeAutoMove(t) {
  moveSnake(direction);
  setAutoMoveTimer()
}

/** setAutoMoveTimer: set auto-move timer */

function setAutoMoveTimer() {
  if (!gameOver) {
    timerId = window.setTimeout(makeAutoMove, DELAY_SECS * 1000)
  }
}

/** clearAutoMoveTimer: clear auto-move timer */

function clearAutoMoveTimer() {
  window.clearTimeout(timerId)
}


/* ***************************** GAME SETUP ******************************** */

/** createBoard: creates board, giving each cell a unique id of "r-c" */

function createBoard() {
  const board = document.getElementById("board")

  for (let y = 0; y < NROWS; y++) {
    const row = document.createElement("tr")
    for (let x = 0; x < NCOLS; x++) {
      const cell = document.createElement("td")
      cell.id = y + "-" + x
      row.appendChild(cell)
    }
    board.appendChild(row)
  }
}

/** setup: setup and start the game */

function setup() {
  createBoard();

  // draw initial snake
  for (pt of snake) {
    setCellStyle("snake", pt)
  }

  // add initial pellets to board
  for (let i = 0; i < NPELLETS; i++) {
    addPellet();
  }

  // start game: listen for key-moves, and start timer for auto-moves
  document.addEventListener("keydown", readKey);
  setAutoMoveTimer()
}

setup()