import React, { useState } from 'react';
import { AppView } from './types';
import { MessageSquare, Map, BrainCircuit, FileText, GraduationCap, LayoutDashboard, Menu, X } from 'lucide-react';

import { ChatAssistant } from './features/ChatAssistant';
import { RoadmapGenerator } from './features/RoadmapGenerator';
import { MockInterview } from './features/MockInterview';
import { ResumeAnalyzer } from './features/ResumeAnalyzer';
import { CourseRecommender } from './features/CourseRecommender';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.CHAT);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: AppView.CHAT, label: 'Career Chat', icon: <MessageSquare size={20} /> },
    { id: AppView.ROADMAP, label: 'Roadmap', icon: <Map size={20} /> },
    { id: AppView.INTERVIEW, label: 'Mock Interview', icon: <BrainCircuit size={20} /> },
    { id: AppView.RESUME, label: 'Resume Check', icon: <FileText size={20} /> },
    { id: AppView.COURSES, label: 'Courses', icon: <GraduationCap size={20} /> },
  ];

  const renderContent = () => {
    switch (view) {
      case AppView.CHAT: return <ChatAssistant />;
      case AppView.ROADMAP: return <RoadmapGenerator />;
      case AppView.INTERVIEW: return <MockInterview />;
      case AppView.RESUME: return <ResumeAnalyzer />;
      case AppView.COURSES: return <CourseRecommender />;
      default: return <ChatAssistant />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold text-indigo-700">
          <LayoutDashboard /> Disha AI
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-700">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Disha</h1>
            <p className="text-xs text-slate-500">AI Career Coach</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${view === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="text-xs text-slate-500 text-center">
            &copy; 2026 Disha AI
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-65px)] md:h-screen overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
          <header className="mb-8 hidden md:block">
            <h2 className="text-3xl font-bold text-slate-800">
              {navItems.find(i => i.id === view)?.label}
            </h2>
            <p className="text-slate-500">
              {view === AppView.CHAT && "Your personal AI career guide, available 24/7."}
              {view === AppView.ROADMAP && "Visualize your path to success step-by-step."}
              {view === AppView.INTERVIEW && "Practice makes perfect. Test your knowledge."}
              {view === AppView.RESUME && "Optimize your resume for the ATS and recruiters."}
              {view === AppView.COURSES && "Curated learning resources just for you."}
            </p>
          </header>
          {renderContent()}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;