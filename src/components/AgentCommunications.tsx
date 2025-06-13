import React from 'react';
import { Agent } from '../types';
import * as Icons from 'lucide-react';

interface AgentCommunicationsProps {
  agents: Agent[];
}

const AgentCommunications: React.FC<AgentCommunicationsProps> = ({ agents }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {agents.map((agent) => {
        const IconComponent = Icons[agent.avatar as keyof typeof Icons] as React.ComponentType<any>;
        
        return (
          <div
            key={agent.id}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 relative overflow-hidden hover:bg-white/10 transition-all duration-300"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${agent.color}`}></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{agent.name}</h4>
                <p className="text-sm text-white/60">Last updated: {agent.lastUpdated}</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {agent.messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <p className="text-sm text-white/90 mb-2">{message.message}</p>
                  <p className="text-xs text-white/50">{message.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgentCommunications;