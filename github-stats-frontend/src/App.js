import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    console.log(`Fetching data for user: ${username}`);
    try {
      const response = await axios.get(`http://localhost:3000/api/user/${username}`);
      console.log(`Received response:`, response.data);
      setData(response.data);
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
          <p>Total Stargazers: {data.totalStargazers}</p>
          <p>Average Repository Size: {data.avgSize.toFixed(2)} KB</p>
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
