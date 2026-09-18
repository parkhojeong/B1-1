const retryButton = document.getElementById("retry");
const statusMessage = document.getElementById("projects-status");
const projectList = document.getElementById("projects-list");
const projectFilters = document.getElementById("project-filters");

const PROJECT_STATUS = Object.freeze({
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
});

const projectState = {
    status: PROJECT_STATUS.IDLE,
    repositories: [],
    selectedLanguage: "all",
    errorMessage: "",
};

// Escape repository names and descriptions before inserting them into HTML.
const escapeHTML = (value) => {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
};

function renderProjects(repositories, selectedLanguage) {
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

function renderFilters(repositories, selectedLanguage) {
    const languages = [...new Set(repositories.map((repo) => repo.language || "Not specified"))].sort();

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

function renderProjectSection() {
    const { status, repositories, selectedLanguage, errorMessage } = projectState;
    const isLoading = status === PROJECT_STATUS.LOADING;

    projectList.setAttribute("aria-busy", String(isLoading));
    retryButton.classList.toggle("hidden", status !== PROJECT_STATUS.ERROR);

    if (isLoading) {
        projectFilters.hidden = true;
        statusMessage.textContent = "Loading projects…";
        projectList.replaceChildren();
        return;
    }

    if (status === PROJECT_STATUS.ERROR) {
        projectFilters.hidden = true;
        statusMessage.textContent = errorMessage;
        projectList.replaceChildren();
        return;
    }

    if (status === PROJECT_STATUS.SUCCESS) {
        renderFilters(repositories, selectedLanguage);
        renderProjects(repositories, selectedLanguage);
    }
}

function setProjectState(nextState) {
    Object.assign(projectState, nextState);
    renderProjectSection();
}

projectFilters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-language]");
    if (!button || !projectFilters.contains(button)) return;

    setProjectState({ selectedLanguage: button.dataset.language });
});

async function initProjects() {
    setProjectState({
        status: PROJECT_STATUS.LOADING,
        errorMessage: "",
    });

    try {
        const repositories = await getRepositories("parkhojeong");
        const languages = repositories.map((repo) => repo.language || "Not specified");
        const selectedLanguage = projectState.selectedLanguage === "all" ||
            languages.includes(projectState.selectedLanguage)
            ? projectState.selectedLanguage
            : "all";

        setProjectState({
            status: PROJECT_STATUS.SUCCESS,
            repositories,
            selectedLanguage,
        });
    } catch (error) {
        setProjectState({
            status: PROJECT_STATUS.ERROR,
            repositories: [],
            errorMessage: error.message || "Could not load projects. Please try again.",
        });
    }
}

retryButton.addEventListener("click", initProjects);
initProjects();
