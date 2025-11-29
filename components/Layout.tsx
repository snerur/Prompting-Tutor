import React from 'react';
import { APP_SECTIONS } from '../constants';

interface LayoutProps {
  activeSection: string;
  setActiveSection: (id: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeSection, setActiveSection, children }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-800">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">P</span>
          </div>
          <span className="ml-3 font-bold text-xl hidden lg:block tracking-tight">PromptQuest</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2">
          {APP_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-600/10 text-indigo-400' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                  }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className={`ml-3 font-medium hidden lg:block ${isActive ? 'text-indigo-300' : ''}`}>
                  {section.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 hidden lg:block shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500 text-center lg:text-left">
            <p className="hidden lg:block">Powered by Gemini 2.5</p>
            <p className="lg:hidden">v2.5</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
           {children}
        </div>
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>
      </main>
    </div>
  );
};

export default Layout;
