var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
// Устанавливаем размеры canvas равными размерам контейнера
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Начальные координаты игрока
var playerWidth = 30;
var playerHeight = 30; // Задаем высоту и ширину для изображения игрока
var playerX = canvas.width / 2 - playerWidth / 2;
var playerY = canvas.height - 35;
var playerSpeed = 8;

// Загружаем изображение игрока
var playerImage = new Image();
playerImage.src = 'img/candy.png';

// Загружаем изображение противника
var enemyImage = new Image();
enemyImage.src = 'img/candyred.png';

// Переменные для управления игроком
var rightPressed = false;
var leftPressed = false;

// Снаряды игрока
var bullets = [];
var bulletSpeed = 10;
var bulletWidth = 5;
var bulletHeight = 10;
var shootInterval = 200; // Интервал между выстрелами (мс)
var lastShootTime = 0;

// Противники
var enemies = [];
var enemyWidth = 30;
var enemyHeight = 30;
var enemySpeed = 2;
var enemySpawnInterval = 1500; // Интервал появления новых противников (мс)
var lastSpawnTime = 0;

// Счет убитых противников
var score = 0;

// Состояние игры
var isGameRunning = false;

// Обработчики нажатия клавиш
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Обработчики сенсорного ввода
canvas.addEventListener("touchstart", handleTouch, false);
canvas.addEventListener("touchmove", handleTouch, false);

function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Обработка сенсорного ввода
function handleTouch(event) {
    var touch = event.touches[0];
    var touchX = touch.clientX - canvas.getBoundingClientRect().left;
    playerX = touchX - playerWidth / 2;

    // Ограничение движения игрока по границам canvas
    if (playerX < 0) {
        playerX = 0;
    } else if (playerX + playerWidth > canvas.width) {
        playerX = canvas.width - playerWidth;
    }

    shoot(); // Вызываем стрельбу при каждом сенсорном вводе

    event.preventDefault();
}


// Обработка мышиного ввода
function handleMouse(event) {
    if (event.buttons !== 1) {
        return; // Выход, если не нажата левая кнопка мыши (ЛКМ)
    }

    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    playerX = mouseX - playerWidth / 2;

    // Ограничение движения игрока по границам canvas
    if (playerX < 0) {
        playerX = 0;
    } else if (playerX + playerWidth > canvas.width) {
        playerX = canvas.width - playerWidth;
    }

    shoot(); // Вызываем стрельбу при каждом клике мыши

    event.preventDefault();
}

// Обработчики событий для мыши
canvas.addEventListener("mousemove", handleMouse);
canvas.addEventListener("mousedown", handleMouse); // Обрабатываем только при нажатии ЛКМ




// Стрельба
function shoot() { 
    var currentTime = Date.now();
    if (currentTime - lastShootTime > shootInterval) {
        bullets.push({
            x: playerX + playerWidth / 2 - bulletWidth / 2,
            y: playerY,
            width: bulletWidth,
            height: bulletHeight
        });
        lastShootTime = currentTime;
    }
}

// Отрисовка игрока
function drawPlayer() {
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

// Отрисовка снарядов
function drawBullets() {
    bullets.forEach(function(bullet) {
        ctx.beginPath();
        ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    });
}

// Создание противников
function spawnEnemies() {
    var currentTime = Date.now();
    if (currentTime - lastSpawnTime > enemySpawnInterval) {
        lastSpawnTime = currentTime;
        var enemyX = Math.random() * (canvas.width - enemyWidth);
        enemies.push({
            x: enemyX,
            y: -enemyHeight,
            width: enemyWidth,
            height: enemyHeight
        });
    }
}

// Отрисовка противников
function drawEnemies() {
    enemies.forEach(function(enemy) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Обновление позиций снарядов
function updateBullets() {
    bullets.forEach(function(bullet, bulletIndex) {
        bullet.y -= bulletSpeed;

        // Удаление снарядов, вышедших за границы экрана
        if (bullet.y + bullet.height < 0) {
            bullets.splice(bulletIndex, 1);
        }

        // Проверка столкновений снарядов с противниками
        enemies.forEach(function(enemy, enemyIndex) {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                    // Удаление снаряда и противника при столкновении
                    bullets.splice(bulletIndex, 1);
                    enemies.splice(enemyIndex, 1);
                    score++; // Увеличиваем счет при уничтожении противника
                    updateScore(); // Обновляем отображение счета
                }
        });
    });
}

// Обновление позиций противников
function updateEnemies() {
    enemies.forEach(function(enemy, index) {
        enemy.y += enemySpeed;

        // Удаление противников, вышедших за границы экрана
        if (enemy.y > canvas.height) {
            gameOver(); // Проигрыш при достижении нижней границы экрана врагом
        }

        // Проверка столкновения противников с игроком
        if (playerX < enemy.x + enemy.width &&
            playerX + playerWidth > enemy.x &&
            playerY < enemy.y + enemy.height &&
            playerY + playerHeight > enemy.y) {
                gameOver(); // Проигрыш при столкновении с врагом
        }
    });
}

// Обновление отображения счета
function updateScore() {
    var scoreElement = document.getElementById("score");
    scoreElement.textContent = score;
}


// Основная функция отрисовки
function draw() {
    if (!isGameRunning) return; // Прекращаем выполнение, если игра остановлена

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawEnemies();

    // Обработка движения игрока
    if (rightPressed && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    } else if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }

    // Обработка стрельбы
    if (rightPressed || leftPressed) {
        shoot();
    }

    // Обновление позиций снарядов и противников
    updateBullets();
    updateEnemies();

    // Создание новых противников
    spawnEnemies();

    requestAnimationFrame(draw);
}

// Обработчик кнопки "Старт"
var startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// Обработчик кнопки "Начать заново"
var restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", restartGame);

function startGame() {
    // Скрываем кнопку "Старт"
    startButton.style.display = "none";
    // Скрываем сообщение о проигрыше, если оно отображается
    restartButton.style.display = "none";
    // Запускаем основной игровой цикл
    isGameRunning = true;
    draw();
}

function restartGame() {
    // Обнуляем счет
    score = 0;
    updateScore();
    // Сброс координат игрока
    playerX = canvas.width / 2 - playerWidth / 2;
    playerY = canvas.height - 35;
    // Очищаем массивы снарядов и противников
    bullets = [];
    enemies = [];
    // Запускаем игру заново
    startGame();
}

function gameOver() {
    // Останавливаем игру
    isGameRunning = false;
    // Отображаем сообщение о проигрыше
    document.getElementById("restartButton").style.display = "inline";
}



//обновление страницы
window.addEventListener('resize', function() {
    location.reload();
});