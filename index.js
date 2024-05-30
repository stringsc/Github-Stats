const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/user-stats/:username', async (req, res) => {
  const { username } = req.params;
  const userUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos`;

  try {
    // Fetch user information to ensure user exists
    let userResponse = await fetch(userUrl, { headers: { 'User-Agent': 'request' } });
    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      throw new Error(`GitHub API error: ${userResponse.status} ${userResponse.statusText} - ${errorData}`);
    }
    const userInfo = await userResponse.json();

    // Fetch repositories information
    let page = 1;
    let repos = [];
    let response;
    let data;

    do {
      response = await fetch(`${reposUrl}?per_page=100&page=${page}`, {
        headers: { 'User-Agent': 'request' }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorData}`);
      }

      data = await response.json();
      repos = repos.concat(data);
      page++;
    } while (data.length === 100);

    const totalRepos = repos.length;
    const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
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
      username: userInfo.login,
      totalRepos,
      totalForks,
      languages: sortedLanguages,
    };

    res.json(result);
  } catch (error) {
    console.error(`Error fetching data for user: ${username}`, error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
