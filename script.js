/* eslint-disable no-alert */
// Variable Declarations
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 20;
const paddle = {
  width: 100,
  height: 10,
  color: 'black',
};
let paddleX = (canvas.width - paddle.width) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 5;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
// let level = 1;
let lives = 1000;
const ball = {
  color: '#0095DD',
};

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickColumnCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
// function to pick random colors
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Draw Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddle.height, paddle.width, paddle.height);
  ctx.fillStyle = paddle.color;
  ctx.fill();
  ctx.closePath();
}

// Draw Bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        switch (r) {
          case 0:
            ctx.fillStyle = 'yellow';
            break;
          case 1:
            ctx.fillStyle = 'red';
            break;
          case 2:
            ctx.fillStyle = 'blue';
            break;
          case 3:
            ctx.fillStyle = 'green';
            break;
          default:
            ctx.fillStyle = 'white';
            break;
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// draw Score Board
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// function drawLevel() {
//   ctx.font = '16px Arial';
//   ctx.fillStyle = '#0095DD';
//   ctx.fillText(`Level: ${level}`, 200, 20);
// }

// Game Logic
function gameLogic() {
  x += dx;
  y += dy;
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddle.width) {
      dy = -dy - 1;
      paddle.width -= 3;
      paddle.color = randomColor();
    } else {
      lives -= 1;
      if (!lives) {
        alert('Game Over!');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddle.width) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddle.width) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  x += dx;
  y += dy;
}

// draw Lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillstyle = '#0095DD';
  ctx.fill();
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// Collision Detection with Bricks & Ball
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          // eslint-disable-next-line no-console
          ball.color = randomColor();
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert('Congratulations, You Win!');
            document.location.reload();
          }
        }
      }
    }
  }
}
// draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  drawScore();
  drawLives();
  //   drawLevel();
  collisionDetection();
  gameLogic();
  requestAnimationFrame(draw);
}


// These control the event handlers for keyboard presses left + right
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Mouse Movement Event Listener
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddle.width / 2;
  }
}
document.addEventListener('mousemove', mouseMoveHandler, false);

draw();
