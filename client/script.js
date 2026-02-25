import Renderer from "./renderer.js";
import PositionHelper from "./position_helper.js";
import GameEngine from "./gameEngine.js";
import PlayerSelectHelper from "./player_select_helper.js";

window.addEventListener("load", (event) => {
    const renderer = new Renderer()
    const positionHelper = new PositionHelper()
    const gameEngine = new GameEngine()
    const playerSelectHelper = new PlayerSelectHelper()
    
    let position = positionHelper.getUrlPosition()
    renderer.drawBoard(position)
    renderer.handleAnalysisTabs()
    playerSelectHelper.addSelectEventListenener()
    gameEngine.generateEventListenenerFunctions()
});