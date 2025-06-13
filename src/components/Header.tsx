import React from 'react';
import { Activity, CircleDot, Cloud, CloudOff } from 'lucide-react';

interface HeaderProps {
  agentStatus: 'active' | 'analyzing' | 'idle' | 'error';
  cloudFunctionStatus?: 'unknown' | 'available' | 'unavailable';
}

const Header: React.FC<HeaderProps> = ({ agentStatus, cloudFunctionStatus = 'unknown' }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'analyzing': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Agent Active';
      case 'analyzing': return 'Analyzing';
      case 'error': return 'Error';
      default: return 'Ready';
    }
  };

  const getCloudStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400';
      case 'unavailable': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getCloudStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Cloud Function Ready';
      case 'unavailable': return 'Cloud Function Offline';
      default: return 'Checking Cloud Function...';
    }
  };

  const CloudIcon = cloudFunctionStatus === 'available' ? Cloud : CloudOff;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-2">
            Code Analyzer Agent
          </h1>
          <p className="text-white/80 text-lg">AI-Powered Multi-Agent Development Kit</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(agentStatus)} animate-pulse`}></div>
            <span className="text-white/90 text-sm font-medium">{getStatusText(agentStatus)}</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-white/90 text-sm font-medium">System Ready</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
            <CloudIcon className={`w-4 h-4 ${getCloudStatusColor(cloudFunctionStatus)}`} />
            <span className={`text-sm font-medium ${getCloudStatusColor(cloudFunctionStatus)}`}>
              {getCloudStatusText(cloudFunctionStatus)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;