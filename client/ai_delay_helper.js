export default class AiDelayHelper {
    constructor() {
        this.input = document.getElementById('ai-delay-input');
        this.display = document.getElementById('delay-display');
        
        if (this.input) {
            this.input.addEventListener('input', () => {
                this.display.innerText = this.getDelay().toFixed(1);
            });
        }
    }

    getDelay() {
        return parseFloat(this.input.value) || 1.0;
    }

    getDelayMs() {
        return this.getDelay() * 1000;
    }

}