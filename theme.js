// Update the theme's CSS variables and the toggle button state together.
const html = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const THEME_MODE = Object.freeze({
    LIGHT: "light",
    DARK: "dark",
});

function getInitialTheme() {
    try {
        const savedTheme = localStorage.getItem("theme");

        if ([THEME_MODE.DARK, THEME_MODE.LIGHT].includes(savedTheme)) {
            return savedTheme;
        }
    } catch {
        // Fall back to the system theme when storage is unavailable.
    }

    return systemPrefersDark ? THEME_MODE.DARK : THEME_MODE.LIGHT;
}

const themeState = {
    mode: getInitialTheme(),
};

function renderTheme() {
    html.dataset.theme = themeState.mode;
    themeButton.setAttribute("aria-pressed", String(themeState.mode === THEME_MODE.DARK));
}

function setThemeState(nextState) {
    Object.assign(themeState, nextState);
    renderTheme();
}

themeButton.addEventListener("click", () => {
    const nextTheme = themeState.mode === THEME_MODE.DARK
        ? THEME_MODE.LIGHT
        : THEME_MODE.DARK;

    setThemeState({ mode: nextTheme });

    try {
        localStorage.setItem("theme", nextTheme);
    } catch {
        // Keep theme switching functional even when local storage is unavailable.
    }
});

renderTheme();
