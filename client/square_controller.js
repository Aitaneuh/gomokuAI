import PositionHelper from "./position_helper.js";
import GameEngine from "./gameEngine.js";

export default class SquareController {
    onSquareClick(coord) {
        const position_helper = new PositionHelper()
        const gameEngine = new GameEngine()

        const sq = document.querySelector(`[data-coord="${coord}"]`);
        const color = position_helper.getSquareProperty(sq);
        if (color == "white" || color == "black") { return }


        let currentPlayer = gameEngine.getCurrentPlayer()
        const stone = document.createElement("div");
        stone.className = `stone ${currentPlayer == 'b' ? 'black' : 'white'}`;
        sq.appendChild(stone);

        let newPositon = position_helper.addSquareToPosition(coord, currentPlayer)
        position_helper.setPosition(newPositon)
    }
}