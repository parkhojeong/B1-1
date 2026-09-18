// Run the entire request operation, including response-body parsing, within one timeout.
class RequestTimeoutError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "RequestTimeoutError";
        this.cause = cause;
    }
}

async function runWithTimeout(operation, timeoutMs) {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, timeoutMs);

    try {
        return await operation(controller.signal);
    } catch (error) {
        if (timedOut && error && error.name === "AbortError") {
            throw new RequestTimeoutError(`The operation timed out after ${timeoutMs}ms.`, error);
        }
        throw error;
    } finally {
        window.clearTimeout(timeoutId);
    }
}
