// Load the 100 most recently updated public repositories in one request.
const GITHUB_REQUEST_TIMEOUT_MS = 12000;

async function fetchGitHubRepositories(username, signal) {
    try {
        return await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
            { signal }
        );
    } catch (error) {
        // Let runWithTimeout translate an intentional abort into a timeout error.
        if (error && error.name === "AbortError") throw error;
        throw new Error("Could not connect to GitHub. Check your connection and try again.");
    }
}

function assertGitHubResponse(response) {
    if (response.status === 403) {
        throw new Error("GitHub has temporarily limited requests. Please try again later.");
    }
    if (!response.ok) {
        throw new Error(`Could not load projects (HTTP ${response.status}). Please try again.`);
    }
}

async function parseGitHubRepositories(response) {
    let repos;

    try {
        repos = await response.json();
    } catch (error) {
        // Reading the response body can also be aborted by the timeout signal.
        if (error && error.name === "AbortError") throw error;
        throw new Error("GitHub returned an unexpected response. Please try again.");
    }

    if (!Array.isArray(repos)) throw new Error("GitHub returned an unexpected response. Please try again.");
    return repos;
}

async function getRepositories(username) {
    try {
        return await runWithTimeout(async (signal) => {
            const response = await fetchGitHubRepositories(username, signal);
            assertGitHubResponse(response);
            return parseGitHubRepositories(response);
        }, GITHUB_REQUEST_TIMEOUT_MS);
    } catch (error) {
        if (error instanceof RequestTimeoutError) throw new Error("The request timed out. Please try again.");
        throw error;
    }
}
