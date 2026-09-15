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
let isSending = false;
const submitButton = form.querySelector('button[type="submit"]');

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

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSending) return;
    hasSubmitted = true;
    formStatus.textContent = "";
    const errors = fields.map(renderFieldError);
    const firstInvalidIndex = errors.findIndex((message) => message !== "");

    if (firstInvalidIndex !== -1) {
        fields[firstInvalidIndex].input.focus();
        return;
    }

    const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
    };
    const buttonLabel = submitButton.textContent;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    isSending = true;
    form.setAttribute("aria-busy", "true");
    fields.forEach(({ input }) => { input.disabled = true; });
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    formStatus.dataset.state = "pending";
    formStatus.textContent = "Sending your message…";

    try {
        await sendContactEmail(data, controller.signal);

        form.reset();
        hasSubmitted = false;
        fields.forEach(({ input }) => input.removeAttribute("aria-invalid"));
        formStatus.dataset.state = "success";
        formStatus.textContent = "Your message was sent. Thank you!";
    } catch (error) {
        formStatus.dataset.state = "error";
        formStatus.textContent = error.name === "AbortError"
            ? "Delivery could not be confirmed in time. Please try again later."
            : error instanceof TypeError
                ? "Could not connect. Your input is still here; please try again."
                : error.message;
    } finally {
        window.clearTimeout(timeout);
        isSending = false;
        form.setAttribute("aria-busy", "false");
        fields.forEach(({ input }) => { input.disabled = false; });
        submitButton.disabled = false;
        submitButton.textContent = buttonLabel;
    }
});
