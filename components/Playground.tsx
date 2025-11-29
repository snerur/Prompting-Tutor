import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Eraser, Settings2, Sparkles, Mic } from 'lucide-react';

interface PlaygroundProps {
  initialPrompt?: string;
}

const Playground: React.FC<PlaygroundProps> = ({ initialPrompt = '' }) => {
  const [input, setInput] = useState(initialPrompt);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [systemInstruction, setSystemInstruction] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync prop changes to input
  useEffect(() => {
    if (initialPrompt) setInput(initialPrompt);
  }, [initialPrompt]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const currentInput = input;
    setInput(''); // Clear immediately

    try {
      const responseText = await sendMessageToGemini(currentInput, systemInstruction, isThinking);
      const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error generating response.', timestamp: Date.now(), isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header / Toolbar */}
      <div className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white">Lab</h2>
            <div className="h-4 w-[1px] bg-gray-700 mx-2" />
            <button 
                onClick={() => setIsThinking(!isThinking)}
                className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                ${isThinking 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/50' 
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
            >
                <Sparkles className="w-3 h-3" />
                <span>Chain of Thought {isThinking ? 'ON' : 'OFF'}</span>
            </button>
        </div>
        <div className="flex items-center space-x-3">
             <button 
                onClick={() => setMessages([])}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Clear Chat"
             >
                <Eraser className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-gray-800 text-indigo-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
             >
                <Settings2 className="w-5 h-5" />
             </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none pointer-events-none">
                        <Sparkles className="w-16 h-16 text-indigo-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white">Prompt Laboratory</h3>
                        <p className="max-w-md mt-2 text-gray-300">Test your prompts with Gemini. Toggle "Chain of Thought" to see enhanced reasoning.</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] lg:max-w-[70%] rounded-2xl p-4 text-sm lg:text-base whitespace-pre-wrap
                            ${msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm shadow-sm'
                            }
                            ${msg.isError ? 'border-red-500/50 bg-red-500/10 text-red-200' : ''}
                        `}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                         <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 lg:p-6 bg-gray-900 border-t border-gray-800">
                <div className="relative max-w-4xl mx-auto">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Enter your prompt here..."
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-5 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none shadow-lg h-32 lg:h-24 scrollbar-hide"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute bottom-4 right-4 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* Settings Panel (Sidebar) */}
        {showSettings && (
            <div className="w-80 border-l border-gray-800 bg-gray-900/95 backdrop-blur p-6 flex flex-col space-y-6 animate-in slide-in-from-right duration-200 absolute right-0 h-full z-30 lg:static">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white">Configuration</h3>
                    <button onClick={() => setShowSettings(false)} className="lg:hidden text-gray-500">
                        <Eraser className="w-5 h-5" /> {/* Close icon substitute */}
                    </button>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">System Instruction</label>
                    <textarea
                        value={systemInstruction}
                        onChange={(e) => setSystemInstruction(e.target.value)}
                        placeholder="You are a helpful assistant..."
                        className="w-full h-32 bg-black/20 border border-gray-700 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-600">
                        Define the model's persona or rules. This persists across the chat session context in this lab.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
