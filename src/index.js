/* eslint-disable no-alert */
// Variable Declarations
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
accel = 5
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 1000;

// Sprite Super-Class Object
class Sprite {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

// Ball Object
class Ball extends Sprite {
  constructor(x, y, dx, dy, radius, color) {
    super(x, y)
    console.log(this.y)
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  };
  move() {
    this.x += this.dx
    this.y += this.dy
  }

  render(ctx) {
    // console.log(this.x, this.y, this.radius)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}
// const ball = new Ball(canvas.width / 2, canvas.height - 2, 2, -2, 15, "#0095DD")

// Brick + Bricks Object
class Brick {
  constructor(x,y, height, width, color = 'black') {
    this.x = x;
    this.y = y;
    this.width = width; 
    this.height = height;
    this.color = randomColor();
    this.status = 1;
  }
  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y, this.width, this.height)
    // ctx.fillRect(100,100, 50, 50)
  }
  collide(game) {
    const ball = game.ball
    if (ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y && ball.y < this.y + this.height) {
      this.status = 0;
      ball.dy *= -1
      game.score += game.scoreMultiplier
    }
  }
}
class Bricks {
  constructor(row = 5, column = 5) {
    this.rowCount = row;
    this.columnCount = column;
    this.brickWidth = 120; 
    // canvas.width - (2 * offsetLeft) - (columns - 1) * padding
    // (700 - 100) / 5
    this.brickHeight = 20; 
    this.brickPadding = 10;
    this.offsetLeft = 30; // space on either side
    this.brickOffsetTop = 60;
    this.bricksArray = [];
    this.setup()
  }
  setup() {
    for (let c = 0; c < this.columnCount; c += 1) {
      this.bricksArray[c] = [];
      for (let r = 0; r < this.columnCount; r += 1) {
        this.bricksArray[c][r] = new Brick(this.offsetLeft + (this.brickWidth + this.brickPadding) * r, this.brickOffsetTop + (this.brickHeight + this.brickPadding) * c,this.brickHeight, this.brickWidth);
      }
    }
  }
  render(ctx) {
    for (let c = 0; c < this.columnCount; c += 1) {
      for (let r = 0; r < this.rowCount; r += 1) {
        if (this.bricksArray[c][r].status === 1) {
          this.bricksArray[c][r].render(ctx)
      }
    }
    }
  }
}


// Paddle Object
class Paddle extends Sprite {
  constructor(x, y, width = 100, height = 8) {
    super(x, y);
    this.paddleWidth = width;
    this.paddleHeight = height;
    this.paddleSpeed = 7;
  
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
  }
}

// Game Class
class Game {
  constructor(ballRadius, brickRowCount = 5, brickColumnCount = 5, ballColor = "white", paddleWidth = 75, paddleHeight = 10) {
    this.lives = 1000;
    this.score = 0;
    this.scoreMultiplier = 10
    this.gameRunning = true;
    this.bricks = new Bricks(brickRowCount, brickColumnCount);
    this.paddle = new Paddle(canvas.width / 2, canvas.height - 50, paddleWidth, paddleHeight);
    this.ball = new Ball(canvas.width / 2, canvas.height - this.paddle.paddleHeight - 10, 2, 2,ballRadius, ballColor);
  }

  drawScore(ctx){
    ctx.font = '20px Impact';
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${game.score}`, 8, 30);
  }

  drawLives(ctx) {
    ctx.font = '20px Impact';
    ctx.fillStyle = "black";
    console.log(ctx.fillStyle)
    ctx.fill();
    ctx.fillText(`Lives: ${game.lives}`, canvas.width - 95, 30);
  }

  gameItems(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.bricks.render(ctx);
    this.paddle.render(ctx);
    this.ball.render(ctx);
    this.drawLives(ctx);
    this.drawScore(ctx);
  }

  movePaddle(ctx) {
    this.gameItems(ctx);
    if (rightPressed && this.paddle.x < canvas.width - this.paddle.paddleWidth) {
      this.paddle.x += 7;
    } else if (leftPressed && this.paddle.x > 0) {
      this.paddle.x -= 7;
    }
    this.ball.render(ctx);

    if(this.gameRunning){
      return
    }
    requestAnimationFrame(() => {
      this.movePaddle(ctx);
    });
  }
}
const game = new Game(10)

// function to pick random colors
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}
function winner() {
  for (let c = 0; c < game.bricks.brickColumnCount; c += 1) {
    for (let r = 0; r < game.bricks.brickRowCount; r += 1) {
      if (game.bricks.bricksArray[c][r].status === 1) {
        return false
      }
    }
  }
  return true
}

// Collision Detection with Bricks & Ball
function collisionDetection() {
  for (let c = 0; c < game.bricks.columnCount; c += 1) {
    for (let r = 0; r < game.bricks.rowCount; r += 1) {
      const b = game.bricks.bricksArray[c][r];
      if (b.status === 1) {
        b.collide(game)
        if (game.score === this.columnCount * this.rowCount * game.scoreMultiplier) {
          alert('You suck. GG btw')
          document.location.reload()
        }
      }
    }
  }
}

// Game Logic
game.gameItems(ctx)

// draw function
function draw() {
  game.gameItems(ctx);
  collisionDetection();

  if(game.ball.x + game.ball.dx > canvas.width - game.ball.radius || game.ball.x < game.ball.radius ) {
    game.ball.dx = -(game.ball.dx); // This will hit the sides of canvas
  } 

  if (game.ball.y + game.ball.dy < game.ball.radius) {
    game.ball.dy = -(game.ball.dy);
  } else if (game.ball.y + game.ball.dy > canvas.height - game.ball.radius / 2){
    game.ball.dy = -(game.ball.dy);
    if(game.ball.x - game.ball.radius < game.paddle.x + game.paddle.paddleWidth && game.ball.x + game.ball.radius > game.paddle.x ) {
        
      } else {
        game.lives -= 1;
        if(!game.lives) {
          game.drawLives(ctx);
          alert('Game Over!');
          document.location.reload();
        } else {
          game.ball.x = canvas.width / 2;
          game.ball.y = canvas.height - 30;
          // game.ball.dx = accel;
          // game.ball.dy = -(accel);
          game.paddle.paddleX = (canvas.width - game.paddle.paddleWidth) / 2;
        }
      }
    }
  
    if (rightPressed && game.paddle.paddleX < canvas.width - game.paddle.paddleWidth) {
      game.paddle.x += game.paddle.paddleSpeed;
    } else if (leftPressed && game.paddle.x > 0) {
      game.paddle.x -= game.paddle.paddleSpeed;
    }
    game.ball.move();

    if(game.gameRunning) {
      requestAnimationFrame(draw)
    } else {
      game.ball.y = canvas.hieght - game.paddle.paddleHeight - game.ball.radius;
      game.movePaddle(ctx);
    }
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

// Mouse Movement Event Listener
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    game.paddle.x = relativeX - game.paddle.paddleWidth / 2;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

draw();
