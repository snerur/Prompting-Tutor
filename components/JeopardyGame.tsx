import React, { useState } from 'react';
import { JEOPARDY_DATA } from '../constants';
import { JeopardyQuestion } from '../types';
import { judgeAnswer } from '../services/geminiService';
import { X, Trophy, AlertCircle, CheckCircle, BrainCircuit } from 'lucide-react';

const CATEGORIES = Array.from(new Set(JEOPARDY_DATA.map(q => q.category)));

const JeopardyGame: React.FC = () => {
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<JeopardyQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [judgeResult, setJudgeResult] = useState<{ correct: boolean; score: number; feedback: string } | null>(null);
  const [isJudging, setIsJudging] = useState(false);

  const handleQuestionClick = (question: JeopardyQuestion) => {
    if (!answeredIds.includes(question.id)) {
      setCurrentQuestion(question);
      setUserAnswer('');
      setJudgeResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    setIsJudging(true);
    const result = await judgeAnswer(currentQuestion.question, currentQuestion.answer, userAnswer);
    setJudgeResult(result);
    setIsJudging(false);
    
    // Update game state
    setAnsweredIds(prev => [...prev, currentQuestion.id]);
    if (result.correct) {
      setScore(prev => prev + currentQuestion.value);
    } else {
        // Optional: Deduct points? Let's keep it positive for learning.
        // setScore(prev => prev - currentQuestion.value); 
    }
  };

  const closeModal = () => {
    setCurrentQuestion(null);
    setJudgeResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 h-full flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white">Prompt Challenge</h1>
           <p className="text-gray-400">Test your engineering skills against the AI Judge.</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 px-6 py-3 rounded-2xl flex items-center space-x-4 shadow-xl">
            <div className="bg-yellow-500/20 p-2 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
                <div className="text-xs text-gray-500 uppercase font-bold">Current Score</div>
                <div className="text-2xl font-mono font-bold text-white">{score}</div>
            </div>
        </div>
      </header>

      {/* Game Board */}
      <div className="flex-1 overflow-auto">
        <div className={`grid gap-4 min-w-[800px] ${CATEGORIES.length > 3 ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {CATEGORIES.map(category => (
            <div key={category} className="space-y-4">
              <div className="text-center py-4 bg-indigo-900/40 rounded-xl border border-indigo-500/30 text-indigo-300 font-bold tracking-widest uppercase text-sm lg:text-base">
                {category}
              </div>
              {JEOPARDY_DATA.filter(q => q.category === category).map(q => {
                const isAnswered = answeredIds.includes(q.id);
                return (
                  <button
                    key={q.id}
                    disabled={isAnswered}
                    onClick={() => handleQuestionClick(q)}
                    className={`w-full aspect-[2/1] rounded-xl flex items-center justify-center text-2xl font-mono font-bold transition-all duration-300
                      ${isAnswered 
                        ? 'bg-gray-900 border border-gray-800 text-gray-700 cursor-not-allowed' 
                        : 'bg-gray-800 border border-gray-700 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105'
                      }
                    `}
                  >
                    {isAnswered ? '' : `$${q.value}`}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Question Modal */}
      {currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gray-800 p-6 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center space-x-3">
                  <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                      ${currentQuestion.value}
                  </div>
                  <span className="text-gray-400 font-medium tracking-wide uppercase">{currentQuestion.category}</span>
              </div>
              {!judgeResult && (
                  <button onClick={closeModal} className="text-gray-500 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <h3 className="text-2xl font-bold text-center text-white leading-relaxed">
                {currentQuestion.question}
              </h3>

              {!judgeResult ? (
                <div className="space-y-4">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-32 bg-black/30 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isJudging || !userAnswer.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all
                      ${isJudging || !userAnswer.trim()
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg'
                      }`}
                  >
                    {isJudging ? (
                        <>
                            <BrainCircuit className="w-5 h-5 animate-pulse" />
                            <span>AI Judge is thinking...</span>
                        </>
                    ) : (
                        <span>Lock In Answer</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                  <div className={`p-6 rounded-xl border flex items-start space-x-4
                    ${judgeResult.correct 
                        ? 'bg-green-500/10 border-green-500/30 text-green-200' 
                        : 'bg-red-500/10 border-red-500/30 text-red-200'
                    }`}>
                        {judgeResult.correct 
                            ? <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-400" />
                            : <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-400" />
                        }
                        <div>
                            <h4 className="font-bold text-lg mb-1">
                                {judgeResult.correct ? 'Correct!' : 'Incorrect'}
                            </h4>
                            <p className="opacity-90">{judgeResult.feedback}</p>
                            <div className="mt-2 text-sm font-mono opacity-70">
                                Accuracy Score: {judgeResult.score}%
                            </div>
                        </div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Official Answer:</p>
                      <p className="text-gray-300">{currentQuestion.answer}</p>
                  </div>

                  <button 
                    onClick={closeModal}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JeopardyGame;