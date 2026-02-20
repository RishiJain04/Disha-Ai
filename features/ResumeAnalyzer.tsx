import React, { useState } from 'react';
import { analyzeResume } from '../services/Services';
import { ResumeAnalysis } from '../types';
import { FileText, Search, AlertCircle, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';

export const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [role, setRole] = useState('');
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText || !role) return;
    setLoading(true);
    try {
      const data = await analyzeResume(resumeText, role);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="space-y-4 flex flex-col h-full">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex-none">
          <div className="flex items-center gap-3 mb-4 text-indigo-700">
            <FileText size={28} />
            <h2 className="text-xl font-bold text-slate-800">Resume Scanner</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">Paste your resume text below to get instant ATS and content feedback.</p>
          
          <div className="space-y-3">
             <div>
                <label className="text-sm font-medium text-slate-700">Target Role</label>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Product Manager"
                    className="w-full mt-1 p-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>
             <div className="flex-1">
                 <label className="text-sm font-medium text-slate-700">Resume Content</label>
                 <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume text here..."
                    className="w-full mt-1 h-64 p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-xs"
                />
             </div>
             <button
                onClick={handleAnalyze}
                disabled={loading || !resumeText || !role}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Analyze Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex flex-col h-full">
         {result ? (
            <div className="space-y-6 animate-fade-in">
                {/* Score Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">ATS Score</h3>
                        <p className="text-sm text-slate-500">Based on relevance & format</p>
                    </div>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                            <circle cx="40" cy="40" r="36" stroke={result.score > 70 ? "#10b981" : result.score > 40 ? "#f59e0b" : "#ef4444"} strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset={226 - (226 * result.score) / 100} />
                         </svg>
                         <span className="absolute text-xl font-bold text-slate-800">{result.score}</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Search size={18} /> Analysis Summary</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{result.summary}</p>
                </div>

                {/* Improvements */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} /> Recommended Improvements</h4>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {result.improvements.map((imp, idx) => (
                            <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="text-xs text-red-500 font-semibold mb-1 flex items-center gap-1">
                                    <AlertCircle size={12} /> Original / Issue
                                </div>
                                <p className="text-sm text-slate-500 line-through mb-2 opacity-80">{imp.original}</p>
                                
                                <div className="text-xs text-green-600 font-semibold mb-1 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Suggestion
                                </div>
                                <p className="text-sm text-slate-800 font-medium mb-2">{imp.suggestion}</p>
                                
                                <p className="text-xs text-slate-400 italic">Why? {imp.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
         ) : (
             <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                 <FileText size={48} className="mb-4 opacity-20" />
                 <p className="text-lg font-medium">No analysis yet</p>
                 <p className="text-sm">Submit your resume to see actionable feedback here.</p>
             </div>
         )}
      </div>
    </div>
  );
};
