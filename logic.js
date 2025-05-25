// تمام منطق بازی

const gameBoard = document.getElementById("game");
const message = document.getElementById("message");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highscore");
const roundEl = document.getElementById("round");
const timerEl = document.getElementById("timer");
const medalEl = document.getElementById("medal");
const playerNameInput = document.getElementById("playerName");
const nameInputWrapper = document.getElementById("nameInputWrapper");
const leaderboardList = document.getElementById("leaderboardList");

let score = 100;
let highScore = 0;
let round = 1;
let timeLeft = 10;
let bombs = 1;
let totalCells = 25;
let revealTime = 1000;
let countdownInterval;
let currentMedal = "هیچ‌چیز";

function getCurrentMedal() {
  return currentMedal;
}

function updateMedal() {
  if (round >= 1 && round < 6) currentMedal = "🥉 برنزی";
  else if (round >= 6 && round < 11) currentMedal = "🥈 نقره‌ای";
  else if (round >= 11 && round < 16) currentMedal = "🥇 طلایی";
  else if (round >= 16 && round < 21) currentMedal = "🟠 کهربا";
  else if (round >= 21) currentMedal = "💎 الماس";
  medalEl.textContent = `🏅 مدال: ${currentMedal}`;
}

function generateBombs(count) {
  const bombSet = new Set();
  while (bombSet.size < count) {
    bombSet.add(Math.floor(Math.random() * totalCells));
  }
  return [...bombSet];
}

function drawBoard(bombIndices) {
  gameBoard.innerHTML = "";
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (bombIndices.includes(i)) {
      cell.classList.add("bomb");
      cell.textContent = "💣";
    }
    gameBoard.appendChild(cell);
  }
}

function hideBombs() {
  document.querySelectorAll(".cell.bomb").forEach((cell) => {
    cell.classList.remove("bomb");
    cell.textContent = "";
  });
}

function startRound() {
  message.textContent = `راند ${round} - پیدا کن بمب رو!`;
  roundEl.textContent = `راند: ${round}`;
  updateMedal();
  timeLeft = 10;
  timerEl.textContent = `⏳ زمان: ${timeLeft}`;
  bombs = 1 + Math.floor((round - 1) / 3);
  const bombIndices = generateBombs(bombs);

  drawBoard(bombIndices);

  setTimeout(() => {
    hideBombs();
    enableClicks(bombIndices);
    startCountdown(() => handleFail("⏱ وقتت تموم شد!"));
  }, revealTime);
}

function enableClicks(bombIndices) {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.onclick = () => {
      if (!bombIndices.includes(index)) {
        handleFail("💥 اشتباه زدی! باختی!");
      } else {
        clearInterval(countdownInterval);
        cell.classList.add("bomb");
        cell.textContent = "💣";
        score += 100;
        if (score > highScore) highScore = score;
        highScoreEl.textContent = `بالاترین رکورد: ${highScore}`;
        scoreEl.textContent = `امتیاز: ${score}`;
        round++;
        revealTime *= 0.9;
        setTimeout(startRound, 1500);
      }
    };
  });
}

function handleFail(msg) {
  clearInterval(countdownInterval);
  message.textContent = msg;
  document.querySelectorAll(".cell").forEach((c) => (c.onclick = null));
  nameInputWrapper.style.display = "block";
  timerEl.textContent = `⏳ زمان: 0`;
}

function startCountdown(onTimeout) {
  countdownInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏳ زمان: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      onTimeout();
    }
  }, 1000);
}

function resetGame() {
  score = 100;
  round = 1;
  revealTime = 1000;
  nameInputWrapper.style.display = "none";
  scoreEl.textContent = `امتیاز: ${score}`;
  highScoreEl.textContent = `بالاترین رکورد: ${highScore}`;
  startRound();
}

resetGame();
