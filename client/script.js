import Renderer from "./renderer.js";
import PositionHelper from "./position_helper.js";

// Creating elements
const renderer = new Renderer()
const positionHelper = new PositionHelper()

window.addEventListener("load", (event) => {
    let position = positionHelper.getUrlPosition()
    renderer.drawBoard(position)
});