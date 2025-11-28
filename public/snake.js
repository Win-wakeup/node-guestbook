const canvas = document.getElementById("canvas");
const startButton = document.getElementById("buttonStart");
const ctx = canvas.getContext("2d");

const BLOCK_SIZE = 20;
const MAP_SIZE = canvas.width / BLOCK_SIZE;
let score = 0;
let gameInterval = null;
let gameSpeed = 150; // 初始速度 (毫秒)
let isPaused = false;
let isGameOver = false;

//========================= 畫面繪製 =========================//
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "14px Verdana";
    ctx.fillText("Score: " + score, canvas.width - 90, 20);
}

function drawMap() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "40px Verdana";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
}

function drawPause() {
    ctx.fillStyle = "red";
    ctx.font = "40px Verdana";
    ctx.fillText("GAME PAUSE", canvas.width / 2 - 120, canvas.height / 2);
}
//========================= 遊戲物件 =========================//
let snake = { 
    body: [ { x: MAP_SIZE / 2, y: MAP_SIZE / 2 } ],  
    size: 5, 
    direction: { x: 0, y: -1 },

    drawSnake: function () {
        this.moveSnake();
        ctx.fillStyle = "lime";
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(
                this.body[i].x * BLOCK_SIZE,
                this.body[i].y * BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE
            );
        }
    },

    moveSnake: function () {
        const newBlock = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };
        this.body.unshift(newBlock);
        while (this.body.length > this.size) this.body.pop();
    }
};

let apple = { 
    x: 5,
    y: 5,
    drawApple: function () {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    },
    putApple: function () {
        // 隨機放置蘋果，確保不與蛇重疊
        do {
            this.x = Math.floor(Math.random() * MAP_SIZE);
            this.y = Math.floor(Math.random() * MAP_SIZE);
        } while (snake.body.some(part => part.x === this.x && part.y === this.y));
    }
};

//========================= 遊戲邏輯 =========================//
function eatApple() {
    if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
        snake.size += 1;
        score++;
        apple.putApple();

        // 🎯 每 5 分加速一次
        if (score % 5 === 0 && gameSpeed > 10) {
            gameSpeed -= 10;
            restartGameLoop();
        }
    }
}

function checkDeath() {
    // 撞牆
    if (
        snake.body[0].x < 0 || 
        snake.body[0].x >= MAP_SIZE ||
        snake.body[0].y < 0 || 
        snake.body[0].y >= MAP_SIZE
    ) {
        return gameOver();
    }
    // 撞自己
    for (let i = 1; i < snake.body.length; i++) {
        if (
            snake.body[0].x === snake.body[i].x &&
            snake.body[0].y === snake.body[i].y
        ) {
            return gameOver();
        }
    }
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    drawGameOver();
    startButton.value = "Restart";
}

function restartGameLoop() {
    clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, gameSpeed);
}

//========================= 控制 =========================//
function keyDown(event) {
    if (isGameOver) return; // 遊戲結束後不接受方向鍵

    const key = event.keyCode;
    if (key === 38 || key === 87) { // up / W
        if (snake.direction.y === 1) return;
        snake.direction = { x: 0, y: -1 };
    } else if (key === 40 || key === 83) { // down / S
        if (snake.direction.y === -1) return;
        snake.direction = { x: 0, y: 1 };
    } else if (key === 37 || key === 65) { // left / A
        if (snake.direction.x === 1) return;
        snake.direction = { x: -1, y: 0 };
    } else if (key === 39 || key === 68) { // right / D
        if (snake.direction.x === -1) return;
        snake.direction = { x: 1, y: 0 };
    } 
    else if (key === 80) { // P 鍵 暫停 / 繼續
        togglePause();
    }
}

document.addEventListener("keydown", keyDown);

function togglePause() {
    if (isPaused) {
        isPaused = false;
        restartGameLoop();
    } else {
        isPaused = true;
        clearInterval(gameInterval);
        drawPause();
    }
}

//========================= 繪製主迴圈 =========================//
function drawGame() {
    drawMap();
    apple.drawApple();
    snake.drawSnake();
    eatApple();
    drawScore();
    checkDeath();
}

//========================= 遊戲開始 / 重新開始 =========================//
function resetGame() {
    score = 0;
    gameSpeed = 100;
    isGameOver = false;
    snake = { 
        body: [ { x: MAP_SIZE / 2, y: MAP_SIZE / 2 } ],
        size: 5,
        direction: { x: 0, y: -1 },
        drawSnake: snake.drawSnake,
        moveSnake: snake.moveSnake
    };
    apple.putApple();
    drawMap();
    drawScore();
}

function gameStart() {
    resetGame();
    restartGameLoop();
}

startButton.addEventListener("click", function() {
    gameStart();
});
