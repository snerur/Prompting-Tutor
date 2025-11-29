import React, { useState } from 'react';
import { LESSONS } from '../constants';
import { ChevronRight, Lightbulb, Play } from 'lucide-react';

interface LearnModuleProps {
  onTryPrompt: (prompt: string) => void;
}

const LearnModule: React.FC<LearnModuleProps> = ({ onTryPrompt }) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);

  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Prompt Academy</h1>
        <p className="text-gray-400 mt-2 text-lg">Master the linguistic keys to unlock AI potential.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Curriculum List */}
        <div className="lg:col-span-4 space-y-3">
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group
                ${selectedLessonId === lesson.id 
                  ? 'bg-gray-800 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                  : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                }`}
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {lesson.category}
                </div>
                <div className={`font-semibold ${selectedLessonId === lesson.id ? 'text-white' : 'text-gray-300'}`}>
                  {lesson.title}
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${selectedLessonId === lesson.id ? 'text-indigo-400 translate-x-1' : 'text-gray-600 group-hover:text-gray-400'}`} />
            </button>
          ))}
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-8">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
             {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                selectedLesson.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                selectedLesson.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {selectedLesson.difficulty}
              </span>
              <Lightbulb className="w-6 h-6 text-yellow-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">{selectedLesson.title}</h2>
            
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-4">
              {selectedLesson.content.split('\n').map((para, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ 
                  __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                 }} />
              ))}
            </div>

            <div className="mt-8 bg-black/30 rounded-xl p-5 border border-gray-700/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-gray-500 uppercase">Interactive Example</span>
                <button 
                  onClick={() => onTryPrompt(selectedLesson.examplePrompt)}
                  className="flex items-center space-x-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Try in Playground</span>
                </button>
              </div>
              <code className="block font-mono text-sm text-indigo-200 bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/20 whitespace-pre-wrap">
                {selectedLesson.examplePrompt}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnModule;
