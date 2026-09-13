const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getRepositories(username) {
    try {
        await sleep(1000);
        if (Math.random() < 0.5) {
            throw new Error("Mock Error");
        } 

        const response = await fetch(
            // `https://api.github.com/users/${username}/repos`
            "./js/repos.json"
        );

        if(!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
            
        }

        const repos = await response.json();
        return repos;
    } catch (error) {
        console.error(error);
        throw error;
    }
}