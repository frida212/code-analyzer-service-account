import React, { useState } from 'react';
import { Issue, IssueFilter } from '../types';
import { AlertTriangle, Shield, Gauge, Filter } from 'lucide-react';
import IssuesChart from './IssuesChart';

interface AnalysisResultsProps {
  issues: Issue[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ issues }) => {
  const [filter, setFilter] = useState<IssueFilter>('all');

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    if (filter === 'critical') return issue.severity === 'critical';
    return issue.type === filter;
  });

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'security': return Shield;
      case 'quality': return AlertTriangle;
      case 'performance': return Gauge;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/10';
      case 'high': return 'border-l-orange-500 bg-orange-500/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-l-green-500 bg-green-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-500/20 text-red-400';
      case 'quality': return 'bg-orange-500/20 text-orange-400';
      case 'performance': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filters: { key: IssueFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'critical', label: 'Critical' },
    { key: 'security', label: 'Security' },
    { key: 'quality', label: 'Quality' },
    { key: 'performance', label: 'Performance' }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-white/10">
        <h2 className="text-2xl font-semibold text-pink-400 mb-4 md:mb-0">Analysis Results</h2>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterOption.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {filteredIssues.map((issue, index) => {
              const IconComponent = getIssueIcon(issue.type);
              
              return (
                <div
                  key={index}
                  className={`${getSeverityColor(issue.severity)} border-l-4 rounded-r-xl p-4 hover:bg-white/10 hover:translate-x-1 transition-all duration-200`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeColor(issue.type)}`}>
                        {issue.type}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase ${getSeverityBadgeColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <span className="text-sm text-white/60">{issue.file}:{issue.line}</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="font-semibold text-white mb-1">{issue.message}</p>
                    <p className="text-sm text-white/70">Rule: {issue.rule}</p>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-pink-300">
                    <span className="mt-0.5">💡</span>
                    <span>{issue.suggestion}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <IssuesChart issues={issues} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;