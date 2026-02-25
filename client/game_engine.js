import ToastHelper from "./toast_helper.js";
import PositionHelper from "./position_helper.js";
import AIAnalysisTabHelper from "./ai_analysis_tab_helper.js"
import Renderer from "./renderer.js"
import PlayerSelectHelper from "./player_select_helper.js";
import AIController from "./ai_controller.js";
import SquareController from "./square_controller.js";

export default class GameEngine {
    constructor() {
        this.startBtn = document.getElementById("startPause"),
            this.restartBtn = document.getElementById("restart");
        this.gameStarted = false;
    }

    generateEventListenenerFunctions() {
        this.startBtn.addEventListener("click", (event) => {
            this._startBtnClick()
        });

        this.restartBtn.addEventListener("click", (event) => {
            this._restartBtnClick()
        });
    }

    _startBtnClick() {
        const renderer = new Renderer()
        if (this.startBtn.innerText == "Start") {
            this.startBtn.innerText = "Pause"
            renderer.handleBoardVisibility("started")
            this.checkTurn()
        }
        else {
            renderer.handleBoardVisibility("paused")
            this.startBtn.innerText = "Start"
        }
    }

    _restartBtnClick() {
        const toasthelper = new ToastHelper()
        const renderer = new Renderer()
        const positionHelper = new PositionHelper()
        const aiAnalysisTabHelper = new AIAnalysisTabHelper()

        renderer.handleBoardVisibility("paused")
        positionHelper.setPosition("8-8-8-8-8-8-8-8")
        toasthelper.showToast("Game was restarted.")
        aiAnalysisTabHelper.resetTabStats()
        let position = positionHelper.getUrlPosition()
        renderer.removeWinnerDisplay()
        renderer.drawBoard(position)
        this.startBtn.style.display = "block"
        this.startBtn.innerText = "Start"
    }

    getCurrentPlayer() {
        const positionHelper = new PositionHelper();
        const position = positionHelper.getUrlPosition();

        const emptyCells = position.replace(/[^0-9]/g, "");

        let totalEmpty = 0;
        for (let char of emptyCells) {
            totalEmpty += parseInt(char, 10);
        }

        const stoneCount = 64 - totalEmpty;

        return (stoneCount % 2 === 0) ? 'b' : 'w';
    }

    handleNewPosition(newPosition) {
        const renderer = new Renderer()
        const positionHelper = new PositionHelper()
        let winObject = positionHelper.checkWinner(newPosition)
        if (!winObject) { return }

        const toasthelper = new ToastHelper()
        toasthelper.showToast(`${(winObject.color == 'b' ? 'Black' : 'White')} player won the match!`)
        renderer.displayWinner(winObject.squares)

        this.startBtn.style.display = "none"
    }

    async checkTurn() {
        if (this.startBtn.style.display == "none" || this.startBtn.innerText == "Start") { return }
        const playerSelectHelper = new PlayerSelectHelper()
        const aiController = new AIController()

        const color = this.getCurrentPlayer();
        let players = playerSelectHelper.getPlayers()
        let playerTypes = {
            'b': players[0], 
            'w': players[1]
        };
        const type = playerTypes[color];

        if (type != 'human') {
            this.disableBoard();
            const move = await aiController.getMove(color, type);
            if (this.startBtn.style.display == "none" || this.startBtn.innerText == "Start") { return }
            this.playMove(move);
        } else {
            this.enableBoard();
        }
    }

    disableBoard() {
        const renderer = new Renderer()
        renderer.boardDiv.style.pointerEvents = "none"
    }

    enableBoard() {
        const renderer = new Renderer()
        renderer.boardDiv.style.pointerEvents = "all"
    }

    playMove(coord) {
        const squareController = new SquareController()
        squareController.onSquareClick(coord)
    }
}