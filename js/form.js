// Validate the form on submission and update errors as the user types after a submit attempt.
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const nameInput = document.querySelector("#name-input");
const nameError = document.querySelector("#name-error");
const emailInput = document.querySelector("#email-input");
const emailError = document.querySelector("#email-error");
const messageInput = document.querySelector("#message-input");
const messageError = document.querySelector("#message-error");
let hasSubmitted = false;

function validateName(input) {
    return input.value.trim() === "" ? "Please enter your name." : "";
}

function validateEmail(input) {
    if (input.value.trim() === "") return "Please enter your email.";
    if (input.validity.typeMismatch) return "Please enter a valid email address.";
    return "";
}

function validateMessage(input) {
    return input.value.trim() === "" ? "Please enter a message." : "";
}

const fields = [
    { input: nameInput, error: nameError, validate: validateName },
    { input: emailInput, error: emailError, validate: validateEmail },
    { input: messageInput, error: messageError, validate: validateMessage },
];

function renderFieldError(field) {
    const message = field.validate(field.input);
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(message !== ""));
    return message;
}

fields.forEach((field) => {
    field.input.addEventListener("input", () => {
        formStatus.textContent = "";
        if (hasSubmitted) renderFieldError(field);
    });
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    hasSubmitted = true;
    formStatus.textContent = "";
    const errors = fields.map(renderFieldError);
    const firstInvalidIndex = errors.findIndex((message) => message !== "");

    if (firstInvalidIndex !== -1) {
        fields[firstInvalidIndex].input.focus();
        return;
    }

    formStatus.textContent = "Your input is valid. This is a demo; no message was sent.";
});
