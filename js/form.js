// Store form state and notify the UI after each update.
class FormState {
    constructor(onChange) {
        this.data = {
            status: "idle", // idle | pending | success | error
            message: "",
            errors: {},
        };
        this.onChange = onChange;
    }

    update(changes) {
        Object.assign(this.data, changes);
        this.onChange(this.data);
    }

    isLoading() {
        return this.data.status === "pending";
    }

    setValidation(errors) {
        this.update({ status: "idle", message: "", errors });
    }

    setFieldError(name, message) {
        const errors = { ...this.data.errors, [name]: message };
        this.setValidation(errors);
    }

    setLoading() {
        this.update({ status: "pending", message: "Sending your message…" });
    }

    setSuccess() {
        this.update({
            status: "success",
            message: "Your message was sent. Thank you!",
            errors: {},
        });
    }

    setError(message) {
        this.update({ status: "error", message });
    }
}

// Handle form events and render the state provided by FormState.
class ContactForm {
    constructor(form) {
        this.form = form;
        this.statusElement = form.querySelector("#form-status");
        this.submitButton = form.querySelector('button[type="submit"]');
        this.submitButtonLabel = this.submitButton.textContent;
        this.fields = ["name", "email", "message"].map((name) => ({
            name,
            input: form.querySelector(`#${name}-input`),
            error: form.querySelector(`#${name}-error`),
        }));

        this.state = new FormState(() => this.render());
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleSubmit();
        });

        this.fields.forEach((field) => {
            field.input.addEventListener("input", () => {
                this.handleInput(field);
            });
        });
    }

    handleInput(field) {
        if (this.state.isLoading()) return;

        const error = this.validateField(field);
        this.state.setFieldError(field.name, error);
    }

    getValues() {
        const values = {};
        this.fields.forEach(({ name, input }) => {
            values[name] = input.value.trim();
        });
        return values;
    }

    validateField({ name, input }) {
        if (input.value.trim() === "") {
            const requiredMessages = {
                name: "Please enter your name.",
                email: "Please enter your email.",
                message: "Please enter a message.",
            };
            return requiredMessages[name];
        }

        if (name === "email" && input.validity.typeMismatch) {
            return "Please enter a valid email address.";
        }
        return "";
    }

    validate() {
        const errors = {};
        this.fields.forEach((field) => {
            errors[field.name] = this.validateField(field);
        });
        return errors;
    }

    render() {
        const data = this.state.data;
        const pending = this.state.isLoading();

        this.fields.forEach(({ name, input, error }) => {
            const message = data.errors[name] || "";
            input.disabled = pending;
            input.classList.toggle("invalid", message !== "");
            error.textContent = message;
        });

        this.submitButton.disabled = pending;
        this.submitButton.textContent = pending ? "Sending…" : this.submitButtonLabel;
        this.statusElement.dataset.state = data.status;
        this.statusElement.textContent = data.message;
    }

    async handleSubmit() {
        if (this.state.isLoading()) return;

        const errors = this.validate();
        this.state.setValidation(errors);

        const firstInvalidField = this.fields.find((field) => errors[field.name]);
        if (firstInvalidField) {
            firstInvalidField.input.focus();
            return;
        }

        await this.send(this.getValues());
    }

    async send(values) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        this.state.setLoading();

        try {
            await sendContactEmail(values, controller.signal);

            this.form.reset();
            this.state.setSuccess();
        } catch (error) {
            const message = error.name === "AbortError"
                ? "Delivery could not be confirmed in time. Please try again later."
                : error instanceof TypeError
                    ? "Could not connect. Your input is still here; please try again."
                    : error.message;
            this.state.setError(message);
        } finally {
            window.clearTimeout(timeout);
        }
    }
}

const contactForm = new ContactForm(document.querySelector("#contact-form"));
