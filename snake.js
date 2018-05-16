const NROWS = 10;
const NCOLS = 10;

const snake = [[1, 1], [1, 2], [1, 3]]
let snakeDirection = "LEFT"

/** createBoard: creates board, giving each cell a unique id of "r__c__" */

function createBoard() {
  const board = document.getElementById("board")

  for (let rowi = 0; rowi < NROWS; rowi++) {
    const row = document.createElement("tr")
    for (let coli = 0; coli < NCOLS; coli++) {
      const cell = document.createElement("td")
      cell.id = `r${rowi}c${coli}`
      row.appendChild(cell)
    }
    board.appendChild(row)
  }
}

function drawSnake(color) {
  for ([row, col] of snake) {
    const id = `r${row}c${col}`;
    const cell = document.getElementById(id)
    cell.style.backgroundColor = color;
  }
}

function moveSnake(direction) {
  // get location of head of snake
  let [y, x] = snake[0]
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

  for ([currY, currX] of snake) {
    if (y === currY && x === currX) {
      throw new Error(`crashed into self x=${x} y=${y} currX=${currX} currY=${currY}`)
    }
  }

  console.log(`new old x=${x} y=${y}`)

  // add new head & remove tail
  snake.unshift([y, x])
  snake.pop()
}

function readKey(evt) {
  console.log("evt.code=", evt.code)
  if (evt.code === "ArrowLeft" && snakeDirection !== "RIGHT") snakeDirection = "LEFT"
  if (evt.code === "ArrowRight" && snakeDirection !== "LEFT") snakeDirection = "RIGHT"
  if (evt.code === "ArrowUp" && snakeDirection !== "DOWN") snakeDirection = "UP"
  if (evt.code === "ArrowDown" && snakeDirection !== "UP") snakeDirection = "DOWN"

  console.log("direction=", snakeDirection)
  drawSnake("white")
  moveSnake(snakeDirection)
  drawSnake("red")
}

createBoard();
drawSnake("red");

document.addEventListener("keydown", readKey);