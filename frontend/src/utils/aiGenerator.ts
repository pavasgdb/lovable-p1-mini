import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedApp, AppFile } from '../types';

// Backend API configuration
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000';

const generateThemeColors = (prompt: string): string[] => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Generate theme colors based on app type
  if (lowerPrompt.includes('health') || lowerPrompt.includes('fitness')) {
    return ['#10B981', '#059669', '#D1FAE5', '#34D399'];
  } else if (lowerPrompt.includes('finance') || lowerPrompt.includes('budget')) {
    return ['#3B82F6', '#1E40AF', '#DBEAFE', '#60A5FA'];
  } else if (lowerPrompt.includes('food') || lowerPrompt.includes('recipe')) {
    return ['#F59E0B', '#D97706', '#FEF3C7', '#FBBF24'];
  } else if (lowerPrompt.includes('social') || lowerPrompt.includes('chat')) {
    return ['#8B5CF6', '#7C3AED', '#EDE9FE', '#A78BFA'];
  } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop')) {
    return ['#EF4444', '#DC2626', '#FEE2E2', '#F87171'];
  } else {
    return ['#6366F1', '#4F46E5', '#E0E7FF', '#818CF8'];
  }
};

const extractAppName = (prompt: string): string => {
  const patterns = [
    /(?:app|application) (?:called|named) ([a-zA-Z\s]+)/i,
    /(?:build|create) (?:a |an )?([a-zA-Z\s]+) app/i,
    /([a-zA-Z]+) management/i,
    /([a-zA-Z]+) tracker/i
  ];
  
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match) {
      return match[1].trim().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  // Fallback name generation
  if (prompt.toLowerCase().includes('task')) return 'TaskMaster';
  if (prompt.toLowerCase().includes('social')) return 'SocialHub';
  if (prompt.toLowerCase().includes('shop')) return 'ShopEasy';
  if (prompt.toLowerCase().includes('fitness')) return 'FitTracker';
  if (prompt.toLowerCase().includes('recipe')) return 'RecipeBox';
  if (prompt.toLowerCase().includes('budget')) return 'BudgetWise';
  
  return 'MyApp';
};

const generateAppDescription = (prompt: string, appName: string): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('task') || lowerPrompt.includes('todo')) {
    return `${appName} is a powerful task management application that helps you organize, prioritize, and track your daily activities with ease.`;
  } else if (lowerPrompt.includes('social')) {
    return `${appName} is a modern social networking platform that connects people through shared interests and meaningful conversations.`;
  } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop')) {
    return `${appName} is a comprehensive e-commerce platform offering a seamless shopping experience with advanced product discovery.`;
  } else if (lowerPrompt.includes('fitness')) {
    return `${appName} is a comprehensive fitness tracking application that monitors your workouts, progress, and health metrics.`;
  } else if (lowerPrompt.includes('recipe')) {
    return `${appName} is a culinary companion that helps you discover, save, and share amazing recipes from around the world.`;
  } else if (lowerPrompt.includes('budget') || lowerPrompt.includes('finance')) {
    return `${appName} is a smart financial management tool that helps you track expenses, manage budgets, and achieve your financial goals.`;
  }
  
  return `${appName} is a modern application designed to solve your specific needs with an intuitive and powerful interface.`;
};

