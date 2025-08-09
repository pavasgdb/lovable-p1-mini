import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Code, Palette, Bot, Wand2 } from 'lucide-react';
import { AppPrompt, GenerationMode } from '../types';
import { savePrompt, getPrompts } from '../utils/storage';

interface HomePageProps {
  onGenerate: (prompt: string, mode: GenerationMode, images?: string[]) => void;
  isGenerating: boolean;
}

const examplePrompts = [
  "Create a task management app with dark mode and calendar integration",
  "Build a recipe sharing platform with image uploads and ratings",
  "Design a fitness tracker with workout routines and progress charts",
  "Make a budgeting app with expense categories and monthly reports"
];

const HomePage: React.FC<HomePageProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [recentPrompts, setRecentPrompts] = useState<AppPrompt[]>([]);
  const [selectedMode, setSelectedMode] = useState<GenerationMode>('mock');

  useEffect(() => {
    setRecentPrompts(getPrompts());
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    const promptData: AppPrompt = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      timestamp: Date.now(),
      mode: selectedMode
    };
    
    savePrompt(promptData);
    onGenerate(prompt.trim(), selectedMode);
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  const handleRecentPromptClick = (recentPrompt: AppPrompt) => {
    setPrompt(recentPrompt.prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered App Generation</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Your Ideas Into
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Apps</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Describe your app idea in plain English and watch it come to life. 
              Generate complete, production-ready applications in seconds.
            </p>

            {/* Main Input Section */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your app... (e.g., 'Create a task management app with team collaboration and real-time updates')"
                    className="w-full h-32 p-6 text-lg border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/90"
                    disabled={isGenerating}
                  />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-sm text-gray-500">
                    <Code className="w-4 h-4" />
                    <span>{prompt.length}/500</span>
                  </div>
                </div>

                {/* Generation Mode Selection */}
                <div className="mt-6 mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Generation Mode</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedMode('mock')}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedMode === 'mock'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      disabled={isGenerating}
                    >
                      <Wand2 className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Mock Generate</p>
                        <p className="text-xs opacity-75">Fast prototype generation</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setSelectedMode('ai')}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        selectedMode === 'ai'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      disabled={isGenerating}
                    >
                      <Bot className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">AI Generate</p>
                        <p className="text-xs opacity-75">Smart code generation</p>
                      </div>
                    </button>
                  </div>
                </div>

                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className={`w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                    prompt.trim() && !isGenerating
                      ? selectedMode === 'ai' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{selectedMode === 'ai' ? 'AI Generating...' : 'Generating Your App...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {selectedMode === 'ai' ? <Bot className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      <span>{selectedMode === 'ai' ? 'Generate with AI' : 'Generate App'}</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Production Ready</h3>
            <p className="text-gray-600">Generated apps include complete source code, dependencies, and deployment configs.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Theming</h3>
            <p className="text-gray-600">Automatically extracts and applies cohesive color schemes and design patterns.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Powered</h3>
            <p className="text-gray-600">Advanced AI understands context and generates appropriate functionality and UI.</p>
          </motion.div>
        </div>

        {/* Example Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Try These Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/80 hover:border-blue-200 transition-all duration-200 group"
                disabled={isGenerating}
              >
                <p className="text-gray-700 group-hover:text-gray-900">"{example}"</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Prompts */}
        {recentPrompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Recent Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {recentPrompts.slice(0, 6).map((recentPrompt) => (
                <button
                  key={recentPrompt.id}
                  onClick={() => handleRecentPromptClick(recentPrompt)}
                  className="text-left p-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/80 hover:border-purple-200 transition-all duration-200 group"
                  disabled={isGenerating}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {recentPrompt.mode === 'ai' ? (
                      <Bot className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Wand2 className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {recentPrompt.mode === 'ai' ? 'AI Generated' : 'Mock Generated'}
                    </span>
                  </div>
                  <p className="text-gray-700 group-hover:text-gray-900 line-clamp-2">
                    "{recentPrompt.prompt}"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(recentPrompt.timestamp).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;