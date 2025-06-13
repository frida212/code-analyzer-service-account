import React from 'react';
import { Metric } from '../types';
import * as Icons from 'lucide-react';

interface MetricsGridProps {
  metrics: Metric[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const IconComponent = Icons[metric.icon as keyof typeof Icons] as React.ComponentType<any>;
        
        return (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80 font-medium">{metric.title}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="mb-2">
              <span className="text-3xl font-bold text-white">{metric.value}</span>
            </div>
            
            {metric.change && (
              <div className={`text-sm ${
                metric.changeType === 'positive' ? 'text-green-400' :
                metric.changeType === 'negative' ? 'text-red-400' :
                'text-white/60'
              }`}>
                {metric.change}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;