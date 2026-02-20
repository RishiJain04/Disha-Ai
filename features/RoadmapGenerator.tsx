import React, { useState } from 'react';
import { generateRoadmap } from '../services/Services';
import { RoadmapStep } from '../types';
import { Map, ArrowRight, BookOpen, Wrench, Loader2, CheckCircle2 } from 'lucide-react';

export const RoadmapGenerator: React.FC = () => {
  const [role, setRole] = useState('');
  const [background, setBackground] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !background) return;

    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      const data = await generateRoadmap(role, background);
      setRoadmap(data);
    } catch (err) {
      setError('Failed to generate roadmap. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-6 text-indigo-700">
          <Map size={32} />
          <h2 className="text-2xl font-bold text-slate-800">Career Roadmap Generator</h2>
        </div>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Target Role</label>
            <input
              type="text"
              placeholder="e.g. UX Designer, DevOps Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Current Background</label>
            <input
              type="text"
              placeholder="e.g. Final year CS Student, Marketing Pro"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? <><Loader2 className="animate-spin" /> Generating Path...</> : 'Generate Roadmap'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {roadmap && (
        <div className="relative border-l-4 border-indigo-200 ml-6 md:ml-10 space-y-10 py-4">
          {roadmap.map((step, index) => (
            <div key={index} className="relative pl-8 md:pl-12">
              <div className="absolute -left-[14px] top-0 bg-white p-1 rounded-full border-2 border-indigo-600">
                <div className="w-4 h-4 bg-indigo-600 rounded-full" />
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{step.phase}</span>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">{step.title}</h3>
                  </div>
                  <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium whitespace-nowrap w-fit">
                    {step.duration}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed">{step.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-indigo-800 font-semibold">
                      <BookOpen size={18} />
                      <h4>Skills to Master</h4>
                    </div>
                    <ul className="space-y-1">
                      {step.skills.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-indigo-900">
                          <CheckCircle2 size={14} className="mt-1 shrink-0 opacity-60" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-emerald-800 font-semibold">
                      <Wrench size={18} />
                      <h4>Tools & Tech</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {step.tools.map((tool, i) => (
                        <span key={i} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-medium border border-emerald-200">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="pl-8 md:pl-12">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg flex items-center justify-between">
               <div>
                 <h3 className="text-xl font-bold">Goal Achieved!</h3>
                 <p className="opacity-90">You are ready for the job market.</p>
               </div>
               <div className="bg-white/20 p-3 rounded-full">
                  <ArrowRight size={24} />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
