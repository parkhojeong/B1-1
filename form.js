// Validate each field as the user types and validate the entire form on submission.
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const nameInput = document.querySelector("#name-input");
const nameError = document.querySelector("#name-error");
const emailInput = document.querySelector("#email-input");
const emailError = document.querySelector("#email-error");
const messageInput = document.querySelector("#message-input");
const messageError = document.querySelector("#message-error");
const submitButton = form.querySelector('button[type="submit"]');
const submitButtonLabel = submitButton.textContent;

const FORM_STATUS = Object.freeze({
    IDLE: "idle",
    SENDING: "sending",
    SUCCESS: "success",
    ERROR: "error",
});

const formState = {
    status: FORM_STATUS.IDLE,
    message: "",
};

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

function renderFormState() {
    const { status, message } = formState;
    const isSending = status === FORM_STATUS.SENDING;

    form.setAttribute("aria-busy", String(isSending));
    fields.forEach(({ input }) => { input.disabled = isSending; });
    submitButton.disabled = isSending;
    submitButton.textContent = isSending ? "Sending…" : submitButtonLabel;
    formStatus.dataset.state = status;
    formStatus.textContent = message;
}

function setFormState(nextState) {
    Object.assign(formState, nextState);
    renderFormState();
}

fields.forEach((field) => {
    field.input.addEventListener("input", () => {
        setFormState({
            status: FORM_STATUS.IDLE,
            message: "",
        });
        renderFieldError(field);
    });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (formState.status === FORM_STATUS.SENDING) return;

    setFormState({
        status: FORM_STATUS.IDLE,
        message: "",
    });

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

    setFormState({
        status: FORM_STATUS.SENDING,
        message: "Sending your message…",
    });

    try {
        await sendContactEmail(data);

        form.reset();
        fields.forEach(({ input }) => input.removeAttribute("aria-invalid"));
        setFormState({
            status: FORM_STATUS.SUCCESS,
            message: "Your message was sent. Thank you!",
        });
    } catch (error) {
        const message = error instanceof RequestTimeoutError
            ? "Delivery could not be confirmed in time. Please try again later."
            : error instanceof TypeError
                ? "Could not connect. Your input is still here; please try again."
                : error.message;

        setFormState({
            status: FORM_STATUS.ERROR,
            message,
        });
    }
});

renderFormState();
