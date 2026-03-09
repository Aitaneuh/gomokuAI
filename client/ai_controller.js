import AIAnalysisTabHelper from "./ai_analysis_tab_helper.js";
import GameEngine from "./game_engine.js";
import PositionHelper from "./position_helper.js";
import Renderer from "./renderer.js";
import AiDelayHelper from "./ai_delay_helper.js";

export default class AIController {
    async getMove(color, type) {
        const positionHelper = new PositionHelper()
        const renderer = new Renderer()
        const aiAnalysisTabHelper = new AIAnalysisTabHelper()
        const gameEngine = new GameEngine()
        const aiDelayHelper = new AiDelayHelper()
        const position = positionHelper.getUrlPosition();

        const timout = aiDelayHelper.getDelayMs()

        let move = ""
        const [blackBitboard, whiteBitboard] = positionHelper.positionToBitboards(position);
        
        if (type === "random") {
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
            aiAnalysisTabHelper.setTabStats(
                gameEngine.getCurrentPlayer(),
                0,
                0,
                0,
                0
            );

        } else if (type === "python" || type === "csharp") {
            const url = type === "python"
                ? 'http://127.0.0.1:8000/api/python/play'
                : 'http://127.0.0.1:3000/api/cs/play';

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blackBitboard: blackBitboard.toString(16),
                    whiteBitboard: whiteBitboard.toString(16)
                })
            });

            const data = await response.json();
            move = data.move;
            aiAnalysisTabHelper.setTabStats(
                gameEngine.getCurrentPlayer(),
                data.time,
                data.nodes,
                data.depth,
                data.nps
            );
        }

        await new Promise(resolve => setTimeout(resolve, timout));
        return move
    }
}