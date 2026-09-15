const retryButton = document.getElementById("retry");
const statusMessage = document.getElementById("projects-status");
const projectList = document.getElementById("projects-list");

const hideRetryButton = () => retryButton.classList.add("hidden");
const showRetryButton = () => retryButton.classList.remove("hidden");

// Escape repository names and descriptions so they are displayed as text, not parsed as HTML.
const escapeHTML = (value) => {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
};

async function initProjects() {
    hideRetryButton();
    statusMessage.textContent = "Loading projects…";
    projectList.setAttribute("aria-busy", "true");
    projectList.replaceChildren();

    try {
        const repos = await getRepositories("parkhojeong");
        statusMessage.textContent = repos.length > 0 ? "" : "No projects found.";

        const template = repos.slice(0, 10).map((repo) => {
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
        projectList.innerHTML = template;
    } catch (error) {
        statusMessage.textContent = "Could not load projects. Please try again.";
        showRetryButton();
    } finally {
        projectList.setAttribute("aria-busy", "false");
    }
}

retryButton.addEventListener("click", initProjects);
initProjects();
