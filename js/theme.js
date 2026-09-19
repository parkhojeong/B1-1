// Use the saved preference when available, otherwise follow the system theme.
class ThemeToggle {
    constructor(button) {
        this.button = button;
        this.root = document.documentElement;
        this.systemQuery = window.matchMedia("(prefers-color-scheme: dark)");
        this.preference = this.readPreference();
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.button.addEventListener("click", () => this.toggle());
        this.systemQuery.addEventListener("change", () => this.render());
    }

    readPreference() {
        try {
            const saved = localStorage.getItem("theme");
            return ["dark", "light"].includes(saved) ? saved : null;
        } catch {
            return null;
        }
    }

    savePreference() {
        try {
            localStorage.setItem("theme", this.preference);
        } catch {
            // Theme switching still works when storage is unavailable.
        }
    }

    getTheme() {
        return this.preference || (this.systemQuery.matches ? "dark" : "light");
    }

    setPreference(theme) {
        this.preference = theme;
        this.savePreference();
        this.render();
    }

    toggle() {
        const nextTheme = this.getTheme() === "dark" ? "light" : "dark";
        this.setPreference(nextTheme);
    }

    render() {
        const theme = this.getTheme();
        this.root.dataset.theme = theme;
        this.button.classList.toggle("active", theme === "dark");
    }
}

const themeToggle = new ThemeToggle(document.querySelector("#theme-toggle"));
