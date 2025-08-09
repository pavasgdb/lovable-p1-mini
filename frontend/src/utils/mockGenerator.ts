import { GeneratedApp, AppFile } from '../types';

const mockApps = [
  {
    name: 'TaskFlow',
    description: 'A modern task management application',
    themeColors: ['#3B82F6', '#1E40AF', '#EFF6FF', '#DBEAFE']
  },
  {
    name: 'FoodieHub',
    description: 'Recipe sharing and meal planning app',
    themeColors: ['#F59E0B', '#D97706', '#FEF3C7', '#FDE68A']
  },
  {
    name: 'FitnessTracker',
    description: 'Personal fitness and workout tracking',
    themeColors: ['#10B981', '#059669', '#D1FAE5', '#A7F3D0']
  }
];

const generateMockFiles = (appName: string): AppFile[] => [
  {
    name: 'App.tsx',
    path: 'src/App.tsx',
    type: 'component',
    content: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;`
  },
  {
    name: 'HomePage.tsx',
    path: 'src/pages/HomePage.tsx',
    type: 'page',
    content: `import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Welcome to ${appName}</h1>
        <p>Your personalized app experience</p>
        <button className="cta-button">Get Started</button>
      </header>
    </div>
  );
};

export default HomePage;`
  },
  {
    name: 'Dashboard.tsx',
    path: 'src/pages/Dashboard.tsx',
    type: 'page',
    content: `import React, { useState } from 'react';

const Dashboard = () => {
  const [items, setItems] = useState([]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="content">
        <p>Main application content goes here</p>
      </div>
    </div>
  );
};

export default Dashboard;`
  },
  {
    name: 'App.css',
    path: 'src/App.css',
    type: 'style',
    content: `.App {
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
}

.hero {
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cta-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.dashboard {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}`
  },
  {
    name: 'package.json',
    path: 'package.json',
    type: 'config',
    content: `{
  "name": "${appName.toLowerCase()}",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`
  }
];

export const generateApp = async (prompt: string): Promise<GeneratedApp> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockApp = mockApps[Math.floor(Math.random() * mockApps.length)];
  const appName = extractAppName(prompt) || mockApp.name;
  
  return {
    id: Date.now().toString(),
    name: appName,
    description: mockApp.description,
    prompt,
    mockup: '', // No longer needed as we generate UI mockups
    themeColors: mockApp.themeColors,
    files: generateMockFiles(appName),
    timestamp: Date.now(),
    mode: 'mock'
  };
};

const extractAppName = (prompt: string): string | null => {
  const patterns = [
    /(?:app|application) (?:called|named) ([a-zA-Z]+)/i,
    /(?:build|create) (?:a |an )?([a-zA-Z]+) app/i,
    /([a-zA-Z]+) management/i,
    /([a-zA-Z]+) tracker/i
  ];
  
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
  }
  
  return null;
};