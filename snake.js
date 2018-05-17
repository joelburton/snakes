const NROWS = 10;
const NCOLS = 10;

const snake = [{ y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }]
const pellets = []

let snakeDirection = "LEFT"
let timerId;

/** createBoard: creates board, giving each cell a unique id of "r__c__" */

function getIdForYX(y, x) {
  return `r${y}c${x}`;
}

function createBoard() {
  const board = document.getElementById("board")

  for (let y = 0; y < NROWS; y++) {
    const row = document.createElement("tr")
    for (let x = 0; x < NCOLS; x++) {
      const cell = document.createElement("td")
      cell.id = getIdForYX(y, x)
      row.appendChild(cell)
    }
    board.appendChild(row)
  }
}

function drawSnake(color) {
  console.log(snake);
  for ({ y, x } of snake) {
    const id = getIdForYX(y, x)
    const cell = document.getElementById(id)
    cell.style.backgroundColor = color;
  }
}

function moveSnake(direction) {
  // get location of head of snake
  let { y, x } = snake[0]
  console.log(`old x=${x} y=${y}`)
  console.log(snake);

  switch (direction) {
    case "UP":
      y -= 1;
      break;
    case "DOWN":
      y += 1;
      break;
    case "LEFT":
      x -= 1;
      break;
    case "RIGHT":
      x += 1;
      break;
  }

  // check that we won't crash in self/wall
  if (x < 0 || x === NCOLS || y < 0 || y === NROWS) {
    throw new Error("crashed into wall")
  }

  for (cell of snake) {
    if (y === cell.y && x === cell.x) {
      throw new Error(`crashed into self x=${x} y=${y} currX=${cell.x} currY=${cell.y}`)
    }
  }

  console.log(`new x=${x} y=${y}`)

  // add new head
  snake.unshift({ y, x })

  // if we didn't just eat a pellet, remove tail
  const matchPelletId = pellets.findIndex(p => (p.y === y) && (p.x === x))
  if (matchPelletId === -1) {
    snake.pop()
  } else {
    pellets.splice(matchPelletId, 1)
    addPellet();
  }
}

function addPellet() {
  while (true) {
    const x = Math.floor(Math.random() * NCOLS);
    const y = Math.floor(Math.random() * NROWS);
    const existingPelletAtLocation = pellets.find(p => (p.y === y) && (p.x === x))
    const existingSnakeCellAtLocation = snake.find(c => (c.y === y) && (c.x === x))

    if (!existingPelletAtLocation && !existingPelletAtLocation) {
      pellets.push({ y, x })
      id = getIdForYX(y, x)
      document.getElementById(id).style.backgroundColor = "yellow";
      return;
    }
  }
}

function readKey(evt) {
  window.clearTimeout(timerId)
  timerId = window.setTimeout(hitTimer, 1000)

  console.log("evt.code=", evt.code)
  if (evt.code === "ArrowLeft" && snakeDirection !== "RIGHT") snakeDirection = "LEFT"
  if (evt.code === "ArrowRight" && snakeDirection !== "LEFT") snakeDirection = "RIGHT"
  if (evt.code === "ArrowUp" && snakeDirection !== "DOWN") snakeDirection = "UP"
  if (evt.code === "ArrowDown" && snakeDirection !== "UP") snakeDirection = "DOWN"

  console.log("direction=", snakeDirection, Math.random())
  drawSnake("white")
  moveSnake(snakeDirection)
  drawSnake("red")
}

function hitTimer() {
  drawSnake("white")
  moveSnake(snakeDirection);
  drawSnake("red")

  timerId = window.setTimeout(hitTimer, 1000)
}



createBoard();

for (let i = 0; i < 5; i++) {
  addPellet();
}


drawSnake("red");

document.addEventListener("keydown", readKey);