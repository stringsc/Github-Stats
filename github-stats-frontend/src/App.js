import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://api.github.com/users/${username}`);
      const result = await response.json();
      if (response.ok) {
        let page = 1;
        let repos = [];
        while (true) {
          const reposResponse = await fetch(`${result.repos_url}?page=${page}&per_page=100`);
          const newRepos = await reposResponse.json();
          if (newRepos.length === 0) break;
          repos = repos.concat(newRepos);
          page++;
        }
        const totalRepos = repos.length;
        const totalForks = repos.reduce((acc, repo) => acc + repo.forks, 0);
        let languages = repos.reduce((acc, repo) => {
          if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
          }
          return acc;
        }, {});
        languages = Object.fromEntries(
          Object.entries(languages).sort(([,a],[,b]) => b - a)
        );
        setData({ totalRepos, totalForks, languages });
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error(`Error fetching data for user: ${username}`, error);
      setError('User not found or an error occurred.');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      fetchData();
    }
  };

  const handleLanguageClick = (language) => {
    alert(`You clicked on ${language}`);
  };

  return (
    <div className="App">
      <h1>GitHub User Stats</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          required
        />
        <button type="submit">Get Stats</button>
      </form>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="stats">
          <h2>Stats for {username}</h2>
          <p>Total Repositories: {data.totalRepos}</p>
          <p>Total Forks: {data.totalForks}</p>
          <h3>Languages Used:</h3>
          <ul className="languages-list">
            {data && data.languages && Object.entries(data.languages).map(([language, count]) => (
              <li key={language} onClick={() => handleLanguageClick(language)}>{language}: {count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
