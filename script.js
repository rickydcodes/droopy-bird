const pipeSpeedIncrease = 0.12;
const generateSpeedIncrease = 20;
const minPipeHeight = 20;
const fallSpeed = 0.18;
const pipeWidth = 60;
const pipeHeadHeight = 40;
const borderWidth = 2;
const maxSpace = 150;
const minSpace = 100;
const renderSpeed = 20;
const pipeMoveSpeed = 4;
const generateSpeed = 2600;
const jumpHeight = 40;
const playerLeft = 150;
const playerSize = 50;
const playerCanvasMargin = 50;

let playingArea = document.querySelector("#playingArea");
let playerElement = document.querySelector("#playerElement");
let scoreParagraph = document.querySelector("#scoreParagraph");
let gameStateParagraph = document.querySelector("#gameStateParagraph");
let ctx = playingArea.getContext("2d");

let pipes = [];
let gameInterval;
let pipesInterval;
let playerVelocity = 0.8;
let playerY = 150;
let gameOver = true;
let score = 0;

document.addEventListener("keydown", keyHandler);

function keyHandler(e) {
  if (e.keyCode == 13) {
    startGame();
  } else if (e.keyCode == 32) {
    jump();
  }
}

function startGame() {
  if (gameOver) {
    pipes = [];
    playerVelocity = 0.8;
    playerY = 150;

    playerElement.style.left = `${playerLeft}px`;
    playerElement.style.display = "inline-block";
    gameStateParagraph.innerHTML = ``;
    gameOver = false;
    gameInterval = setInterval(loadCanvas, renderSpeed);
    pipesInterval = setTimeout(generatePipe, generateSpeed);


    let randomSpace = Math.floor(Math.random() * (maxSpace - minSpace)) + minSpace;
    let randomHeight = Math.floor(Math.random() * (playingArea.height - randomSpace - (3 * pipeHeadHeight)) - minPipeHeight) + minPipeHeight + 30;
    pipes.push({ pipeX: playingArea.width, pipe1Height: randomHeight, pipeSpace: randomSpace });
  }
}

function endGame() {
  gameOver = true;
  score = 0;
  gameStateParagraph.innerHTML = "Your bird died. Press enter to play";
  clearInterval(gameInterval);
  clearTimeout(pipesInterval);
}

function loadCanvas() {
  if (!gameOver) {
    ctx.clearRect(0, 0, playingArea.width, playingArea.height);

    ctx.fillStyle = "rgb(3, 211, 252)";
    ctx.fillRect(0, 0, playingArea.width, playingArea.height);

    dropBird();
    showBird();
    showPipes();
    movePipes();
  }
}

function dropBird() {
  playerVelocity += fallSpeed;
  if (playerY + playerVelocity < playingArea.height - playerSize) {
    playerY += playerVelocity;
  } else {
    endGame();
  }
}

function jump() {
  if (playerY - 80 + jumpHeight > 0) {
    playerVelocity = 0.8;
    playerY -= jumpHeight;
  }
}

function showBird() {
  playerElement.style.top = `${playerY + 80}px`;
  playerElement.style.transform = `rotate(${(playerVelocity * 10) - 30}deg)`;

  for (let pipe of pipes) {
    let intersectsHorizontally = playerLeft + playerSize >= pipe.pipeX && playerLeft <= pipe.pipeX + pipeWidth;
    let intersectsVertically = playerY + 5 <= pipe.pipe1Height + pipeHeadHeight || playerY - 5 >= pipe.pipe1Height + pipe.pipeSpace;
    if (intersectsHorizontally && intersectsVertically) {
      endGame();
    } else if (!pipe.scored && playerLeft > pipe.pipeX + 5) {
      pipe.scored = true;
      score++;
      scoreParagraph.innerHTML = `Score: ${score}`;
    }
  }
}

function movePipes() {
  for (let pipe in pipes) {
    pipes[pipe].pipeX -= pipeMoveSpeed + (score * pipeSpeedIncrease);

    if (pipes[pipe].pipeX + pipeWidth < 0) {
      pipes.splice(pipe, pipe + 1);
    }
  }
}

function generatePipe() {
  let randomSpace = Math.floor(Math.random() * (maxSpace - minSpace)) + minSpace;
  let randomHeight = Math.floor(Math.random() * (playingArea.height - randomSpace - (3 * pipeHeadHeight)) - minPipeHeight) + minPipeHeight;
  pipes.push({ pipeX: playingArea.width, pipe1Height: randomHeight, pipeSpace: randomSpace });

  if (!gameOver) {
    pipesInterval = setTimeout(generatePipe, generateSpeed - (score * generateSpeedIncrease));
  }
}

function makeBorderRect(x, y, w, h) {
  ctx.fillStyle = "black";
  ctx.fillRect(x - borderWidth, y - borderWidth, w + (borderWidth * 2), h + (borderWidth * 2));
}

function showPipes() {
  for (let pipe of pipes) {
    makePipes(pipe.pipeX, pipe.pipe1Height, pipe.pipeSpace);
  }
}

function makePipes(pipesX, pipe1Height, pipeSpace) {
  let pipe2Y = pipeSpace + (pipe1Height + pipeHeadHeight + 4);

  makeBorderRect(pipesX, pipe1Height, pipeWidth + 20, pipeHeadHeight)
  ctx.fillStyle = "green";
  ctx.fillRect(pipesX, pipe1Height, pipeWidth + 20, pipeHeadHeight);

  makeBorderRect(pipesX + 10, 0, pipeWidth, pipe1Height);
  ctx.fillStyle = "green";
  ctx.fillRect(pipesX + 10, 0, pipeWidth, pipe1Height);

  makeBorderRect(pipesX, pipe2Y, pipeWidth + 20, pipeHeadHeight);
  ctx.fillStyle = "green";
  ctx.fillRect(pipesX, pipe2Y, pipeWidth + 20, pipeHeadHeight);


  makeBorderRect(pipesX + 10, pipe2Y + pipeHeadHeight, pipeWidth, playingArea.height - (pipe2Y + pipeHeadHeight));
  ctx.fillStyle = "green";
  ctx.fillRect(pipesX + 10, pipe2Y + pipeHeadHeight, pipeWidth, playingArea.height - (pipe2Y + pipeHeadHeight));
}
