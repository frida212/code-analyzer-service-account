export interface Issue {
  type: 'security' | 'quality' | 'performance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line: number;
  message: string;
  rule: string;
  suggestion: string;
}

export interface AgentStatus {
  name: string;
  status: 'active' | 'analyzing' | 'error' | 'idle';
  lastUpdated: string;
}

export interface Metric {
  title: string;
  value: number | string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

export interface AgentMessage {
  id: string;
  message: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  color: string;
  lastUpdated: string;
  messages: AgentMessage[];
}

export type IssueFilter = 'all' | 'critical' | 'security' | 'quality' | 'performance';