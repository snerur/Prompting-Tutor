import React, { useState } from 'react';
import { TEMPLATES } from '../constants';
import { PromptTemplate } from '../types';
import { Copy, Check, Play, Filter } from 'lucide-react';

interface TemplateLibraryProps {
    onTryTemplate: (text: string) => void;
}

const INDUSTRIES = ['All', 'Healthcare', 'Retail', 'Finance', 'Accounting'];

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onTryTemplate }) => {
  const [filter, setFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = filter === 'All' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.industry === filter);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
       <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Prompt Library</h1>
           <p className="text-gray-400 mt-1">Battle-tested templates for professional workflows.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-800/50 p-1.5 rounded-xl border border-gray-700/50">
            {INDUSTRIES.map(industry => (
                <button
                    key={industry}
                    onClick={() => setFilter(industry)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${filter === industry 
                            ? 'bg-gray-700 text-white shadow-sm' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                >
                    {industry}
                </button>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col group hover:border-indigo-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                            {template.industry}
                        </div>
                        <h3 className="text-xl font-bold text-white">{template.title}</h3>
                    </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                
                <div className="flex-1 bg-black/40 rounded-xl p-4 border border-gray-700/50 mb-4 relative overflow-hidden">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono relative z-10">
                        {template.template}
                    </pre>
                    {/* Variable Highlight Overlay could go here */}
                </div>

                <div className="flex space-x-3 mt-auto">
                    <button
                        onClick={() => onTryTemplate(template.template)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-colors"
                    >
                        <Play className="w-4 h-4" />
                        <span>Open in Playground</span>
                    </button>
                    <button
                        onClick={() => handleCopy(template.template, template.id)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-xl transition-colors border border-gray-600"
                        title="Copy to clipboard"
                    >
                        {copiedId === template.id ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
