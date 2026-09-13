const retryButton = document.getElementById("retry");
const statusMessage = document.getElementById("projects-status");
const projectList = document.getElementById("projects-list");
const projectFilters = document.getElementById("project-filters");
let repositories = [];
let selectedLanguage = "all";

const hideRetryButton = () => retryButton.classList.add("hidden");
const showRetryButton = () => retryButton.classList.remove("hidden");

// Escape repository names and descriptions before inserting them into HTML.
const escapeHTML = (value) => {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
};

function renderProjects() {
    const filtered = repositories.filter((repo) =>
        selectedLanguage === "all" || (repo.language || "Not specified") === selectedLanguage
    );
    const visible = filtered.slice(0, 10);

    projectList.innerHTML = visible.map((repo) => {
        const { name, language, description } = repo;
        const repoURL = `https://github.com/parkhojeong/${encodeURIComponent(name)}`;
        return `<li>
            <article class="project-card">
                <h3><a href="${repoURL}">${escapeHTML(name)}</a></h3>
                <p>${escapeHTML(description || "Explore this repository on GitHub.")}</p>
                <span class="language-tag">${escapeHTML(language || "Not specified")}</span>
            </article>
        </li>`;
    }).join("");

    if (repositories.length === 0) {
        statusMessage.textContent = "No projects found.";
    } else if (filtered.length === 0) {
        statusMessage.textContent = "No projects match this language. Choose another filter.";
    } else {
        const label = selectedLanguage === "all" ? "" : ` · ${selectedLanguage}`;
        statusMessage.textContent = `Showing ${visible.length} of ${filtered.length} repositories${label}.`;
    }

    projectFilters.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.language === selectedLanguage));
    });
}

function renderFilters() {
    const languages = [...new Set(repositories.map((repo) => repo.language || "Not specified"))].sort();
    if (selectedLanguage !== "all" && !languages.includes(selectedLanguage)) selectedLanguage = "all";

    const buttons = ["all", ...languages].map((language) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.language = language;
        button.textContent = language === "all" ? "All" : language;
        return button;
    });
    projectFilters.replaceChildren(...buttons);
    projectFilters.hidden = repositories.length === 0;
}

projectFilters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-language]");
    if (!button || !projectFilters.contains(button)) return;
    selectedLanguage = button.dataset.language;
    renderProjects();
});

async function initProjects() {
    hideRetryButton();
    projectFilters.hidden = true;
    statusMessage.textContent = "Loading projects…";
    projectList.setAttribute("aria-busy", "true");
    projectList.replaceChildren();

    try {
        repositories = await getRepositories("parkhojeong");
        renderFilters();
        renderProjects();
    } catch (error) {
        statusMessage.textContent = error.message || "Could not load projects. Please try again.";
        showRetryButton();
    } finally {
        projectList.setAttribute("aria-busy", "false");
    }
}

retryButton.addEventListener("click", initProjects);
initProjects();
