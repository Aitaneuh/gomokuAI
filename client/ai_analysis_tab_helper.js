export default class AIAnalysisTabHelper {
    constructor() {
        this.blackTab = document.getElementById("ai-tab-black")
        this.blackTime = document.getElementById("resTimeValB");
        this.blackNodes = document.getElementById("resCountValB");
        this.blackDepth = document.getElementById("depthValB");
        this.blackNPS = document.getElementById("speedValB");

        this.whiteTab = document.getElementById("ai-tab-white")
        this.whiteTime = document.getElementById("resTimeValW");
        this.whiteNodes = document.getElementById("resCountValW");
        this.whiteDepth = document.getElementById("depthValW");
        this.whiteNPS = document.getElementById("speedValW");
    }

    setTabVisibility(color, visible) {
        let visibility = visible ? "flex" : "none";
        if (color == "black") {
            this.blackTab.style.display = visibility;
        } else if (color == "white") {
            this.whiteTab.style.display = visibility;
        } else { return }
    }

    setTabStats(color, time, nodes, depth, nps) {
        time = time.toFixed(2)
        nps = nps.toLocaleString("fr-CH")
        nodes = nodes.toLocaleString("fr-CH")
        if (color == "b") {
            this.blackTime.textContent = time
            this.blackNodes.textContent = nodes
            this.blackDepth.textContent = depth
            this.blackNPS.textContent = nps
        } else if (color == "w") {
            this.whiteTime.textContent = time
            this.whiteNodes.textContent = nodes
            this.whiteDepth.textContent = depth
            this.whiteNPS.textContent = nps
        } else { return }
    }

    resetTabStats() {
        this.blackTime.textContent = "-"
        this.blackNodes.textContent = "-"
        this.blackDepth.textContent = "-"
        this.blackNPS.textContent = "-"
        this.whiteTime.textContent = "-"
        this.whiteNodes.textContent = "-"
        this.whiteDepth.textContent = "-"
        this.whiteNPS.textContent = "-"
    }
}