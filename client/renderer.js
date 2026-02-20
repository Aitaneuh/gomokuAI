import PositionHelper from "./position_helper.js";
const positionHelper = new PositionHelper()

export default class Renderer {
    constructor() {
        this.boardDiv = document.getElementById("board");
    }

    drawBoard(position) {
        this.boardDiv.innerHTML = "";

        const rows = position.split("-");

        for (let r = 0; r < 8; r++) {
            let rowStr = rows[r];
            let col = 0;
            let chars = positionHelper.rowToSquareArray(rowStr)
            for (const char of chars) {
                this.createSquare(r, col, char)
                col++;
            }
        }
    }

    createSquare(r, c, color) {
        const sq = document.createElement("div");
        sq.className = "square " + ((r + c) % 2 === 0 ? "light" : "dark");

        const coord = this.squareToCoord(r, c);
        sq.dataset.coord = coord;

        if (color === 'b' || color === 'w') {
            const stone = document.createElement("div");
            stone.className = `stone ${color === 'b' ? 'black' : 'white'}`;
            sq.appendChild(stone);
        }


        // sq.onclick = () => onSquareClick(coord);

        document.getElementById("board").appendChild(sq);
    }

    squareToCoord(row, col) {
        const file = "abcdefgh"[col];
        const rank = 8 - row;
        return file + rank;
    }
}