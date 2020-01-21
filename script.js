// Variable Declarations
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
let paddleWidth = 75;
let paddleHeight = 10;
let paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(var r= 0; r < brickColumnCount; r++){
        bricks[c][r] = {x:0, y:0, status: 1};
    }
};

// draw Ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
};

// Draw Paddle
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
};

// Draw Bricks
function drawBricks(){
    for(var c = 0; c < brickColumnCount; c++){
        for (var r= 0; r< brickRowCount; r++){
            if(bricks[c][r].status == 1){
            var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

// draw Score Board
function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
};

// draw Lives
function drawLives(){
    ctx.font = '16px Arial';
    ctx.fillstyle = '#0095DD';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// draw function with interval timer of 10 seconds
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawLives();
    drawScore();
    collisionDetection();
    x += dx;
    y += dy;
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx
    }
    if (y + dy < ballRadius){
        dy = -dy
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy
        } else {
            lives--;
            if(!lives){
                alert('Game Over!');
                document.location.reload();
            } else {
                x = canvas.width/2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

// Collision Detection with Bricks & Ball
function collisionDetection(){
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status == 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score ==brickRowCount * brickColumnCount){
                        alert('Congratulations, You Win!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// These control the event handlers for keyboard presses left + right
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Mouse Movement Event Listener
document.addEventListener('mousemove', mouseMoveHandler, false);
function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2
    }
};

draw();


