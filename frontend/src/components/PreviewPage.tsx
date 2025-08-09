import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check, ArrowLeft, Palette, Smartphone, Monitor, Bot, Wand2, MessageSquare, Users } from 'lucide-react';
import { GeneratedApp } from '../types';
import AppMockup from './AppMockup';

interface PreviewPageProps {
  app: GeneratedApp;
  onRegenerate: () => void;
  onConfirm: () => void;
  onBack: () => void;
  isRegenerating: boolean;
}

const PreviewPage: React.FC<PreviewPageProps> = ({
  app,
  onRegenerate,
  onConfirm,
  onBack,
  isRegenerating
}) => {
  const handleExpertHelp = () => {
    // This would typically open a chat widget, modal, or redirect to a support system
    alert('Expert Help feature would connect you with a live expert to help build your app. This could integrate with services like Intercom, Zendesk Chat, or a custom support system.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                {app.mode === 'ai' ? (
                  <Bot className="w-5 h-5 text-purple-600" />
                ) : (
                  <Wand2 className="w-5 h-5 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-500 uppercase">
                  {app.mode === 'ai' ? 'AI Generated' : 'Mock Generated'}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
              <button
                onClick={handleExpertHelp}
                className="flex items-center space-x-2 px-4 py-2 border border-orange-300 text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Expert Help</span>
              </button>
              <button
                onClick={onConfirm}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Design</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">App Preview</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smartphone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                      <Monitor className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{app.description}</p>
              </div>
              
              <div className="p-8">
                <div className="flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AppMockup app={app} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Theme Colors */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Theme Colors</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {app.themeColors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{color}</p>
                      <p className="text-xs text-gray-500">
                        {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : index === 2 ? 'Light' : 'Accent'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* App Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">App Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm text-gray-900">{app.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Generated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(app.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Mode</p>
                  <div className="flex items-center space-x-1">
                    {app.mode === 'ai' ? (
                      <Bot className="w-3 h-3 text-purple-600" />
                    ) : (
                      <Wand2 className="w-3 h-3 text-blue-600" />
                    )}
                    <p className="text-sm text-gray-900 capitalize">{app.mode} Generated</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Files</p>
                  <p className="text-sm text-gray-900">{app.files.length} files generated</p>
                </div>
              </div>
            </div>

            {/* Original Prompt */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Prompt</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 italic">"{app.prompt}"</p>
              </div>
            </div>

            {/* Expert Help Card */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl shadow-lg border border-orange-200/50 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Get live assistance from our expert developers to customize your app, 
                add features, or solve technical challenges.
              </p>
              <button
                onClick={handleExpertHelp}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Connect with Expert</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;