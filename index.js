const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const baseUrl = `https://api.github.com/users/${username}/repos`;

  try {
    let page = 1;
    let repos = [];
    let response;

    do {
      response = await axios.get(`${baseUrl}?per_page=100&page=${page}`);
      repos = repos.concat(response.data);
      page++;
    } while (response.data.length === 100);

    const totalRepos = repos.length;
    const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
    const totalStargazers = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    const totalSize = repos.reduce((acc, repo) => acc + repo.size, 0);
    const avgSize = totalSize / totalRepos;
    const languageCounts = repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({ language, count }));

    const result = {
      totalRepos,
      totalForks,
      totalStargazers,
      avgSize,
      languages: sortedLanguages,
    };

    console.log(result); // Log the response

    res.json(result);
  } catch (error) {
    console.error(`Error fetching data for user: ${username}`, error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
