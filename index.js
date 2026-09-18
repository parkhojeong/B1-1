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
                return `<li><article>${name + " [" + (language ?? "empty") + "]"}</article></li>`
            }).slice(0, 10).join("");
        ;
        projectList.innerHTML = template
    } catch (error) {
        statusMessage.textContent = "Could not load projects. Please retry.";
        showRetryButton();
    }
}

retryButton.addEventListener("click", initProjects);
initProjects();

const form = document.querySelector("#contact-form");
nameInput = document.querySelector("#name-input");
nameError = document.querySelector("#name-error");

emailInput = document.querySelector("#email-input");
emailError = document.querySelector("#email-error");

messageInput = document.querySelector("#message-input");
messageError = document.querySelector("#message-error");


function validateName(input) {
    if(input.value.trim() === "") {
        return "input name";
    }

    return "";
}

function validateEmail(input) {
    if(input.value.trim() === "") {
        return "input email";
    }

    if(input.validity.typeMismatch) {
        return "check email type";
    }

    return "";
}

function validateMessage(input) {
    if(input.value.trim() === "") {
        return "input message";
    }

    return "";
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameErrorStr = validateName(nameInput);
    nameError.textContent = nameErrorStr;

    const emailErrorStr = validateEmail(emailInput);
    emailError.textContent = emailErrorStr;

    const messageErrorStr = validateMessage(messageInput);
    messageError.textContent = messageErrorStr;

    if(nameErrorStr) {
        nameInput.focus();
    } else if(emailErrorStr) {
        emailInput.focus();
    } else if(messageErrorStr) {
        messageInput.focus();
    }

    if(nameErrorStr || emailErrorStr || messageErrorStr) {
        return;
    }

    alert("submit")
    // todo: send email 
})

const html = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");

// 1. 페이지를 열 때 저장된 테마 복원
const savedTheme = localStorage.getItem("theme");
html.dataset.theme = savedTheme === "dark" ? "dark" : "light";

// 2. 버튼을 누르면 테마 변경 + 저장
themeButton.addEventListener("click", () => {
    const nextTheme =
        html.dataset.theme === "dark" ? "light" : "dark";

    html.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
});