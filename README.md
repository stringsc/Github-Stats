# GitHub User Stats App

A web application built with React and Express.js to fetch and display GitHub user statistics.

## Overview

This project consists of a frontend React application for the user interface and a backend Express.js server to fetch data from the GitHub API. Users can enter a GitHub username, and the app will retrieve information such as the total number of repositories, total stars, total forks, and the languages used in those repositories.

## Tech Stack

- **Frontend**:
  - React: A JavaScript library for building user interfaces.
  - CSS: Styling the user interface.
  
- **Backend**:
  - Express.js: A web application framework for Node.js.
  - Node-fetch: A lightweight module that brings window.fetch to Node.js.
  
## Key Features

- Input field to enter GitHub username.
- Fetches and displays user statistics including total repositories, total forks, and languages used.
- Error handling for invalid usernames or failed API requests.
- Clickable languages to display a message when clicked.

## Getting Started

### Prerequisites

- Node.js installed on your local machine.

### Installation

1. Clone the repository:
   ```bash
   https://github.com/stringsc/Github-Stats.git

2. Navigate to the program directory:
   ```bash
   cd github-stats

3. Install dependencies for both the frontend and backend:
   ```bash
   npm install

### Running the Application

1. Start the backend server:
   ```bash
   node index.js
   
2. Start the frontend React app:
   ```bash
   npm start 

2. Open your browswe and navigate to http://localhost:3000 to view the app

### Deployment

You can deploy the Github Stats App to Vercel or any other housing platform. Remember to build the aoo before deployment.
 ```bash
   npm run build 


