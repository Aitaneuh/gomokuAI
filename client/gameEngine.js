import ToastHelper from "./toast_helper.js";
import PositionHelper from "./position_helper.js";
import AIAnalysisTabHelper from "./ai_analysis_tab_helper.js"
import Renderer from "./renderer.js"

const renderer = new Renderer()
const toasthelper = new ToastHelper()
const positionHelper = new PositionHelper()
const aiAnalysisTabHelper = new AIAnalysisTabHelper()

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
        this.gameStarted = false
        this.startBtn.innerText = "Start"
        renderer.handleBoardVisibility("paused")
        positionHelper.setPosition("8-8-8-8-8-8-8-8")
        toasthelper.showToast("Game was restarted.")
        aiAnalysisTabHelper.resetTabStats()
        let position = positionHelper.getUrlPosition()
        renderer.drawBoard(position)
    }
}