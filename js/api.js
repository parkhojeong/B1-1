// Load the 100 most recently updated public repositories in one request.
async function getRepositories(username) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
        const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
            {
                headers: { Accept: "application/vnd.github+json" },
                signal: controller.signal,
            }
        );

        if (response.status === 403 || response.status === 429) {
            throw new Error("GitHub has temporarily limited requests. Please try again later.");
        }
        if (!response.ok) {
            throw new Error(`Could not load projects (HTTP ${response.status}). Please try again.`);
        }

        const repos = await response.json();
        if (!Array.isArray(repos)) throw new Error("GitHub returned an unexpected response. Please try again.");
        return repos;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("The request timed out. Please try again.");
        }
        if (error instanceof TypeError) {
            throw new Error("Could not connect to GitHub. Check your connection and try again.");
        }
        throw error;
    } finally {
        window.clearTimeout(timeout);
    }
}
