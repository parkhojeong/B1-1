const retryButton = document.getElementById("retry");
const statusMessage = document.getElementById("projects-status");
const projectList = document.getElementById("projects-list");

const hideRetryButton = () => {
    retryButton.classList.add("hidden");
}

const showRetryButton = () => {
    retryButton.classList.remove('hidden');
}

async function initProjects(){
    hideRetryButton();
    statusMessage.textContent = "Loading...";
    projectList.replaceChildren();

    try {
        const repos = await getRepositories("parkhojeong");
        
        statusMessage.textContent = repos.length > 0 ? "" : "No projects found.";
        template = repos.map(repo => {
                const {name, language} = repo;
                return `<li>${name + " [" + (language ?? "empty") + "]"}</li>`
            }).slice(0, 10);
        ;
        projectList.innerHTML = template
    } catch (error) {
        statusMessage.textContent = "Could not load projects. Please retry.";
        showRetryButton();
    }
}

retryButton.addEventListener("click", initProjects);
initProjects();

nameInput = document.querySelector("#name-input");
nameError = document.querySelector("#name-error");
const form = document.querySelector("#contact");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    if(nameInput.value.trim() == ""){
        nameError.textContent = "please input name";
        nameInput.focus();
        return;
    }

    nameError.textContent = "";

    // todo: send email 
})