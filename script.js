const board = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
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
let playerNames = { 1: 'Player 1', 2: 'Player 2' };

// Sound effects
const flipSound = new Audio('sounds/Flip.mp3');
const matchSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');

// --- Static JavaScript Questions with Leveling ---
const jsQuestions = {
  easy: [
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
    },
    {
      question: "Which symbol is used for single-line comments in JS?",
      options: ["//", "<!--", "#", "/*"],
      answer: "//"
    },
    {
      question: "How do you write 'Hello' to the console?",
      options: ["console.log('Hello')", "print('Hello')", "echo('Hello')", "printf('Hello')"],
      answer: "console.log('Hello')"
    },
    {
      question: "Which of these is a valid variable name?",
      options: ["2name", "_name", "name-2", "@name"],
      answer: "_name"
    },
    {
      question: "What is the correct file extension for JavaScript files?",
      options: [".js", ".java", ".javascript", ".jsx"],
      answer: ".js"
    },
    {
      question: "Which method joins array elements into a string?",
      options: ["join()", "concat()", "split()", "push()"],
      answer: "join()"
    },
    {
      question: "How do you declare a function in JS?",
      options: ["function myFunc() {}", "def myFunc() {}", "func myFunc() {}", "function:myFunc() {}"],
      answer: "function myFunc() {}"
    }
  ],
  medium: [
    {
      question: "What is the result of typeof null?",
      options: ["'object'", "'null'", "'undefined'", "'number'"],
      answer: "'object'"
    },
    {
      question: "Which array method returns the first element that matches a condition?",
      options: ["find()", "filter()", "map()", "forEach()"],
      answer: "find()"
    },
    {
      question: "What does the '===' operator do?",
      options: ["Strict equality", "Assignment", "Loose equality", "Type conversion"],
      answer: "Strict equality"
    },
    {
      question: "How do you create a Promise?",
      options: ["new Promise()", "Promise.create()", "promise()", "Promise()"],
      answer: "new Promise()"
    },
    {
      question: "Which method removes the last element from an array?",
      options: ["pop()", "shift()", "splice()", "remove()"],
      answer: "pop()"
    },
    {
      question: "What is the output of [1,2,3].map(x => x*2)?",
      options: ["[2,4,6]", "[1,2,3,2,4,6]", "[1,4,9]", "[2,3,4]"],
      answer: "[2,4,6]"
    },
    {
      question: "Which keyword is used to handle errors?",
      options: ["try", "catch", "error", "handle"],
      answer: "catch"
    },
    {
      question: "How do you convert a string to a number?",
      options: ["Number()", "parseInt()", "parseFloat()", "All of these"],
      answer: "All of these"
    },
    {
      question: "What is a closure?",
      options: ["A function with preserved scope", "A CSS property", "A type of loop", "A DOM element"],
      answer: "A function with preserved scope"
    },
    {
      question: "Which method adds an element to the end of an array?",
      options: ["push()", "unshift()", "concat()", "append()"],
      answer: "push()"
    }
  ],
  hard: [
    {
      question: "What is the output of: setTimeout(() => console.log(1), 0); console.log(2);?",
      options: ["2 then 1", "1 then 2", "1 only", "2 only"],
      answer: "2 then 1"
    },
    {
      question: "What does Object.freeze() do?",
      options: ["Prevents object modification", "Deletes the object", "Makes object iterable", "Converts to JSON"],
      answer: "Prevents object modification"
    },
    {
      question: "What is the result of [].__proto__ === Array.prototype?",
      options: ["true", "false", "undefined", "error"],
      answer: "true"
    },
    {
      question: "Which method returns a shallow copy of a portion of an array?",
      options: ["slice()", "splice()", "copy()", "split()"],
      answer: "slice()"
    },
    {
      question: "What is the output of typeof NaN?",
      options: ["'number'", "'NaN'", "'undefined'", "'object'"],
      answer: "'number'"
    },
    {
      question: "How do you deep clone an object in JS?",
      options: ["JSON.parse(JSON.stringify(obj))", "Object.assign({}, obj)", "obj.clone()", "obj.copy()"],
      answer: "JSON.parse(JSON.stringify(obj))"
    },
    {
      question: "What is the purpose of Symbol in JS?",
      options: ["Unique identifiers", "Private variables", "Event handling", "Type checking"],
      answer: "Unique identifiers"
    },
    {
      question: "Which of these is NOT a valid way to declare a class?",
      options: ["function MyClass() {}", "class MyClass {}", "let MyClass = class {}", "var MyClass = function() {}"],
      answer: "function MyClass() {}"
    },
    {
      question: "What is the output of: [1,2,3].reduce((a,b) => a+b, 0)?",
      options: ["6", "123", "[1,2,3]", "undefined"],
      answer: "6"
    },
    {
      question: "What is the output of: (function(){ return typeof arguments; })();?",
      options: ["'object'", "'array'", "'arguments'", "'undefined'"],
      answer: "'object'"
    }
  ]
};

let selectedLevel = 'easy';
let allQuestions = [];
let currentQuestionIndex = 0;

