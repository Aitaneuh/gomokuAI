import AIAnalysisTabHelper from "./ai_analysis_tab_helper.js";
import GameEngine from "./game_engine.js";
import PositionHelper from "./position_helper.js";
import Renderer from "./renderer.js";

export default class AIController {
    async getMove(color, type) {
        const positionHelper = new PositionHelper()
        const renderer = new Renderer()
        const aiAnalysisTabHelper = new AIAnalysisTabHelper()
        const gameEngine = new GameEngine()
        const position = positionHelper.getUrlPosition();

        // const timout = timoutHelper.getTimeout()
        const timout = 200

        let move = ""
        switch (type) {
            case "random":
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
                aiAnalysisTabHelper.resetTabStats()
                break;

            case "python":
                const blackBitboard = positionHelper.positionToBitboards(position)[0]
                const whiteBitboard = positionHelper.positionToBitboards(position)[1]

                const response = await fetch('http://127.0.0.1:8000/api/python/play', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ blackBitboard: blackBitboard.toString(16), whiteBitboard: whiteBitboard.toString(16) })
                });

                const data = await response.json();
                move = data.move;
                aiAnalysisTabHelper.setTabStats(gameEngine.getCurrentPlayer(),data.time, data.nodes, data.depth, data.nps)
                break;
        }

        await new Promise(resolve => setTimeout(resolve, timout));
        return move
    }
}