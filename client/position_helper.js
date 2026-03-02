import ToastHelper from "./toast_helper.js";
import Renderer from "./renderer.js";

export default class PositionHelper {
    getUrlPosition() {
        const toasthelper = new ToastHelper()
        let params = new URLSearchParams(document.location.search);
        let position = params.get("pos");
        if (this._isPositionValid(position)) {
            return position
        }
        else {
            toasthelper.showToast("Position is invalid and was set to default.", true, 5000)
            this.setPosition("8-8-8-8-8-8-8-8")
            return "8-8-8-8-8-8-8-8"
        }
    }

    setPosition(position) {
        const newUrl = `${window.location.origin}${window.location.pathname}?pos=${position}`;

        window.history.replaceState({ path: newUrl }, '', newUrl);
    }

    rowToSquareArray(row) {
        let rowArray = []
        for (const char of row) {
            if (!isNaN(char)) {
                // empty squares
                for (let i = 0; i < parseInt(char); i++) {
                    rowArray.push("e");
                }
            } else {
                rowArray.push(char);
            }
        }
        return rowArray;
    }

    squareArrayToRow(squareArray) {
        let newRowStr = "";
        let emptyCount = 0;
        for (let cell of squareArray) {
            if (cell === "e") {
                emptyCount++;
            } else {
                if (emptyCount > 0) { newRowStr += emptyCount; emptyCount = 0; }
                newRowStr += cell;
            }
        }
        if (emptyCount > 0) newRowStr += emptyCount;
        return newRowStr;
    }

    getSquareProperty(sq) {

        if (!sq) return null;

        if (sq.firstElementChild) {
            const stone = sq.firstElementChild;

            if (stone.classList.contains("white")) {
                return "white";
            } else if (stone.classList.contains("black")) {
                return "black";
            }
        }

        return "empty";
    }

    addSquareToPosition(coord, newStoneColor) {
        let position = this.getUrlPosition();
        let rowNumber = 8 - parseInt(coord[1]);
        let positionRows = position.split("-");
        let row = positionRows[rowNumber];

        let squareArray = this.rowToSquareArray(row);
        let colIndex = "abcdefgh".indexOf(coord[0]);
        squareArray[colIndex] = newStoneColor;
        positionRows[rowNumber] = this.squareArrayToRow(squareArray)
        position = positionRows.join("-")
        return position;
    }

    _isPositionValid(position) {
        if (!position) { return false }
        const parts = position.split("-")
        if (parts.length != 8) {
            return false
        }
        for (const row of parts) {
            let rowArray = this.rowToSquareArray(row)
            if (rowArray.length != 8) {
                return false
            }
        }
        return true
    }

    checkWinner(position) {
        const renderer = new Renderer()

        let positionRows = position.split("-");
        let positionRowsArray = [[], [], [], [], [], [], [], []];
        for (let rowIndex = 0; rowIndex < positionRows.length; rowIndex++) {
            positionRowsArray[rowIndex] = this.rowToSquareArray(positionRows[rowIndex])
        }

        if (!positionRowsArray.flat().includes("e")){
            return "draw"
        }
            
        let arr = positionRowsArray // better with a short name

        // diagonnaly (from top left to bottom right)
        for (let col = 0; col <= 3; col++) {
            for (let row = 0; row <= 3; row++) {
                let p = arr[row][col];

                if (p !== "e" &&
                    p === arr[row + 1][col + 1] &&
                    p === arr[row + 2][col + 2] &&
                    p === arr[row + 3][col + 3] &&
                    p === arr[row + 4][col + 4]) {

                    return {
                        color: p, squares: [renderer.squareToCoord(row, col),
                        renderer.squareToCoord(row + 1, col + 1),
                        renderer.squareToCoord(row + 2, col + 2),
                        renderer.squareToCoord(row + 3, col + 3),
                        renderer.squareToCoord(row + 4, col + 4)]
                    };
                }
            }
        }

        // diagonnaly (from top right to bottom left)
        for (let row = 0; row <= 3; row++) {
            for (let col = 4; col <= 7; col++) {
                let p = arr[row][col];
                if (p !== "e" &&
                    p === arr[row + 1][col - 1] &&
                    p === arr[row + 2][col - 2] &&
                    p === arr[row + 3][col - 3] &&
                    p === arr[row + 4][col - 4]) {

                    return {
                        color: p, squares: [renderer.squareToCoord(row, col),
                        renderer.squareToCoord(row + 1, col - 1),
                        renderer.squareToCoord(row + 2, col - 2),
                        renderer.squareToCoord(row + 3, col - 3),
                        renderer.squareToCoord(row + 4, col - 4)]
                    };
                }
            }
        }

        // horizontal (from top left to bottom right)
        for (let row = 0; row <= 7; row++) {
            for (let col = 0; col <= 3; col++) {
                let p = arr[row][col];
                if (p !== "e" &&
                    p === arr[row][col + 1] &&
                    p === arr[row][col + 2] &&
                    p === arr[row][col + 3] &&
                    p === arr[row][col + 4]) {

                    return {
                        color: p,
                        squares: [
                            renderer.squareToCoord(row, col),
                            renderer.squareToCoord(row, col + 1),
                            renderer.squareToCoord(row, col + 2),
                            renderer.squareToCoord(row, col + 3),
                            renderer.squareToCoord(row, col + 4)
                        ]
                    };
                }
            }
        }

        // vertical (from top left to bottom right)
        for (let col = 0; col <= 7; col++) {
            for (let row = 0; row <= 3; row++) {
                let p = arr[row][col];
                if (p !== "e" &&
                    p === arr[row + 1][col] &&
                    p === arr[row + 2][col] &&
                    p === arr[row + 3][col] &&
                    p === arr[row + 4][col]) {

                    return {
                        color: p,
                        squares: [
                            renderer.squareToCoord(row, col),
                            renderer.squareToCoord(row + 1, col),
                            renderer.squareToCoord(row + 2, col),
                            renderer.squareToCoord(row + 3, col),
                            renderer.squareToCoord(row + 4, col)
                        ]
                    };
                }
            }
        }

    }

    positionToBitboards(position) {
        let positionRows = position.split("-");
        let positionRowsArray = [[], [], [], [], [], [], [], []];
        for (let rowIndex = 0; rowIndex < positionRows.length; rowIndex++) {
            // 7 - rowIndex to have 2**0 of the bitboard on a1 and not a8
            positionRowsArray[rowIndex] = this.rowToSquareArray(positionRows[7 - rowIndex])
        }
        let flatPosition = positionRowsArray.flat()
        let blackBitboard = 0n;
        let whiteBitboard = 0n;

        for (let i = 0; i < flatPosition.length; i++) {
            if (flatPosition[i] == 'b') {
                let newStone = 1n << BigInt(i)
                blackBitboard |= newStone
            } else if (flatPosition[i] == 'w') {
                let newStone = 1n << BigInt(i)
                whiteBitboard |= newStone
            }
        }

        return [blackBitboard, whiteBitboard]

    }
}