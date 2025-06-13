import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import MetricsGrid from './components/MetricsGrid';
import AnalysisResults from './components/AnalysisResults';
import AgentCommunications from './components/AgentCommunications';
import LoadingOverlay from './components/LoadingOverlay';
import NotificationSystem from './components/NotificationSystem';
import { sampleIssues, mockMetrics, mockAgents } from './data/mockData';
import { apiService } from './services/api';
import { Issue } from './types';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'active' | 'analyzing' | 'idle' | 'error'>('active');
  const [currentIssues, setCurrentIssues] = useState<Issue[]>(sampleIssues);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: Date;
  }>>([]);
  const [cloudFunctionStatus, setCloudFunctionStatus] = useState<'unknown' | 'available' | 'unavailable'>('unknown');

  // Check Cloud Function availability on mount
  useEffect(() => {
    const checkCloudFunction = async () => {
      const isAvailable = await apiService.testCloudFunction();
      setCloudFunctionStatus(isAvailable ? 'available' : 'unavailable');
    };
    
    checkCloudFunction();
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  }, []);

  const handleStartAnalysis = useCallback(async (repoPath: string, commitHash?: string) => {
    setIsAnalyzing(true);
    setAgentStatus('analyzing');

    try {
      console.log('🔍 Starting analysis for:', repoPath);
      
      const analysisRequest = {
        repoPath,
        commitHash,
        useCloudFunction: cloudFunctionStatus === 'available',
        analysisType: 'comprehensive' as const
      };

      const result = await apiService.startAnalysis(analysisRequest);
      
      if (result.success) {
        // Update issues with real results
        if (result.issues && result.issues.length > 0) {
          setCurrentIssues(result.issues);
        }
        
        setAgentStatus('active');
        showNotification(
          `Analysis completed! Found ${result.issues?.length || 0} issues in ${result.results?.filesAnalyzed || 0} files.`,
          'success'
        );
        
        // Animate metrics update
        setTimeout(() => {
          console.log('📊 Metrics updated with new analysis results');
        }, 500);
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setAgentStatus('error');
      showNotification(
        `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [cloudFunctionStatus, showNotification]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header 
          agentStatus={agentStatus} 
          cloudFunctionStatus={cloudFunctionStatus}
        />
        
        <ControlPanel 
          onStartAnalysis={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
        />
        
        <MetricsGrid metrics={mockMetrics} />
        
        <AnalysisResults issues={currentIssues} />
        
        <AgentCommunications agents={mockAgents} />
        
        <LoadingOverlay 
          isVisible={isAnalyzing} 
          message="Analyzing repository with AI..."
        />
        
        <NotificationSystem 
          notifications={notifications}
          onRemove={removeNotification}
        />
      </div>
    </div>
  );
}

export default App;