const board = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '«'];

let targetWord = 'party';

class Game {
	constructor() {
		this.gameBoard = [
			['k', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'o', 'x', 'x'],
		];
		this.guessRow = 0;
		this.guessTile = 0;
		this.guessedWord = '';
		this.isGameOver = false;
	}

	startGame() {
		this.drawBoard();
		this.drawKeyboard();
	}

	startNewGuess() {
		this.guessTile = 0;
		this.guessRow++;
	}

	drawKeyboard() {
		keys.forEach((key) => {
			const btnKey = document.createElement('button');
			btnKey.innerText = key;
			btnKey.setAttribute('id', `key-${key}`)
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

			// Create Guess Tile on Each Row
			row.forEach((item, i) => {
				const tile = document.createElement('div');
				tile.className = 'guessTile';
				tile.setAttribute('id', `row-${index}-guess-${i}`);
				guessRow.appendChild(tile);
			});

			//Draw rows on the board
			return board.appendChild(guessRow);
		});
	}

	handleClick(letter) {
		if (!this.isGameOver) {
			if (letter === '«') {
				this.deleteLetter();
				return;
			}
			if (letter === 'ENTER') {
				this.submitGuess();
				return;
			}
			this.addLetter(letter);
		}
	}

	addLetter(letter) {
		if (this.guessTile < 5 && this.guessRow <= 6) {
			this.gameBoard[this.guessRow][this.guessTile] = letter;
			const tile = document.getElementById(`row-${this.guessRow}-guess-${this.guessTile}`);
			tile.innerText = letter;
			this.guessTile++;
			return;
		}
		return;
	}

	deleteLetter() {
		if (this.guessTile >= 0 && this.guessTile <= 5) {
			const tile = document.getElementById(`row-${this.guessRow}-guess-${this.guessTile}`);
			tile.innerText = '';
			this.guessTile--;
			return;
		}
		return;	
	}

	flipCards() {
		const tiles = this.gameBoard[this.guessRow];

		tiles.forEach((letter, i) => {
			const card = document.getElementById(`row-${this.guessRow}-guess-${i}`);
			const btnKey = document.getElementById(`key-${letter}`)

			if (targetWord[i] == letter.toLowerCase()) {
				card.classList.add('correct');		
				btnKey.classList.add('correct');	
			} else if (targetWord.includes(letter.toLowerCase())) {
				card.classList.add('wrong-place');
				btnKey.classList.add('wrong-place');
			} else {
				card.classList.add('wrong');
				btnKey.classList.add('wrong');
			}
		});
		this.startNewGuess();
		return;
	}

	finishGame() {
		const tiles = this.gameBoard[this.guessRow];

		tiles.forEach((letter, i) => {
			const card = document.getElementById(`row-${this.guessRow}-guess-${i}`);

			if (targetWord[i] == letter.toLowerCase()) {
				card.classList.add('correct');			
			}
		});
	}

	submitGuess() {
		if (this.guessTile < 5) return console.log('Not long enough');

		this.guessedWord = this.gameBoard[this.guessRow].join('');

		if (this.guessedWord.toLowerCase() == targetWord.toLowerCase()) {
			message.innerHTML='You got it!'
			this.isGameOver = true;
			this.finishGame();
			return;
		} else {
			this.flipCards();
		}
	}
}

const game = new Game();
game.startGame();
