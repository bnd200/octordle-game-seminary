// game.js

// Words to guess (your custom words)
const wordsToGuess = ["pitch", "swing", "tutor", "serve", "piano", "mazda", "sport", "march"];
let guesses = [];  // Store all guesses
let currentGuess = "";  // The current guess being entered
let solvedWords = new Array(8).fill(false); // Track solved words (true if guessed)
let usedLetters = new Set();  // Set to store used letters

function initializeGrids() {
  const gridContainer = document.getElementById('grid-container');
  for (let i = 0; i < 8; i++) {  // 8 words, so 8 grids
    const grid = document.createElement('div');
    grid.classList.add('grid');
    grid.id = `grid-${i}`;

    // Create 13 rows and 5 columns (for each guess and each letter in the word)
    for (let j = 0; j < 13; j++) {  // 13 guesses
      for (let k = 0; k < 5; k++) {  // 5 letters
        const cell = document.createElement('div');
        cell.id = `cell-${i}-${j}-${k}`;
        grid.appendChild(cell);
      }
    }
    gridContainer.appendChild(grid);
  }

  // Create the letter bank below the grids
  createLetterBank();
}

function createLetterBank() {
  const letterBankContainer = document.getElementById('letter-bank');
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Create a row of letter buttons (one for each letter in the alphabet)
  alphabet.forEach(letter => {
    const letterButton = document.createElement('button');
    letterButton.textContent = letter.toUpperCase();
    letterButton.id = `letter-${letter}`;
    letterButton.classList.add('letter-button');
    letterButton.disabled = true;  // Initially disabled
    letterButton.addEventListener('click', function () {
      alert(`This letter has been used: ${letter.toUpperCase()}`);
    });
    letterBankContainer.appendChild(letterButton);
  });
}

function submitGuess() {
  const guessInput = document.getElementById('guessInput');
  const guess = guessInput.value.toLowerCase();

  if (guess.length !== 5 || !/^[a-z]+$/.test(guess)) {
    alert("Please enter a valid 5-letter word.");
    return;
  }

  if (guesses.length >= 13) {
    alert("Game over! You've used all your guesses.");
    return;
  }

  guesses.push(guess);
  updateGrids();
  checkGuess(guess);
  updateLetterBank(guess);
  guessInput.value = "";
}

function updateGrids() {
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    for (let j = 0; j < 8; j++) {  // Loop over the 8 grids (one for each word)
      if (solvedWords[j]) continue;  // Skip grids that are solved
      for (let k = 0; k < 5; k++) {  // Loop over each letter (5 letters)
        const cell = document.getElementById(`cell-${j}-${i}-${k}`);
        cell.textContent = guess[k].toUpperCase();
      }
    }
  }
}

function updateLetterBank(guess) {
  for (let letter of guess) {
    if (!usedLetters.has(letter)) {
      usedLetters.add(letter);

      // Update the button style for used letters
      const letterButton = document.getElementById(`letter-${letter}`);
      if (letterButton) {
        letterButton.disabled = false;  // Enable the button
        letterButton.style.backgroundColor = getLetterColor(letter);
      }
    }
  }
}

function getLetterColor(letter) {
  // Check if the letter is in any of the words, if so color it accordingly
  let letterColor = "gray";  // Default color for unused letters

  // Check if the letter has been guessed correctly or incorrectly
  for (let i = 0; i < 8; i++) {
    let word = wordsToGuess[i];
    if (word.includes(letter)) {
      letterColor = "yellow";  // Found in the word, but not necessarily correct
    }
  }

  return letterColor;
}

function checkGuess(guess) {
  for (let i = 0; i < 8; i++) {
    if (solvedWords[i]) continue;  // Skip grids that are already solved

    let word = wordsToGuess[i];
    let guessCopy = guess.split('');
    let wordCopy = word.split('');
    let colors = ["white", "white", "white", "white", "white"];  // Default colors (no feedback yet)

    // First, check for correct letters (green)
    for (let j = 0; j < 5; j++) {
      if (guess[j] === word[j]) {
        colors[j] = "green";
        guessCopy[j] = null;  // Mark this letter as handled
        wordCopy[j] = null;   // Mark this letter as already guessed correctly
      }
    }

    // Then, check for present letters in wrong positions (yellow)
    for (let j = 0; j < 5; j++) {
      if (guessCopy[j] && wordCopy.includes(guessCopy[j])) {
        colors[j] = "yellow";
        wordCopy[wordCopy.indexOf(guessCopy[j])] = null;  // Remove the used letter
      }
    }

    // Apply the colors to the cells
    for (let j = 0; j < 5; j++) {
      const cell = document.getElementById(`cell-${i}-${guesses.length - 1}-${j}`);
      cell.style.backgroundColor = colors[j];

      if (colors[j] === "green") {
        cell.textContent = guess[j].toUpperCase();
      } else if (colors[j] === "yellow") {
        cell.textContent = guess[j].toUpperCase();
      } else {
        cell.textContent = guess[j].toUpperCase();
      }
    }

    // Check if the current word is completely solved
    if (guess === word) {
      solvedWords[i] = true;
      alert(`You guessed the word: ${word}`);
    }
  }
}

// Initialize the game
initializeGrids();
