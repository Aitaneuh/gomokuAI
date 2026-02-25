import PositionHelper from "./position_helper.js";
import Renderer from "./renderer.js";

export default class AIController {
    async getMove(color, type) {
        const positionHelper = new PositionHelper()
        const renderer = new Renderer()

        let move = ""
        switch (type) {
            case "random":
                const position = positionHelper.getUrlPosition();
                const rows = position.split("-");
                let emptySquares = [];

                rows.forEach((rowStr, rowIndex) => {
                    const rowArray = positionHelper.rowToSquareArray(rowStr);
                    rowArray.forEach((cell, colIndex) => {
                        if (cell === "e") {
                            const coord = renderer.squareToCoord(rowIndex, colIndex);
                            emptySquares.push(coord);
                        }
                    });
                });

                if (emptySquares.length === 0) return null;

                const randomIndex = Math.floor(Math.random() * emptySquares.length);

                move = emptySquares[randomIndex];
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        return move
    }
}