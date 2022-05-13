var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var ball = {
    x: 20,
    y: 150,
    dx: 4,
    dy: 2,
    radius: 10,
    color: "#003319"
};

var paddle = {
    width: 120,
    height: 10,
    x: 0,
    y: canvas.height - 10,
    speed: 10,
    color: "#CD5C5C",
    isMovingLeft: false,
    isMovingRight: false,
};

var BrickConfig = {
    offsetX: 25,
    offsetY: 25,
    margin: 15,
    width: 60,
    height: 15,
    totalRow: 3,
    totalCol: 6,
    color: "#DAF7A6",
};

var isGameOver = false;
var isGameWin = false;
var userScore = 0;
var maxScore = BrickConfig.totalRow * BrickConfig.totalCol;


var BrickArray = [];

for (var i = 0; i < BrickConfig.totalRow; i++) {
    for (var j = 0; j < BrickConfig.totalCol; j++) {
        BrickArray.push({
            x: BrickConfig.offsetX + j * (BrickConfig.width + BrickConfig.margin),
            y: BrickConfig.offsetY + i * (BrickConfig.height + BrickConfig.margin),
            isBroken: false
        });
    }
}

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = paddle.color;
    context.fill();
    context.closePath();
}

function drawBricks() {
    BrickArray.forEach(function (b) {
        if (!b.isBroken) {
            context.beginPath();
            context.rect(b.x, b.y, BrickConfig.width, BrickConfig.height);
            context.fillStyle = BrickConfig.color;
            context.fill();
            context.closePath();
        }
    });
}
function handleBallCollisionFrame() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

function handleBallCollidePaddle() {
    if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height) {
        ball.dy = -ball.dy;
    }
}

function handleBallCollideBrick() {
    BrickArray.forEach(function (b) {
        if (!b.isBroken) {
            if (ball.x >= b.x && ball.x <= b.x + BrickConfig.width && ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + BrickConfig.height) {
                ball.dy = -ball.dy;
                b.isBroken = true;
                userScore += 1;
                if (userScore >= maxScore) {
                    isGameOver = true;
                    isGameWin = true;
                }
            }
        }
    });
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePaddlePosition() {
    if (paddle.isMovingLeft) {
        paddle.x -= paddle.speed;
    } else if (paddle.isMovingRight) {
        paddle.x += paddle.speed;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}
function checkGameOver() {
    if (ball.y > canvas.height - ball.radius) {
        isGameOver = true;
    }
}

function showGameOver() {
    if (isGameWin) {
        alert('YOU WON. CONGRATULATION!');
    } else {
        alert('YOU LOSE. TRY AGAIN!');
    }
}
function draw() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();

        handleBallCollisionFrame();
        handleBallCollidePaddle();
        handleBallCollideBrick();

        updateBallPosition();
        updatePaddlePosition();

        checkGameOver();

        requestAnimationFrame(draw);
    } else {
        showGameOver();
    }
}

document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = false;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight = false;
    }
});

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = true;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight = true;
    }
});

draw();
