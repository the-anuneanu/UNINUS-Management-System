import React, { useState } from 'react';
import { Plus, Briefcase, Star, MoreHorizontal, Sparkles } from 'lucide-react';
import { Candidate } from '../types';
import SmartAssistant from './SmartAssistant';
import { generateJobDescription } from '../services/geminiService';

const initialCandidates: Candidate[] = [
  { id: 'C1', name: 'Alice Cooper', role: 'Math Professor', stage: 'Applied', rating: 0 },
  { id: 'C2', name: 'Bob Marley', role: 'Music Teacher', stage: 'Interview', rating: 4 },
  { id: 'C3', name: 'Charlie Puth', role: 'Music Teacher', stage: 'Offer', rating: 5 },
  { id: 'C4', name: 'Dave Grohl', role: 'Music Teacher', stage: 'Applied', rating: 3 },
  { id: 'C5', name: 'Elon Musk', role: 'Physics Professor', stage: 'Screening', rating: 2 },
];

const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

const ModuleRecruitment = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [showJobGen, setShowJobGen] = useState(false);
  const [genRole, setGenRole] = useState('');
  const [genDept, setGenDept] = useState('');
  const [genResult, setGenResult] = useState('');
  const [generating, setGenerating] = useState(false);

  const moveCandidate = (id: string, direction: 'next' | 'prev') => {
    setCandidates(prev => prev.map(c => {
      if (c.id !== id) return c;
      const currentIndex = stages.indexOf(c.stage);
      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= stages.length) newIndex = stages.length - 1;
      // @ts-ignore
      return { ...c, stage: stages[newIndex] };
    }));
  };

  const handleGenerateJD = async () => {
    if (!genRole || !genDept) return;
    setGenerating(true);
    const text = await generateJobDescription(genRole, genDept);
    setGenResult(text);
    setGenerating(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Recruitment Pipeline</h2>
           <p className="text-sm text-slate-500">Manage candidates and job openings</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowJobGen(true)}
             className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2"
           >
             <Sparkles size={16} />
             AI Job Description
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
             <Plus size={16} />
             Add Candidate
           </button>
        </div>
      </div>

      {/* AI Modal for Job Description */}
      {showJobGen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold mb-4">Generate Job Description</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Role Title</label>
                <input 
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={genRole} 
                  onChange={e => setGenRole(e.target.value)} 
                  placeholder="e.g. Senior Lecturer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Department</label>
                <input 
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={genDept} 
                  onChange={e => setGenDept(e.target.value)} 
                  placeholder="e.g. History"
                />
              </div>
              {genResult && (
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {genResult}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowJobGen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Close</button>
              <button 
                onClick={handleGenerateJD}
                disabled={generating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-[1000px]">
          {stages.map(stage => {
            const stageCandidates = candidates.filter(c => c.stage === stage);
            return (
              <div key={stage} className="flex-1 flex flex-col min-w-[280px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="font-semibold text-slate-700">{stage}</h4>
                  <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{stageCandidates.length}</span>
                </div>
                <div className="flex-1 bg-slate-100/50 rounded-xl p-2 border border-slate-200/50 space-y-3">
                  {stageCandidates.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-slate-900">{c.name}</div>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mb-3">
                        <Briefcase size={12} className="mr-1" />
                        {c.role}
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < c.rating ? "currentColor" : "none"} className={i >= c.rating ? "text-slate-300" : ""} />
                            ))}
                         </div>
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {stage !== 'Applied' && (
                              <button onClick={() => moveCandidate(c.id, 'prev')} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded">Prev</button>
                            )}
                            {stage !== 'Hired' && (
                              <button onClick={() => moveCandidate(c.id, 'next')} className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded">Next</button>
                            )}
                         </div>
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                     <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                       No candidates
                     </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <SmartAssistant contextData={`Recruitment Board. Candidates: ${JSON.stringify(candidates)}`} />
    </div>
  );
};

export default ModuleRecruitment;
