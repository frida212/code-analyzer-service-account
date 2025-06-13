import React, { useState } from 'react';
import { Search, History, FileText, Settings, ScrollText } from 'lucide-react';

interface ControlPanelProps {
  onStartAnalysis: (repoPath: string, commitHash?: string) => void;
  isAnalyzing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onStartAnalysis, isAnalyzing }) => {
  const [repoPath, setRepoPath] = useState('/sample/project');
  const [commitHash, setCommitHash] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartAnalysis(repoPath, commitHash);
  };

  const quickActions = [
    { icon: History, label: 'View Analysis History', action: () => console.log('View history') },
    { icon: FileText, label: 'Export Report', action: () => console.log('Export report') },
    { icon: Settings, label: 'Configure Settings', action: () => console.log('Configure') },
    { icon: ScrollText, label: 'Agent Logs', action: () => console.log('View logs') }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-pink-400 mb-6">Repository Analysis</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="repoPath" className="block text-sm font-medium text-white/90 mb-2">
              Repository Path
            </label>
            <input
              type="text"
              id="repoPath"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="/path/to/your/repository"
            />
          </div>
          
          <div>
            <label htmlFor="commitHash" className="block text-sm font-medium text-white/90 mb-2">
              Commit Hash (Optional)
            </label>
            <input
              type="text"
              id="commitHash"
              value={commitHash}
              onChange={(e) => setCommitHash(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="abc123def456"
            />
          </div>
          
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </form>
      </div>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-pink-400 mb-6">Quick Actions</h3>
        
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/90 hover:bg-white/20 hover:translate-x-1 transition-all duration-200"
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;