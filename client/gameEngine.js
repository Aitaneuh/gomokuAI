import ToastHelper from "./toast_helper.js";
import PositionHelper from "./position_helper.js";
import AIAnalysisTabHelper from "./ai_analysis_tab_helper.js"
import Renderer from "./renderer.js"

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
        }
        else {
            renderer.handleBoardVisibility("paused")
            this.startBtn.innerText = "Start"
        }
        this.gameStarted = !this.gameStarted
    }

    _restartBtnClick() {
        const toasthelper = new ToastHelper()
        const renderer = new Renderer()
        const positionHelper = new PositionHelper()
        const aiAnalysisTabHelper = new AIAnalysisTabHelper()

        this.gameStarted = false
        this.startBtn.innerText = "Start"
        renderer.handleBoardVisibility("paused")
        positionHelper.setPosition("8-8-8-8-8-8-8-8")
        toasthelper.showToast("Game was restarted.")
        aiAnalysisTabHelper.resetTabStats()
        let position = positionHelper.getUrlPosition()
        renderer.removeWinnerDisplay()
        renderer.drawBoard(position)
        this.startBtn.style.display = "block"
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
}