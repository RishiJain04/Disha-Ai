import React, { useState } from 'react';
import { generateInterviewQuestions } from '../services/Services';
import { Question } from '../types';
import { BrainCircuit, CheckCircle, XCircle, Clock, Award, Loader2, RefreshCcw } from 'lucide-react';

export const MockInterview: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({}); // questionId -> selectedOptionIndex
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!domain) return;
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    try {
      const qs = await generateInterviewQuestions(domain, level, 5);
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) score++;
    });
    return score;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-6 text-indigo-700">
          <BrainCircuit size={32} />
          <h2 className="text-2xl font-bold text-slate-800">Mock Interview Drill</h2>
        </div>

        {!questions.length || (submitted && questions.length > 0 && false) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Domain / Topic</label>
              <input
                type="text"
                placeholder="e.g. React.js, Project Management, SEO"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="md:col-span-3 mt-2">
              <button
                onClick={handleStart}
                disabled={loading || !domain}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Start Quiz'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
             <div>
                <span className="text-sm font-semibold text-indigo-800 uppercase block">Topic</span>
                <span className="text-lg font-bold text-indigo-900">{domain} ({level})</span>
             </div>
             {!submitted && (
                <div className="flex items-center gap-2 text-indigo-700">
                    <Clock size={20} />
                    <span className="font-mono font-medium">In Progress</span>
                </div>
             )}
              {submitted && (
                  <button onClick={() => { setQuestions([]); setDomain(''); }} className="flex items-center gap-2 text-sm text-indigo-700 font-medium hover:underline">
                      <RefreshCcw size={16} /> New Quiz
                  </button>
              )}
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, index) => {
            const isCorrect = answers[q.id] === q.correctAnswerIndex;
            const isSelected = answers[q.id] !== undefined;
            
            return (
              <div key={q.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{q.question}</h3>
                    <div className="space-y-3">
                      {q.options.map((opt, i) => {
                        let optionClass = "border-slate-200 hover:bg-slate-50";
                        if (submitted) {
                           if (i === q.correctAnswerIndex) optionClass = "bg-green-50 border-green-500 text-green-800";
                           else if (answers[q.id] === i) optionClass = "bg-red-50 border-red-500 text-red-800";
                        } else if (answers[q.id] === i) {
                            optionClass = "bg-indigo-50 border-indigo-500 text-indigo-800 ring-1 ring-indigo-500";
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleSelect(q.id, i)}
                            disabled={submitted}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center ${optionClass}`}
                          >
                            <span>{opt}</span>
                            {submitted && i === q.correctAnswerIndex && <CheckCircle size={18} className="text-green-600" />}
                            {submitted && answers[q.id] === i && i !== q.correctAnswerIndex && <XCircle size={18} className="text-red-600" />}
                          </button>
                        );
                      })}
                    </div>
                    {submitted && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-200">
                        <span className="font-semibold block mb-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {!submitted && (
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Submit Interview
            </button>
          )}

          {submitted && (
            <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-xl text-center">
              <Award size={48} className="mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-2">Interview Complete!</h3>
              <p className="text-4xl font-extrabold text-yellow-400 mb-2">
                {calculateScore()} / {questions.length}
              </p>
              <p className="text-indigo-200">
                {calculateScore() === questions.length ? 'Perfect Score! You are ready!' : 'Keep practicing to improve your skills.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
