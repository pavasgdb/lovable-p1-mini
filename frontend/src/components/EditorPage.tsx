import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Code2, Download, FolderOpen, FileText, Palette as Palette2, Settings, Copy, Check, ArrowLeft, Bot, Wand2, Users } from 'lucide-react';
import { GeneratedApp, AppFile } from '../types';
import AppMockup from './AppMockup';

interface EditorPageProps {
  app: GeneratedApp;
  onBack: () => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ app, onBack }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [selectedFile, setSelectedFile] = useState<AppFile>(app.files[0]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleExpertHelp = () => {
    // This would typically open a chat widget, modal, or redirect to a support system
    alert('Expert Help feature would connect you with a live expert to help customize your app, add features, debug issues, or provide technical guidance. This could integrate with services like Intercom, Zendesk Chat, or a custom support system.');
  };

  const getFileIcon = (file: AppFile) => {
    switch (file.type) {
      case 'component':
      case 'page':
        return <Code2 className="w-4 h-4 text-blue-500" />;
      case 'style':
        return <Palette2 className="w-4 h-4 text-purple-500" />;
      case 'config':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCopyCode = async (fileId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(fileId);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExport = () => {
    const exportData = {
      name: app.name,
      description: app.description,
      files: app.files,
      themeColors: app.themeColors,
      timestamp: app.timestamp
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.name.toLowerCase()}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Preview</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              {app.mode === 'ai' ? (
                <Bot className="w-4 h-4 text-purple-600" />
              ) : (
                <Wand2 className="w-4 h-4 text-blue-600" />
              )}
              <span className="text-sm text-gray-500 uppercase">
                {app.mode === 'ai' ? 'AI Generated' : 'Mock Generated'}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">{app.name} - Editor</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'code'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Code</span>
              </button>
            </div>
            
            <button
              onClick={handleExpertHelp}
              className="flex items-center space-x-2 px-4 py-2 border border-orange-300 text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Expert Help</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export App</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-gray-700">
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Project Files</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {app.files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    selectedFile.path === file.path
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 truncate">{file.path}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'preview' ? (
            <div className="flex-1 bg-white">
              <div className="h-full flex items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Live Preview</h3>
                  <p className="text-gray-600 mb-6">
                    Your app would appear here in a live preview environment. 
                    This would show the actual running application with full interactivity.
                  </p>
                  <div className="flex justify-center">
                    <AppMockup app={app} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-gray-900 text-gray-100">
              {/* Code Header */}
              <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(selectedFile)}
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-gray-400">{selectedFile.path}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(selectedFile.path, selectedFile.content)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  >
                    {copiedFile === selectedFile.path ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 overflow-auto">
                <pre className="p-6 text-sm">
                  <code className="text-gray-100">
                    {selectedFile.content}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;