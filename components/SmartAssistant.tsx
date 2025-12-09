import React, { useState } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { generateAnalysis } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface SmartAssistantProps {
  contextData: string;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    
    const result = await generateAnalysis(contextData, query);
    
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden pointer-events-auto flex flex-col max-h-[500px]">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">UniCore AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto bg-slate-50 min-h-[200px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                <Loader2 className="animate-spin mb-2" size={24} />
                <span className="text-sm">Analyzing data...</span>
              </div>
            ) : response ? (
               <div className="prose prose-sm prose-indigo max-w-none">
                 <ReactMarkdown>{response}</ReactMarkdown>
               </div>
            ) : (
              <p className="text-slate-500 text-sm text-center mt-10">
                Ask me about the current page data, financial trends, or operational insights.
              </p>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI..."
              className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button 
              onClick={handleAsk}
              disabled={loading || !query}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-14 w-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <Bot size={28} />
      </button>
    </div>
  );
};

export default SmartAssistant;
