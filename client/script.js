import Renderer from "./renderer.js";
import PositionHelper from "./position_helper.js";

const boardDiv = document.getElementById("board")

// Creating elements
const renderer = new Renderer(boardDiv)
const positionHelper = new PositionHelper()

window.addEventListener("load", (event) => {
    let position = positionHelper.getUrlPosition()
    renderer.drawBoard(position)
});