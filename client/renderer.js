import PositionHelper from "./position_helper.js";
import PlayerSelectHelper from "./player_select_helper.js";
import AIAnalysisTabHelper from "./ai_analysis_tab_helper.js";
import SquareController from "./square_controller.js";


export default class Renderer {
    constructor() {
        this.boardDiv = document.getElementById("board");
    }

    drawBoard(position) {
        const positionHelper = new PositionHelper()

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
        const squareController = new SquareController()

        const sq = document.createElement("div");
        sq.className = "square " + ((r + c) % 2 === 0 ? "light" : "dark");

        const coord = this.squareToCoord(r, c);
        sq.dataset.coord = coord;

        if (color === 'b' || color === 'w') {
            const stone = document.createElement("div");
            stone.className = `stone ${color === 'b' ? 'black' : 'white'}`;
            sq.appendChild(stone);
        }


        sq.onclick = () => squareController.onSquareClick(coord);

        document.getElementById("board").appendChild(sq);
    }

    squareToCoord(row, col) {
        const file = "abcdefgh"[col];
        const rank = 8 - row;
        return file + rank;
    }

    handleAnalysisTabs() {
        const playerSelectHelper = new PlayerSelectHelper()
        const aiAnalysisTabHelper = new AIAnalysisTabHelper()

        if (playerSelectHelper.blackPlayerSelect.value != "human") {
            aiAnalysisTabHelper.setTabVisibility("black", true)
        } else {
            aiAnalysisTabHelper.setTabVisibility("black", false)
        }
        if (playerSelectHelper.whitePlayerSelect.value != "human") {
            aiAnalysisTabHelper.setTabVisibility("white", true)
        } else {
            aiAnalysisTabHelper.setTabVisibility("white", false)
        }
    }

    handleBoardVisibility(state) {
        if (state == "paused") {
            this.boardDiv.classList.add("paused")
        } else {
            this.boardDiv.classList.remove("paused")
        }
    }

    displayWinner(winningSquares) {
        const squares = document.querySelectorAll(".square");

        for (let sq of squares) {
            const coord = sq.dataset.coord;

            if (!winningSquares.includes(coord)) {
                sq.classList.add("paused");
            }
        }
    }

    removeWinnerDisplay() {
        const squares = document.querySelectorAll(".square");

        for (let sq of squares) {

            if (sq.classList.contains("paused")) {
                sq.classList.remove("paused");
            }
        }
    }

}