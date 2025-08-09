import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import PreviewPage from './components/PreviewPage';
import EditorPage from './components/EditorPage';
import { GeneratedApp, ViewType, GenerationMode } from './types';
import { generateApp } from './utils/mockGenerator';
import { generateAppWithAI } from './utils/aiGenerator';
import { saveGeneratedApp } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [currentApp, setCurrentApp] = useState<GeneratedApp | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleGenerate = async (prompt: string, mode: GenerationMode, images?: string[]) => {
    setIsGenerating(true);
    try {
      const app = mode === 'ai'
        ? await generateAppWithAI(prompt)
        : await generateApp(prompt);
      setCurrentApp(app);
      saveGeneratedApp(app);
      setCurrentView('preview');
    } catch (error) {
      console.error('Failed to generate app:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentApp) return;

    setIsRegenerating(true);
    try {
      const app = currentApp.mode === 'ai'
        ? await generateAppWithAI(currentApp.prompt)
        : await generateApp(currentApp.prompt);
      setCurrentApp(app);
      saveGeneratedApp(app);
    } catch (error) {
      console.error('Failed to regenerate app:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleConfirm = () => {
    setCurrentView('editor');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentApp(null);
  };

  const handleBackToPreview = () => {
    setCurrentView('preview');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );

      case 'preview':
        return currentApp ? (
          <PreviewPage
            app={currentApp}
            onRegenerate={handleRegenerate}
            onConfirm={handleConfirm}
            onBack={handleBackToHome}
            isRegenerating={isRegenerating}
          />
        ) : (
          <Navigate to="/" replace />
        );

      case 'editor':
        return currentApp ? (
          <EditorPage
            app={currentApp}
            onBack={handleBackToPreview}
          />
        ) : (
          <Navigate to="/" replace />
        );

      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="*" element={renderCurrentView()} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;