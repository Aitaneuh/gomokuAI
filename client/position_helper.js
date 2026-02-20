import ToastHelper from "./toast_helper.js";
const toasthelper = new ToastHelper()

export default class PositionHelper {
    getUrlPosition() {
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
                    rowArray += "e";
                }
            } else {
                rowArray += char;
            }
        }
        return rowArray;
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