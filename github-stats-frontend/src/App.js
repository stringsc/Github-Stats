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
      const response = await fetch(`http://api.github.com/search/${username}`);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } else {
        const errorText = await response.text();
        setError(`Invalid response format: ${errorText}`);
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
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="stats">
          <h2>Stats for {username}</h2>
          <p>Total Repositories: {data.totalRepos}</p>
          <p>Total Forks: {data.totalForks}</p>
          <h3>Languages Used:</h3>
          <ul>
            {data.languages.map((lang, index) => (
              <li key={index}>
                {lang.language}: {lang.count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
