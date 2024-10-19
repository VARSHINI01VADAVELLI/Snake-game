let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");  
// draw on the screen to get the context, ask canvas  to get the 2d context

// snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// speed of the game
let speed = 7;
// size and count of a tile 
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
// head of the snake
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
// apple size
let appleX = 5;
let appleY = 5;
// movement
let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let gulpSound = new Audio("gulp.mp3");

//game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  if (score > 2) {
    speed = 9;
  }
  if (score > 4) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    if (gameOver) {
      ctx.fillStyle = "white";
      ctx.font = "50px Verdana";

      var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop("0", " magenta");
      gradient.addColorStop("0.5", "blue");
      gradient.addColorStop("1.0", "red");
      // Fill with gradient
      ctx.fillStyle = gradient;

      ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;

}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

/*document.body.addEventListener("keydown", keyDown);*/



drawGame();
function touchlisteners(){
  // Variables to track touch or mouse position
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

// Detect whether the device is touch-capable
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Add listeners for touch or mouse events
if (isTouchDevice) {
    document.addEventListener('touchstart', handleStart, false);
    document.addEventListener('touchmove', handleMove, false);
    document.addEventListener('touchend', handleEnd, false);
} else {
    document.addEventListener('mousedown', handleStart, false);
    document.addEventListener('mousemove', handleMove, false);
    document.addEventListener('mouseup', handleEnd, false);
}

// Function to handle touch/mouse start
function handleStart(event) {
    if (event.type === 'touchstart') {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    } else {
        startX = event.clientX;
        startY = event.clientY;
    }
}

// Function to handle touch/mouse move
function handleMove(event) {
    if (event.type === 'touchmove') {
        const touch = event.touches[0];
        endX = touch.clientX;
        endY = touch.clientY;
    } else {
        endX = event.clientX;
        endY = event.clientY;
    }
}

// Function to handle touch/mouse end
function handleEnd() {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            // Swipe right
            moveSnake('right');
        } else {
            // Swipe left
            moveSnake('left');
        }
    } else {
        if (deltaY > 0) {
            // Swipe down
            moveSnake('down');
        } else {
            // Swipe up
            moveSnake('up');
        }
    }
}

// Function to move the snake based on direction
/*function moveSnake(direction) {
    console.log(`Moving ${direction}`);
    // Add your snake movement logic here
}*/
// Function to move the snake based on direction (update velocity, not console)
function moveSnake(direction) {
  // Check the current direction and prevent illegal moves (180° turns)
  switch (direction) {
      case 'up':
          if (yVelocity == 1) return; // Prevent moving down if currently moving up
          inputsYVelocity = -1;
          inputsXVelocity = 0;
          break;
      case 'down':
          if (yVelocity == -1) return; // Prevent moving up if currently moving down
          inputsYVelocity = 1;
          inputsXVelocity = 0;
          break;
      case 'left':
          if (xVelocity == 1) return; // Prevent moving right if currently moving left
          inputsYVelocity = 0;
          inputsXVelocity = -1;
          break;
      case 'right':
          if (xVelocity == -1) return; // Prevent moving left if currently moving right
          inputsYVelocity = 0;
          inputsXVelocity = 1;
          break;
  }
}



}
touchlisteners();