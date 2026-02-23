import ToastHelper from "./toast_helper.js";

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
}