const readFilesFromDirectory = async (folderPath: string): Promise<AppFile[]> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/read-files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder_path: folderPath }),
    });

    if (!response.ok) {
      throw new Error(`Failed to read files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files.map((file: any) => ({
      name: file.name,
      path: file.path,
      content: file.content,
      type: getFileType(file.name)
    }));
  } catch (error) {
    console.error('Error reading files from directory:', error);
    throw error;
  }
};

const getFileType = (fileName: string): 'component' | 'page' | 'style' | 'config' => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const lowerName = fileName.toLowerCase();
  
  if (extension === 'css' || extension === 'scss' || extension === 'less') {
    return 'style';
  } else if (extension === 'json' || lowerName.includes('config') || lowerName.includes('package')) {
    return 'config';
  } else if (lowerName.includes('page') || lowerName.includes('route')) {
    return 'page';
  } else {
    return 'component';
  }
};

export const generateAppWithAI = async (prompt: string): Promise<GeneratedApp> => {
  try {
    // Call Python backend to generate code
    const response = await fetch(`${BACKEND_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: prompt,
        mode: 'ai'
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();
    const folderPath = data.folder_path;

    if (!folderPath) {
      throw new Error('No folder path returned from backend');
    }

    // Read all files from the generated folder
    const aiFiles = await readFilesFromDirectory(folderPath);
    
    const appName = extractAppName(prompt);
    const themeColors = generateThemeColors(prompt);
    
    return {
      id: Date.now().toString(),
      name: appName,
      description: generateAppDescription(prompt, appName),
      prompt,
      themeColors,
      files: aiFiles,
      timestamp: Date.now(),
      mode: 'ai'
    };
    
  } catch (error) {
    console.error('Backend AI generation failed:', error);
    // Fallback to mock generation if AI fails
    return generateFallbackApp(prompt);
  }
};

const generateFallbackFiles = (prompt: string): AppFile[] => {
  const appName = extractAppName(prompt);
  const isTaskApp = prompt.toLowerCase().includes('task') || prompt.toLowerCase().includes('todo');
  const isSocialApp = prompt.toLowerCase().includes('social') || prompt.toLowerCase().includes('chat');
  
  if (isTaskApp) {
    return [
      {
        name: 'App.tsx',
        path: 'src/App.tsx',
        type: 'component',
        content: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskDashboard from './components/TaskDashboard';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<TaskDashboard />} />
          <Route path="/new-task" element={<TaskForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;`
      },
      {
        name: 'TaskDashboard.tsx',
        path: 'src/components/TaskDashboard.tsx',
        type: 'component',
        content: `import React, { useState } from 'react';
import { Plus, CheckSquare, Clock, Filter } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review project proposal', completed: false, priority: 'high', dueDate: '2024-01-15' },
    { id: '2', title: 'Update documentation', completed: true, priority: 'medium', dueDate: '2024-01-14' },
    { id: '3', title: 'Schedule team meeting', completed: false, priority: 'low', dueDate: '2024-01-16' }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">${appName}</h1>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <button onClick={() => toggleTask(task.id)}>
                <CheckSquare className={\`w-5 h-5 \${task.completed ? 'text-green-500' : 'text-gray-400'}\`} />
              </button>
              <div className="flex-1">
                <p className={\`font-medium \${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}\`}>
                  {task.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={\`px-2 py-1 text-xs rounded-full \${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }\`}>
                    {task.priority}
                  </span>
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;`
      },
      {
        name: 'types.ts',
        path: 'src/types.ts',
        type: 'config',
        content: `export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}`
      }
    ];
  }
  
  // Default fallback files
  return [
    {
      name: 'App.tsx',
      path: 'src/App.tsx',
      type: 'component',
      content: `import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
}

export default App;`
    },
    {
      name: 'Dashboard.tsx',
      path: 'src/components/Dashboard.tsx',
      type: 'component',
      content: `import React from 'react';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">${appName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">12,345</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45,678</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activity</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Analytics</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to ${appName}</h2>
        <p className="text-gray-600">
          This is your personalized dashboard. Here you can manage all aspects of your application
          and monitor key metrics in real-time.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;`
    }
  ];
};

const generateFallbackApp = (prompt: string): GeneratedApp => {
  const appName = extractAppName(prompt);
  const themeColors = generateThemeColors(prompt);
  
  return {
    id: Date.now().toString(),
    name: appName,
    description: generateAppDescription(prompt, appName),
    prompt,
    themeColors,
    files: generateFallbackFiles(prompt),
    timestamp: Date.now(),
    mode: 'ai'
  };
};