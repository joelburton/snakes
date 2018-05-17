/** Snake game */


const NROWS = 10;         // number of rows
const NCOLS = 10;         // number of columns
const NPELLETS = 5;       // number of growth pellets on board
const DELAY_SECS = 0.75;  // auto-move delay

let gameOver = false;

// coordinates (y-x) of snake, from head-to-tail
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



function endGame(msg) {
  gameOver = true;
  clearTimer()
  document.removeEventListener("keydown", readKey);
  alert(msg)
}

function moveSnake(direction) {
  let head = snake[0].split("-")
  let y = +head[0]
  let x = +head[1]

  // get y.x of new head from the direction
  if (direction === "UP") y -= 1
  else if (direction === "DOWN") y += 1
  else if (direction === "LEFT") x -= 1
  else if (direction === "RIGHT") x += 1

  // check for crash into wall
  if (x < 0 || x === NCOLS || y < 0 || y === NROWS) {
    return endGame("crashed into wall")
  }

  // draw the new head
  let newHead = y + "-" + x
  setCellStyle("snake", newHead)

  // if new head collides with snake, end game
  if (snake.includes(newHead)) {
    return endGame(`crashed into self!`)
  }

  // add new head to snake
  snake.unshift(newHead)

  // handle eating/not eating a pellet
  if (pellets.delete(newHead)) {
    // ate pellet, so don't delete tail (snake grows), replace pellet
    addPellet();
  } else {
    // didn't eat pellet, so pop off tail and remove style from table cell
    setCellStyle("", snake.pop())
  }
}

/** addPellet: add pellet to board */

function addPellet() {
  // loop until we find random location that isn't part of snake
  // or already a pellet
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

/** readKey: called when the user enters a move */

function readKey(evt) {
  // since the user entered a move, reset the auto-move timer
  clearTimer()
  setTimer()

  // determine new direction: the snake can't U-turn into itself,
  // so attempts to do so (ex: can't go right if currently going left)
  if (evt.code === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT"
  if (evt.code === "ArrowRight" && direction !== "LEFT") direction = "RIGHT"
  if (evt.code === "ArrowUp" && direction !== "DOWN") direction = "UP"
  if (evt.code === "ArrowDown" && direction !== "UP") direction = "DOWN"

  moveSnake(direction)
}

/** hitTimer: called when auto-move timer expires: move in current direction */

function hitTimer(t) {
  if (!gameOver) {
    moveSnake(direction);
    setTimer()
  }
}

/** setTimer: set auto-move timer */

function setTimer() {
  timerId = window.setTimeout(hitTimer, DELAY_SECS * 1000)
}

/** clearTimer: clear auto-move timer */

function clearTimer() {
  window.clearTimeout(timerId)
}

/** setup: setup and start the game */

function setup() {
  createBoard();

  // draw initial snake
  for (pt of snake) {
    setCellStyle("snake", pt)
  }

  for (let i = 0; i < NPELLETS; i++) {
    addPellet();
  }

  document.addEventListener("keydown", readKey);
  setTimer()
}

setup()