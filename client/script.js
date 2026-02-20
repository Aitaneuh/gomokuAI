import Renderer from "./renderer.js";
import PositionHelper from "./position_helper.js";
import GameEngine from "./gameEngine.js";

// Creating elements
const renderer = new Renderer()
const positionHelper = new PositionHelper()
const gameEngine = new GameEngine()

window.addEventListener("load", (event) => {
    let position = positionHelper.getUrlPosition()
    renderer.drawBoard(position)
    gameEngine.generateEventListenenerFunctions()
});