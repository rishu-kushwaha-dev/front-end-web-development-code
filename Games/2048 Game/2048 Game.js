class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.best = parseInt(localStorage.getItem('best2048')) || 0;
        this.gameOver = false;
        this.won = false;
        this.keepPlaying = false;

        this.gridElement = document.getElementById('grid');
        this.scoreElement = document.getElementById('score');
        this.bestElement = document.getElementById('best');
        this.gameMessage = document.getElementById('gameMessage');
        this.gameMessageText = document.getElementById('gameMessageText');
        this.retryBtn = document.getElementById('retryBtn');
        this.newGameBtn = document.getElementById('newGameBtn');

        this.tiles = [];
        this.init();
    }

    init() {
        this.setupGrid();
        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
        this.setupEventListeners();
    }

    setupGrid() {
        this.gridElement.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            this.gridElement.appendChild(cell);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.retryBtn.addEventListener('click', () => this.restart());
        this.newGameBtn.addEventListener('click', () => this.restart());

        let startX, startY;
        const gridContainer = document.querySelector('.grid-container');

        gridContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        gridContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = endX - startX;
            const diffY = endY - startY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 30) {
                    this.move(diffX > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(diffY) > 30) {
                    this.move(diffY > 0 ? 'down' : 'up');
                }
            }

            startX = null;
            startY = null;
        });
    }

    handleKeyPress(e) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right',
            'W': 'up',
            'S': 'down',
            'A': 'left',
            'D': 'right'
        };

        const direction = keyMap[e.key];
        if (direction) {
            e.preventDefault();
            this.move(direction);
        }
    }

    move(direction) {
        if (this.gameOver && !this.keepPlaying) return;

        const previousGrid = this.grid.map(row => [...row]);
        let moved = false;

        switch (direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addNewTile();
            this.updateDisplay();

            if (this.checkWin() && !this.keepPlaying) {
                this.won = true;
                this.showMessage('You Win!', 'game-won');
            } else if (this.checkGameOver()) {
                this.gameOver = true;
                this.showMessage('Game Over!', '');
            }
        }
    }

    moveUp() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const column = this.getColumn(col);
            const result = this.slideAndMerge(column);
            if (!this.arraysEqual(column, result)) {
                moved = true;
                this.setColumn(col, result);
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const column = this.getColumn(col).reverse();
            const result = this.slideAndMerge(column).reverse();
            const original = this.getColumn(col);
            if (!this.arraysEqual(original, result)) {
                moved = true;
                this.setColumn(col, result);
            }
        }
        return moved;
    }

    moveLeft() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const result = this.slideAndMerge(this.grid[row]);
            if (!this.arraysEqual(this.grid[row], result)) {
                moved = true;
                this.grid[row] = result;
            }
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const reversed = [...this.grid[row]].reverse();
            const result = this.slideAndMerge(reversed).reverse();
            if (!this.arraysEqual(this.grid[row], result)) {
                moved = true;
                this.grid[row] = result;
            }
        }
        return moved;
    }

    slideAndMerge(line) {
        let filtered = line.filter(val => val !== 0);
        let merged = [];

        while (filtered.length > 0) {
            if (filtered.length > 1 && filtered[0] === filtered[1]) {
                const mergedValue = filtered[0] * 2;
                merged.push(mergedValue);
                this.score += mergedValue;
                filtered.shift();
                filtered.shift();
            } else {
                merged.push(filtered[0]);
                filtered.shift();
            }
        }

        while (merged.length < 4) {
            merged.push(0);
        }

        return merged;
    }

    getColumn(col) {
        return [this.grid[0][col], this.grid[1][col], this.grid[2][col], this.grid[3][col]];
    }

    setColumn(col, values) {
        for (let row = 0; row < 4; row++) {
            this.grid[row][col] = values[row];
        }
    }

    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, idx) => val === b[idx]);
    }

    addNewTile() {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.grid[randomCell.row][randomCell.col] = value;
        }
    }

    updateDisplay() {
        this.tiles.forEach(tile => tile.remove());
        this.tiles = [];

        const gridRect = this.gridElement.getBoundingClientRect();
        const cells = this.gridElement.querySelectorAll('.cell');
        const gap = 12;
        const cellSize = (gridRect.width - gap * 3) / 4;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const value = this.grid[row][col];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value > 2048 ? 'super' : value}`;
                    if (value > 2048) {
                        tile.textContent = value;
                    } else {
                        tile.textContent = value;
                    }

                    const cell = cells[row * 4 + col];
                    const cellRect = cell.getBoundingClientRect();

                    const x = cellRect.left - gridRect.left;
                    const y = cellRect.top - gridRect.top;

                    tile.style.left = `${x}px`;
                    tile.style.top = `${y}px`;
                    tile.style.width = `${cellRect.width}px`;
                    tile.style.height = `${cellRect.height}px`;

                    this.gridElement.appendChild(tile);
                    this.tiles.push(tile);
                }
            }
        }

        this.scoreElement.textContent = this.score;
        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('best2048', this.best);
        }
        this.bestElement.textContent = this.best;
    }

    checkWin() {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    checkGameOver() {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.grid[row][col] === this.grid[row][col + 1]) {
                    return false;
                }
            }
        }

        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                if (this.grid[row][col] === this.grid[row + 1][col]) {
                    return false;
                }
            }
        }

        return true;
    }

    showMessage(message, className) {
        this.gameMessageText.textContent = message;
        this.gameMessage.className = 'game-message active ' + className;

        if (this.won) {
            this.retryBtn.textContent = 'Keep Going';
            this.keepPlaying = false;
            this.retryBtn.onclick = () => {
                this.keepPlaying = true;
                this.gameMessage.classList.remove('active');
                this.retryBtn.textContent = 'Try Again';
                this.retryBtn.onclick = () => this.restart();
            };
        }
    }

    restart() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.keepPlaying = false;
        this.gameMessage.classList.remove('active');
        this.retryBtn.textContent = 'Try Again';
        this.retryBtn.onclick = () => this.restart();

        this.addNewTile();
        this.addNewTile();
        this.updateDisplay();
    }
}

window.addEventListener('load', () => {
    window.game2048 = new Game2048();
});

window.addEventListener('resize', () => {
    if (window.game2048) {
        window.game2048.updateDisplay();
    }
});