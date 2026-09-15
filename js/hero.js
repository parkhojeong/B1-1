// Keep the full sentence accessible and reserve its layout while typing visually.
const heroTyping = document.querySelector("#hero-typing");
const heroSentence = document.querySelector(".typing-reserve").textContent;
const typingMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let typingTimer;
let typedCharacters = 0;

function finishTyping() {
    window.clearTimeout(typingTimer);
    heroTyping.textContent = heroSentence;
    heroTyping.classList.remove("is-typing");
}

function typeNextCharacter() {
    typedCharacters += 1;
    heroTyping.textContent = heroSentence.slice(0, typedCharacters);
    if (typedCharacters < heroSentence.length) {
        typingTimer = window.setTimeout(typeNextCharacter, 40);
    } else {
        finishTyping();
    }
}

if (!typingMotionQuery.matches) {
    heroTyping.textContent = "";
    heroTyping.classList.add("is-typing");
    typingTimer = window.setTimeout(typeNextCharacter, 200);
}

typingMotionQuery.addEventListener("change", (event) => {
    if (event.matches) finishTyping();
});
