// Update the theme's CSS variables and the toggle button state together.
const html = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");

function applyTheme(theme) {
    html.dataset.theme = theme;
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
}

try {
    applyTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");
} catch {
    applyTheme("light");
}

themeButton.addEventListener("click", () => {
    const nextTheme = html.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
        localStorage.setItem("theme", nextTheme);
    } catch {
        // Keep theme switching functional even when local storage is unavailable.
    }
});
