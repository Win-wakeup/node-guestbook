    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const buttonStart = document.getElementById("buttonStart");
    const BLOCK_SIZE = 20;
    const MAP_SIZE = canvas.width / BLOCK_SIZE;
    playerKey1 = [38, 40, 37, 39]; // 上下左右
    playerKey2 = [87, 83, 65, 68]; // WSAD

    let snake1, snake2, apple;
    let gameInterval, appleInterval;

    // 🎮 畫面更新
    function drawGame() {
        drawMap();
        apple.drawApple();
        snake1.drawSnake();
        snake2.drawSnake();
        drawScore();
    }

    // 🎨 黑底
    function drawMap() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "20px Verdana";
        ctx.fillText("Score1: " + snake1.score, 20, 25);
        ctx.fillText("Score2: " + snake2.score, 20, 50);
    }

    // 🚨 結束
    function gameOver() {
        clearInterval(gameInterval);
        clearInterval(appleInterval);

        ctx.fillStyle = "red";
        ctx.font = "40px Verdana";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }

    // 🐍 蛇類別
    class Snake {
        constructor(startX, startY, color, keys) {
            this.body = [{ x: startX, y: startY }];
            this.size = 5;
            this.score = 0;
            this.color = color;
            this.direction = { x: 0, y: -1 };
            this.playerKey = keys;
        }

        drawSnake() {
            this.moveSnake();
            ctx.fillStyle = this.color;
            for (let b of this.body) {
                ctx.fillRect(b.x * BLOCK_SIZE, b.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
            this.eatApple();
        }

        moveSnake() {
            const newBlock = {
                x: this.body[0].x + this.direction.x,
                y: this.body[0].y + this.direction.y
            };
            this.body.unshift(newBlock);
            while (this.body.length > this.size) this.body.pop();
            this.checkDeath();
        }

        eatApple() {
            for (let i = 0; i < apple.apples.length; i++) {
                if (this.body[0].x === apple.apples[i].x && this.body[0].y === apple.apples[i].y) {
                    apple.apples.splice(i, 1);
                    this.size++;
                    this.score++;
                }
            }
        }

        checkDeath() {
            if (
                this.body[0].x < 0 ||
                this.body[0].x >= MAP_SIZE ||
                this.body[0].y < 0 ||
                this.body[0].y >= MAP_SIZE
            ) {
                this.score -= 10;
                gameOver();
            }

            for (let i = 1; i < this.body.length; i++) {
                if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                    this.score -= 10;
                    gameOver();
                }
            }
        }

        move(event) {
            if (event.keyCode === this.playerKey[0] && this.direction.y !== 1) this.direction = { x: 0, y: -1 };
            else if (event.keyCode === this.playerKey[1] && this.direction.y !== -1) this.direction = { x: 0, y: 1 };
            else if (event.keyCode === this.playerKey[2] && this.direction.x !== 1) this.direction = { x: -1, y: 0 };
            else if (event.keyCode === this.playerKey[3] && this.direction.x !== -1) this.direction = { x: 1, y: 0 };
        }
    }

    // 🍎 蘋果類別
    class Apple {
        constructor() {
            this.apples = [];
            this.putApple();
        }

        drawApple() {
            ctx.fillStyle = "red";
            for (let a of this.apples) {
                ctx.fillRect(a.x * BLOCK_SIZE, a.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }

        putApple() {
            let x = Math.floor(Math.random() * MAP_SIZE);
            let y = Math.floor(Math.random() * MAP_SIZE);
            this.apples.push({ x, y });
        }
    }

    // 🕹 開始遊戲
    function gameStart() {
        if (gameInterval) clearInterval(gameInterval);
        if (appleInterval) clearInterval(appleInterval);

        snake1 = new Snake(MAP_SIZE / 2, MAP_SIZE / 2, "lime", playerKey1);
        snake2 = new Snake(MAP_SIZE / 4, MAP_SIZE / 2, "yellow", playerKey2);
        apple = new Apple();

        gameInterval = setInterval(drawGame, 100);
        appleInterval = setInterval(() => apple.putApple(), 3000);
    }

    // 🎮 鍵盤事件
    document.addEventListener("keydown", e => {
        if (snake1 && snake2) {
            snake1.move(e);
            snake2.move(e);
        }
    });

    buttonStart.addEventListener("click", gameStart);

    // 顯示初始畫面
    drawMap();
    ctx.fillStyle = "white";
    ctx.font = "20px Verdana";
    ctx.fillText("Press Start to Begin", 100, 200);
