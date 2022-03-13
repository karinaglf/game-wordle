//Grab DOM Element
//Draw
//Add Game Logic

const board = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '«'];

let word = 'party';

class Game {
	constructor() {
		this.gameBoard = [
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'x', 'x', 'x'],
			['x', 'x', 'o', 'x', 'x'],
		];
		this.guessRow = 0;
		this.guessTile = 0;
		this.gameOver = false;
	}

    start() {
        this.drawBoard();
        this.drawKeyboard();
    }

	drawKeyboard() {
		keys.forEach((key) => {
			const tile = document.createElement('button');
			tile.innerText = key;
			keyboard.appendChild(tile);
		});
	}

	drawBoard() {
		this.gameBoard.forEach((row, index) => {
			// Create Guess Rows
			const guessRow = document.createElement('div');
            guessRow.className =  'guessRow';
			guessRow.setAttribute('id', `row-${index}`);

			// Create Guess Tile on Each Row
			row.forEach((item, i) => {
				const tile = document.createElement('div');
                tile.className =  'guessTile';
				tile.setAttribute('id', `row-${index}-guess-${i}`);
                console.log(tile)
                guessRow.appendChild(tile)
			});

            //Draw rows on the board
			board.appendChild(guessRow);
		});
	}
}

const game = new Game();
game.drawBoard();
game.drawKeyboard();
console.log(game);
