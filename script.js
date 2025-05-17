const board = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const restartBtn = document.getElementById('restartBtn');
const nextBtn = document.getElementById('nextLevelBtn');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const startBtn = document.getElementById('startBtn');
const intro = document.querySelector('.intro');
const mainContent = document.querySelector('.main-content');



let icons = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍍', '🥝', '🥥'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let matchedPairs = 0;
let level = 1;

// Two Player Mode
let currentPlayer = 1;
let playerScores = { 1: 0, 2: 0 };

// Sound effects
const flipSound = new Audio('sounds/Flip.mp3');
const matchSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');

const questions = [
  {
    question: "What does JS stand for?",
    options: ["Java Style", "JavaScript", "JustScript", "JumboScript"],
    answer: "JavaScript"
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Google", "Microsoft", "Netscape", "IBM"],
    answer: "Netscape"
  },
  {
    question: "What is the output of '2' + 2?",
    options: ["4", "22", "NaN", "Error"],
    answer: "22"
  },
  {
    question: "Which keyword declares a constant?",
    options: ["let", "const", "var", "define"],
    answer: "const"
  }
];


function shuffle(array) {
  return [...array].sort(() => 0.5 - Math.random());
}

function createBoard(size = 4) {
  board.innerHTML = '';
  matchedPairs = 0;
  let picks = shuffle(icons).slice(0, (size * size) / 2);
  cards = shuffle([...picks, ...picks]);

  cards.forEach((icon) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.icon = icon;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${icon}</div>
      </div>
    `;
    board.appendChild(card);

    card.addEventListener('click', () => flipCard(card));
  });

  board.style.gridTemplateColumns = `repeat(${Math.sqrt(cards.length)}, 1fr)`;
  updateStats();
}

function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped')) return;

  flipSound.play();
  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

  if (isMatch) {
    setTimeout(() => showQuestion(firstCard, secondCard), 600);
  } else {
    setTimeout(() => {
      wrongSound.play();
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      switchPlayer();
      resetFlippedCards();
    }, 1000);
  }
}

function showQuestion(card1, card2) {
  const modal = document.getElementById("quizModal");
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");

  const randomQ = questions[Math.floor(Math.random() * questions.length)];
  questionEl.textContent = randomQ.question;
  optionsEl.innerHTML = "";

  randomQ.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      modal.style.display = "none";

      if (option === randomQ.answer) {
        matchSound.play();
        matchedPairs++;
        playerScores[currentPlayer] += 10;
        checkWin();
      } else {
        wrongSound.play();
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        switchPlayer();
      }

      resetFlippedCards();
      updateStats();
    };
    optionsEl.appendChild(btn);
  });

  modal.style.display = "flex";
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function updateStats() {
  scoreDisplay.textContent = `Player 1: ${playerScores[1]} | Player 2: ${playerScores[2]}`;
  currentPlayerDisplay.textContent = `Player ${currentPlayer}'s Turn`;
  levelDisplay.textContent = `Level: ${level}`;
}

function checkWin() {
  const flippedCards = document.querySelectorAll('.card.flipped');
  if (flippedCards.length === cards.length) {
    saveToLeaderboard();
    renderLeaderboard();
    nextBtn.style.display = 'inline-block';
  }
}

function saveToLeaderboard() {
  const winner = playerScores[1] > playerScores[2] ? 1 : 2;
  const name = prompt(`🎉 Player ${winner} wins! Enter your name:`);
  const record = { name, score: playerScores[winner], level };

  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.push(record);
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
  const list = document.getElementById('leaderboardList');
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  list.innerHTML = leaderboard.map(
    (entry, i) => `<li>#${i + 1} - ${entry.name} (Score: ${entry.score}, Level: ${entry.level})</li>`
  ).join('');
}

function resetFlippedCards() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

restartBtn.addEventListener('click', () => {
  score = 0;
  level = 1;
  playerScores = { 1: 0, 2: 0 };
  currentPlayer = 1;
  nextBtn.style.display = 'none';
  createBoard(4);
});

nextBtn.addEventListener('click', () => {
  level++;
  nextBtn.style.display = 'none';
  let size = 2 + level;
  if ((size * size) % 2 !== 0) size++;
  createBoard(size);
});

if (startBtn) {
  // Only set the innerHTML and class if not already set (prevents double event binding)
  if (!startBtn.classList.contains('startBtn')) {
    startBtn.classList.add('startBtn');
    startBtn.innerHTML = '<span class="startBtn-outer"><span class="startBtn-inner"><span>Start Game</span></span></span>';
  }
  startBtn.addEventListener('click', function() {
    intro.style.display = 'none';
    mainContent.style.display = '';
    score = 0;
    level = 1;
    playerScores = { 1: 0, 2: 0 };
    currentPlayer = 1;
    nextBtn.style.display = 'none';
    createBoard(4);
    updateStats();
  });
}

// Initialize the theme toggle
initThemeToggle();

renderLeaderboard();
createBoard();
