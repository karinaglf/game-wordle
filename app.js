const board = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'];

function getRandomWord() {
	return words[Math.floor(Math.random() * words.length)];
}

let targetWord = getRandomWord();
console.log(targetWord);

class Game {
	constructor() {
		this.gameBoard = [
			['', '', '', '', ''],
			['', '', '', '', ''],
			['', '', '', '', ''],
			['', '', '', '', ''],
			['', '', '', '', ''],
			['', '', '', '', ''],
		];
		this.guessRow = 0;
		this.guessCard = 0;
		this.guessedWord = '';
		this.isGameOver = false;
	}

	startGame() {
		this.drawBoard();
		this.drawKeyboard();
		document.addEventListener('keydown', (e) => this.handleKeyDown(e.key));
	}

	startNewGuess() {
		message.innerHTML = '';

		this.guessCard = 0;

		if (this.guessRow >= 5) {
			message.innerHTML = `You missed, the word was ${targetWord.toUpperCase()}`;
			this.isGameOver = true;
		}

		this.guessRow++;
	}

	drawKeyboard() {
		keys.forEach((key) => {
			const btnKey = document.createElement('button');
			btnKey.innerText = key;
			btnKey.setAttribute('id', `key-${key}`);
			btnKey.setAttribute('value', key);
			btnKey.addEventListener('click', () => this.handleClick(key));
			keyboard.appendChild(btnKey);
		});
	}

	drawBoard() {
		this.gameBoard.forEach((row, index) => {
			// Create Guess Rows
			const guessRow = document.createElement('div');
			guessRow.className = 'guessRow';
			guessRow.setAttribute('id', `row-${index}`);

			// Create Guess Cards on Each Row
			row.forEach((item, i) => {
				const card = document.createElement('div');
				card.className = 'guessCard';
				card.setAttribute('id', `row-${index}-guess-${i}`);
				guessRow.appendChild(card);
			});

			//Draw Rows on the Board Container
			return board.appendChild(guessRow);
		});
	}

	handleClick(letter) {
		if (!this.isGameOver) {
			if (letter === '⌫') {
				return this.deleteLetter();
			}
			if (letter === 'ENTER') {
				return this.submitGuess();
			}
			return this.addLetter(letter);
		}
		return;
	}

	handleKeyDown(key) {
		if (!this.isGameOver) {
			if (key == 'Backspace') {
				return this.deleteLetter();
			}
			if (key == 'Enter') {
				return this.submitGuess();
			}
			if (key.match(/^[a-z]$/i)) {
				return this.addLetter(key.toUpperCase());
			}
		}
		return;
	}

	addLetter(letter) {
		message.innerHTML = '';

		if (this.guessCard < 5 && this.guessRow <= 6) {
			this.gameBoard[this.guessRow][this.guessCard] = letter;
			const cardElement = document.getElementById(`row-${this.guessRow}-guess-${this.guessCard}`);
			cardElement.innerText = letter;
			cardElement.classList.add('has-letter');
			this.guessCard++;
			return;
		}
		return;
	}

	deleteLetter() {
		message.innerHTML = '';

		if (this.guessCard > 0 && this.guessCard <= 5) {
			const cardElement = document.getElementById(`row-${this.guessRow}-guess-${this.guessCard - 1}`);
			cardElement.innerText = '';
			cardElement.classList.remove('has-letter');
			this.guessCard--;
			return;
		}
		return;
	}

	flipCards() {
		const rowSquares = this.gameBoard[this.guessRow];

		rowSquares.forEach((letter, i) => {
			const card = document.getElementById(`row-${this.guessRow}-guess-${i}`);

			setTimeout(() => {
				card.classList.add('flip');
			}, (i * 500) / 2);

			card.addEventListener('transitionend', () => {
				card.classList.remove('flip');
			});

		});
	}

	colorGame() {
		const rowSquares = this.gameBoard[this.guessRow];

		rowSquares.forEach((letter, i) => {
			const card = document.getElementById(`row-${this.guessRow}-guess-${i}`);
			const btnKey = document.getElementById(`key-${letter}`);

			if (targetWord[i] == letter.toLowerCase()) {
				card.classList.add('correct');
				card.classList.add('correct');
			} else if (targetWord.includes(letter.toLowerCase())) {
				card.classList.add('wrong-place');
				btnKey.classList.add('wrong-place');
			} else {
				card.classList.add('wrong');
				btnKey.classList.add('wrong');
			}
		});
	}

	submitGuess() {
		if (this.guessCard < 5) return (message.innerHTML = 'Not long enough');

		this.guessedWord = this.gameBoard[this.guessRow].join('').toLowerCase();

		if (this.guessedWord == targetWord) {
			message.innerHTML = 'You got it!';
			this.colorGame();
			this.danceCards();
			this.isGameOver = true;
		} else if (!words.includes(this.guessedWord)) {
			message.innerHTML = 'Not in word list!';
			this.shakeCards();
		} else {
			this.flipCards();
			this.colorGame();
			this.startNewGuess();
		}
	}

	shakeCards() {
		const rowCards = this.gameBoard[this.guessRow];

		rowCards.forEach((card, i) => {
			const cardElement = document.getElementById(`row-${this.guessRow}-guess-${i}`);
			cardElement.classList.add('shake');
			cardElement.addEventListener('animationend', () => {
				cardElement.classList.remove('shake');
			});
		});
	}

	danceCards() {
		const rowCards = this.gameBoard[this.guessRow];

		rowCards.forEach((card, i) => {
			const cardElement = document.getElementById(`row-${this.guessRow}-guess-${i}`);

			setTimeout(() => {
				cardElement.classList.add('dance');
			}, (i * 500) / 2);
			cardElement.addEventListener('animationend', () => {
				cardElement.classList.remove('dance');
			});
		});
	}
}

const game = new Game();
game.startGame();
