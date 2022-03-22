const board = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message').firstChild;

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'];

function getRandomWord() {
	return words[Math.floor(Math.random() * words.length)];
}

let targetWord = getRandomWord();

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
		this.currentRow = 0;
		this.currentPosition = 0;
		this.guessedWord = '';
		this.isGameOver = false;
	}

	startGame() {
		this.drawBoard();
		this.drawKeyboard();
		document.addEventListener('keydown', (e) => this.handleKeyDown(e.key));
		document.addEventListener('click', (e) => this.handleClick(e.target.value));
	}

	startNewGuess() {
		//message.style.display='none'

		this.currentPosition = 0;

		if (this.currentRow >= 5) {
			this.showMessage(`You missed, the word was ${targetWord.toUpperCase()}`);
			this.isGameOver = true;
		}

		this.currentRow++;
	}
	showMessage(msgText) {
		message.innerText = msgText;
		message.style.display = 'block';

		setTimeout(() => {
			message.innerText = '';
			message.style.display = 'none';
		}, 1000);
	}

	drawKeyboard() {
		keys.forEach((key) => {
			const btnKey = document.createElement('button');
			btnKey.innerText = key;
			btnKey.value = key;
			btnKey.setAttribute('id', `key-${key}`);
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

	handleClick(btnValue) {
		if (!this.isGameOver && btnValue !== undefined) {
			if (btnValue === '⌫') {
				return this.deleteLetter();
			}
			if (btnValue === 'ENTER') {
				return this.submitGuess();
			}
			return this.addLetter(btnValue);
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

		if (this.currentPosition < 5 && this.currentRow <= 6) {
			//Update game controllers
			this.gameBoard[this.currentRow][this.currentPosition] = letter;

			//Update DOM
			const cardElement = document.getElementById(`row-${this.currentRow}-guess-${this.currentPosition}`);
			cardElement.innerText = letter;
			cardElement.classList.add('has-letter');
			this.currentPosition++;
			return;
		}
		return;
	}

	deleteLetter() {
		if (this.currentPosition > 0 && this.currentPosition <= 5) {
			const cardElement = document.getElementById(`row-${this.currentRow}-guess-${this.currentPosition - 1}`);
			cardElement.innerText = '';
			cardElement.classList.remove('has-letter');
			this.currentPosition--;
			return;
		}
		return;
	}

	flipCards() {
		const guessCards = this.gameBoard[this.currentRow];

		guessCards.forEach((letter, i) => {
			const card = document.getElementById(`row-${this.currentRow}-guess-${i}`);

			setTimeout(() => {
				card.classList.add('flip');
				this.colorCards(letter, i);
			}, 400 * i);

			card.addEventListener('transitionend', () => {
				card.classList.remove('flip');
			});

			setTimeout(() => {
				this.colorKeyboard(letter, i);
			}, 400 * 5);

			if (this.isGameOver) {
				setTimeout(() => {
					this.showMessage('You got it!');
					this.danceCards();
				}, 400 * 5);
			}
		});

		this.startNewGuess();
	}

	colorCards(letter, i) {
		let card = document.getElementById(`row-${this.currentRow - 1}-guess-${i}`);

		if (targetWord[i] == letter.toLowerCase()) {
			card.classList.add('correct');
		} else if (targetWord.includes(letter.toLowerCase())) {
			card.classList.add('wrong-place');
		} else {
			card.classList.add('wrong');
		}
	}

	colorKeyboard(letter, i) {
		const btnKey = document.getElementById(`key-${letter}`);

		if (targetWord[i] == letter.toLowerCase()) {
			btnKey.classList.add('correct');
		} else if (targetWord.includes(letter.toLowerCase())) {
			btnKey.classList.add('wrong-place');
		} else {
			btnKey.classList.add('wrong');
		}
	}

	submitGuess() {
		if (this.currentPosition < 5) return this.showMessage('Not long enough');

		this.guessedWord = this.gameBoard[this.currentRow].join('').toLowerCase();

		console.log(this.guessedWord);

		if (this.guessedWord == targetWord) {
			this.isGameOver = true;
			this.flipCards();
		} else if (!words.includes(this.guessedWord)) {
			this.showMessage('Not in word list!');
			this.shakeCards();
		} else {
			this.flipCards();
		}
	}

	shakeCards() {
		const guessCards = this.gameBoard[this.currentRow];

		guessCards.forEach((card, i) => {
			const cardElement = document.getElementById(`row-${this.currentRow}-guess-${i}`);
			cardElement.classList.add('shake');
			cardElement.addEventListener('animationend', () => {
				cardElement.classList.remove('shake');
			});
		});
	}

	danceCards() {
		const guessCards = this.gameBoard[this.currentRow];

		guessCards.forEach((letter, i) => {
			const card = document.getElementById(`row-${this.currentRow - 1}-guess-${i}`);

			setTimeout(() => {
				card.classList.add('dance');
			}, 400 * i);

			card.addEventListener('animationend', () => {
				card.classList.remove('dance');
			});
		});
	}
}

const game = new Game();
game.startGame();
