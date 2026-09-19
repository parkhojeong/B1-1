// Keep typing state local and reserve the sentence's layout to prevent shifts.
class HeroTyping {
    constructor(element, sentence) {
        this.element = element;
        this.sentence = sentence;
        this.typedCharacters = 0;
        this.startDelay = 200;
        this.characterDelay = 40;
        this.render();
        window.setTimeout(() => this.typeNextCharacter(), this.startDelay);
    }

    isComplete() {
        return this.typedCharacters >= this.sentence.length;
    }

    typeNextCharacter() {
        if (this.isComplete()) return;
        this.typedCharacters += 1;
        this.render();

        if (!this.isComplete()) {
            window.setTimeout(() => this.typeNextCharacter(), this.characterDelay);
        }
    }

    render() {
        this.element.textContent = this.sentence.slice(0, this.typedCharacters);
        this.element.classList.toggle("is-typing", !this.isComplete());
    }
}

const heroTyping = new HeroTyping(
    document.querySelector("#hero-typing"),
    document.querySelector(".typing-reserve").textContent
);
