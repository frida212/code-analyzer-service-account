import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import MetricsGrid from './components/MetricsGrid';
import AnalysisResults from './components/AnalysisResults';
import AgentCommunications from './components/AgentCommunications';
import LoadingOverlay from './components/LoadingOverlay';
import { sampleIssues, mockMetrics, mockAgents } from './data/mockData';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'active' | 'analyzing' | 'idle'>('active');

  const handleStartAnalysis = useCallback(async (repoPath: string, commitHash?: string) => {
    setIsAnalyzing(true);
    setAgentStatus('analyzing');

    // Simulate analysis duration
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsAnalyzing(false);
    setAgentStatus('active');

    // Show completion notification (in a real app, you'd use a toast library)
    console.log('Analysis completed successfully!');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header agentStatus={agentStatus} />
        
        <ControlPanel 
          onStartAnalysis={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
        />
        
        <MetricsGrid metrics={mockMetrics} />
        
        <AnalysisResults issues={sampleIssues} />
        
        <AgentCommunications agents={mockAgents} />
        
        <LoadingOverlay isVisible={isAnalyzing} />
      </div>
    </div>
  );
}

export default App;