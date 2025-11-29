import React, { useState } from 'react';
import Layout from './components/Layout';
import LearnModule from './components/LearnModule';
import JeopardyGame from './components/JeopardyGame';
import TemplateLibrary from './components/TemplateLibrary';
import Playground from './components/Playground';

function App() {
  const [activeSection, setActiveSection] = useState('learn');
  const [playgroundPrompt, setPlaygroundPrompt] = useState('');

  // Function to navigate to playground with pre-filled text
  const handleNavigateToPlayground = (prompt: string) => {
    setPlaygroundPrompt(prompt);
    setActiveSection('playground');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'learn':
        return <LearnModule onTryPrompt={handleNavigateToPlayground} />;
      case 'game':
        return <JeopardyGame />;
      case 'templates':
        return <TemplateLibrary onTryTemplate={handleNavigateToPlayground} />;
      case 'playground':
        return <Playground initialPrompt={playgroundPrompt} />;
      default:
        return <LearnModule onTryPrompt={handleNavigateToPlayground} />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </Layout>
  );
}

export default App;
