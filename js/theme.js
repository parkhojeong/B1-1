// Update the theme's CSS variables and the toggle button state together.
const html = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
let themePreference = null;

function applyTheme(theme) {
    html.dataset.theme = theme;
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
}

try {
    const savedTheme = localStorage.getItem("theme");
    themePreference = ["dark", "light"].includes(savedTheme) ? savedTheme : null;
} catch {
    // Fall back to the system preference when storage is unavailable.
}

applyTheme(themePreference || (systemThemeQuery.matches ? "dark" : "light"));

// Follow system changes until the user explicitly chooses a theme.
systemThemeQuery.addEventListener("change", (event) => {
    if (themePreference === null) applyTheme(event.matches ? "dark" : "light");
});

themeButton.addEventListener("click", () => {
    const nextTheme = html.dataset.theme === "dark" ? "light" : "dark";
    themePreference = nextTheme;
    applyTheme(nextTheme);
    try {
        localStorage.setItem("theme", nextTheme);
    } catch {
        // Keep theme switching functional even when local storage is unavailable.
    }
});
