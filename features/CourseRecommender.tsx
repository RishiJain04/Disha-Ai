import React, { useState } from 'react';
import { recommendCourses } from '../services/Services';
import { CourseRecommendation } from '../types';
import { GraduationCap, ExternalLink, Star, PlayCircle, Layers, Loader2 } from 'lucide-react';

export const CourseRecommender: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [gap, setGap] = useState('');
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setLoading(true);
    try {
      const data = await recommendCourses(goal, gap);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
       <div className="bg-gradient-to-r from-indigo-800 to-violet-900 p-8 rounded-2xl shadow-xl text-white">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <GraduationCap className="text-yellow-400" /> 
                        Skill Accelerator
                    </h2>
                    <p className="text-indigo-200">Find the perfect courses to bridge your skill gaps.</p>
                </div>
                <form onSubmit={handleSearch} className="flex-1 w-full max-w-md bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="I want to learn... (e.g. Python, Digital Marketing)"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-white text-slate-900 placeholder:text-slate-500 p-2 rounded-lg text-sm focus:outline-none"
                            required
                        />
                         <input
                            type="text"
                            placeholder="My weak area is... (optional)"
                            value={gap}
                            onChange={(e) => setGap(e.target.value)}
                            className="w-full bg-white text-slate-900 placeholder:text-slate-500 p-2 rounded-lg text-sm focus:outline-none"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 text-indigo-900 font-bold py-2 rounded-lg hover:bg-yellow-300 transition-colors flex justify-center items-center gap-2"
                        >
                             {loading ? <Loader2 className="animate-spin" size={16} /> : 'Find Courses'}
                        </button>
                    </div>
                </form>
           </div>
       </div>

       {courses.length > 0 && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                        <div className={`h-2 w-full ${course.isFree ? 'bg-green-500' : 'bg-purple-500'}`} />
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${course.isFree ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {course.isFree ? 'FREE' : 'PAID'}
                                </span>
                                <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    <Layers size={12} /> {course.level}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2">{course.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                <PlayCircle size={14} /> {course.platform}
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-4 flex-1">{course.reason}</p>
                            
                            <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center text-xs text-slate-400">
                                <span>Duration: {course.duration}</span>
                                <button className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                                    View <ExternalLink size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
           </div>
       )}
    </div>
  );
};
