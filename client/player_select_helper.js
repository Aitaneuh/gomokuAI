import Renderer from "./renderer.js"

export default class PlayerSelectHelper {
    constructor() {
        this.blackPlayerSelect = document.getElementById("black-player-type")
        this.whitePlayerSelect = document.getElementById("white-player-type")
    }

    addSelectEventListener() {
        const renderer = new Renderer()
        this.blackPlayerSelect.addEventListener("click", (event) => {
            renderer.handleAnalysisTabs()
        });
        this.whitePlayerSelect.addEventListener("click", (event) => {
            renderer.handleAnalysisTabs()
        });
    }

    getPlayers() {
        return [this.blackPlayerSelect.value, this.whitePlayerSelect.value];
    }
}