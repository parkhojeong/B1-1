// Store project data and notify the section after each state change.
class ProjectsState {
    constructor(onChange) {
        this.data = {
            status: "idle", // idle | loading | success | error
            repositories: [],
            selectedLanguage: "all",
            message: "",
        };
        this.onChange = onChange;
    }

    update(changes) {
        Object.assign(this.data, changes);
        this.onChange();
    }

    isLoading() {
        return this.data.status === "loading";
    }

    setLoading() {
        this.update({ status: "loading", message: "Loading projects…" });
    }

    setSuccess(repositories) {
        const language = this.data.selectedLanguage;
        const hasLanguage = repositories.some((repo) =>
            (repo.language || "Not specified") === language
        );
        this.update({
            status: "success",
            repositories,
            selectedLanguage: language === "all" || hasLanguage ? language : "all",
            message: "",
        });
    }

    setError(message) {
        this.update({ status: "error", message });
    }

    selectLanguage(language) {
        this.update({ selectedLanguage: language });
    }

    getLanguages() {
        const languages = this.data.repositories.map((repo) => repo.language || "Not specified");
        return [...new Set(languages)].sort();
    }

    getFilteredRepositories() {
        const { repositories, selectedLanguage } = this.data;
        return repositories.filter((repo) =>
            selectedLanguage === "all" || (repo.language || "Not specified") === selectedLanguage
        );
    }
}

// Handle loading and filtering; render all visible changes from state.
class ProjectsSection {
    constructor(section, username) {
        this.username = username;
        this.retryButton = section.querySelector("#retry");
        this.statusElement = section.querySelector("#projects-status");
        this.list = section.querySelector("#projects-list");
        this.filters = section.querySelector("#project-filters");
        this.displayLimit = 10;
        this.renderedRepositories = null;
        this.state = new ProjectsState(() => this.render());
        this.bindEvents();
        this.load();
    }

    bindEvents() {
        this.retryButton.addEventListener("click", () => this.load());
        this.filters.addEventListener("click", (event) => this.handleFilterClick(event));
    }

    handleFilterClick(event) {
        const button = event.target.closest("button[data-language]");
        if (!button || !this.filters.contains(button)) return;
        this.state.selectLanguage(button.dataset.language);
    }

    async load() {
        if (this.state.isLoading()) return;
        this.state.setLoading();

        try {
            const repositories = await getRepositories(this.username);
            this.state.setSuccess(repositories);
        } catch (error) {
            this.state.setError(error.message || "Could not load projects. Please try again.");
        }
    }

    render() {
        const { status, message, repositories } = this.state.data;
        this.retryButton.classList.toggle("hidden", status !== "error");
        this.filters.hidden = status !== "success" || repositories.length === 0;

        if (status !== "success") {
            this.statusElement.textContent = message;
            this.list.replaceChildren();
            return;
        }

        const filtered = this.state.getFilteredRepositories();
        const visible = filtered.slice(0, this.displayLimit);
        this.renderFilters();
        this.list.innerHTML = visible.map((repo) => this.createCardHTML(repo)).join("");
        this.statusElement.textContent = this.getSummary(filtered.length, visible.length);
    }

    renderFilters() {
        const { repositories, selectedLanguage } = this.state.data;

        // Keep existing buttons during selection so keyboard focus is preserved.
        if (this.renderedRepositories !== repositories) {
            const buttons = ["all", ...this.state.getLanguages()].map((language) => {
                const button = document.createElement("button");
                button.type = "button";
                button.dataset.language = language;
                button.textContent = language === "all" ? "All" : language;
                return button;
            });
            this.filters.replaceChildren(...buttons);
            this.renderedRepositories = repositories;
        }

        this.filters.querySelectorAll("button").forEach((button) => {
            button.classList.toggle("active", button.dataset.language === selectedLanguage);
        });
    }

    getSummary(total, displayed) {
        const { repositories, selectedLanguage } = this.state.data;
        if (repositories.length === 0) return "No projects found.";
        if (total === 0) return "No projects match this language. Choose another filter.";

        const label = selectedLanguage === "all" ? "" : ` · ${selectedLanguage}`;
        return `Showing ${displayed} of ${total} repositories${label}.`;
    }

    createCardHTML({ name, language, description }) {
        const repoURL = `https://github.com/${encodeURIComponent(this.username)}/${encodeURIComponent(name)}`;
        return `<li>
            <article class="project-card">
                <h3><a href="${repoURL}">${this.escapeHTML(name)}</a></h3>
                <p>${this.escapeHTML(description || "Explore this repository on GitHub.")}</p>
                <span class="language-tag">${this.escapeHTML(language || "Not specified")}</span>
            </article>
        </li>`;
    }

    escapeHTML(value) {
        const element = document.createElement("span");
        element.textContent = value;
        return element.innerHTML;
    }
}

const projectsSection = new ProjectsSection(document.querySelector("#projects"), "parkhojeong");