const levelSelect = document.getElementById('levelSelect');
if (levelSelect) {
  levelSelect.addEventListener('change', function() {
    selectedLevel = this.value;
  });
}

function loadQuestionsForLevel(level) {
  let difficulty = selectedLevel;
  if (!jsQuestions[difficulty]) difficulty = 'easy';
  // Shuffle questions for the selected level and remove used questions
  if (!window.usedQuestions) window.usedQuestions = { easy: [], medium: [], hard: [] };
  let available = jsQuestions[difficulty].filter(q => !window.usedQuestions[difficulty].includes(q.question));
  if (available.length === 0) {
    // Reset if all used
    window.usedQuestions[difficulty] = [];
    available = [...jsQuestions[difficulty]];
  }
  allQuestions = shuffle([...available]);
  currentQuestionIndex = 0;
}

function shuffle(array) {
  return [...array].sort(() => 0.5 - Math.random());
}

function createBoard() {
  const size = 4; // Always 4x4
  board.innerHTML = '';
  matchedPairs = 0;
  let picks = shuffle(icons).slice(0, 8); // 8 pairs for 16 cards
  cards = shuffle([...picks, ...picks]);

  // Responsive card size
  let cardSize = '90px';
  if (window.innerWidth <= 600) {
    cardSize = '60px';
  } else if (window.innerWidth <= 900) {
    cardSize = '75px';
  }

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
    card.style.width = cardSize;
    card.style.height = cardSize;
    board.appendChild(card);
    card.addEventListener('click', () => flipCard(card));
  });

  board.style.gridTemplateColumns = 'repeat(4, 1fr)';
  updateStats();
}

// Re-render board on resize for responsiveness
window.addEventListener('resize', () => {
  if (mainContent.style.display !== 'none') {
    createBoard();
  }
});

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

  // Get next question from the selected set
  const randomQ = allQuestions[currentQuestionIndex % allQuestions.length];
  window.usedQuestions[selectedLevel].push(randomQ.question);
  currentQuestionIndex++;

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
  // Update both stats and playerStats for new layout
  const playerStats = document.getElementById('playerStats');
  if (playerStats) {
    playerStats.innerHTML = `<span id="currentPlayer" style="color:#6c63ff; font-weight:bold;">${playerNames[currentPlayer]}'s Turn</span>`;
  }
  const scoreDiv = document.getElementById('score');
  if (scoreDiv) {
    scoreDiv.textContent = `Score: ${playerNames[1]}: ${playerScores[1]} | ${playerNames[2]}: ${playerScores[2]}`;
  }
  const levelDiv = document.getElementById('level');
  if (levelDiv) {
    levelDiv.textContent = `Level: ${level}`;
  }
  // Update mobile player names
  const mp1 = document.getElementById('mobilePlayer1');
  const mp2 = document.getElementById('mobilePlayer2');
  if (mp1 && mp2) {
    mp1.textContent = playerNames[1];
    mp2.textContent = playerNames[2];
  }
  saveGameState && saveGameState();
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
  const name = playerNames[winner];
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

// Removed restart button event listener and related logic

nextBtn.addEventListener('click', () => {
  level++;
  nextBtn.style.display = 'none';
  loadQuestionsForLevel(level);
  createBoard();
  saveGameState && saveGameState();
});

async function startGame() {
  // Get player names from input fields
  const p1 = document.getElementById('player1Name').value.trim();
  const p2 = document.getElementById('player2Name').value.trim();
  if (!p1 || !p2) {
    alert('Please enter both player names before starting the game.');
    return;
  }
  playerNames = { 1: p1, 2: p2 };

  intro.style.display = 'none';
  mainContent.style.display = '';
  score = 0;
  level = 1;
  playerScores = { 1: 0, 2: 0 };
  currentPlayer = 1;
  nextBtn.style.display = 'none';
  loadQuestionsForLevel(level);
  createBoard();
  updateStats();
  saveGameState && saveGameState();
  showRestartLoading(false);
}

if (startBtn) {
  startBtn.addEventListener('click', startGame);
}

nextBtn.addEventListener('click', () => {
  level++;
  nextBtn.style.display = 'none';
  loadQuestionsForLevel(level);
  createBoard();
  saveGameState && saveGameState();
});


document.addEventListener('DOMContentLoaded', () => {
  const instructions = document.querySelector('.instructions');
  if (instructions) {
    const fullText = instructions.innerHTML;
    instructions.innerHTML = '';
    let i = 0;
    function typeChar() {
      if (i < fullText.length) {
        if (fullText[i] === '<') {
          // Handle HTML tags (e.g., <br>)
          const tagEnd = fullText.indexOf('>', i);
          instructions.innerHTML += fullText.slice(i, tagEnd + 1);
          i = tagEnd + 1;
        } else {
          instructions.innerHTML += fullText[i];
          i++;
        }
        setTimeout(typeChar, 50); // Typing speed (ms)
      } else {
        instructions.innerHTML = fullText; // Ensure all HTML is rendered
      }
    }
    typeChar();
  }
});

renderLeaderboard();
createBoard();
