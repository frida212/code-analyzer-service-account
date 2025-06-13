import { Issue, Agent, Metric } from '../types';

export const sampleIssues: Issue[] = [
  {
    type: 'security',
    severity: 'critical',
    file: 'auth/login.py',
    line: 42,
    message: 'SQL injection vulnerability detected',
    rule: 'B608',
    suggestion: 'Use parameterized queries instead of string concatenation'
  },
  {
    type: 'quality',
    severity: 'high',
    file: 'utils/helpers.py',
    line: 128,
    message: 'Function complexity too high (15)',
    rule: 'CC001',
    suggestion: 'Break down function into smaller, more focused functions'
  },
  {
    type: 'performance',
    severity: 'medium',
    file: 'api/endpoints.py',
    line: 67,
    message: 'Low maintainability index (42.3)',
    rule: 'MI001',
    suggestion: 'Refactor to improve code maintainability'
  },
  {
    type: 'security',
    severity: 'high',
    file: 'config/settings.py',
    line: 15,
    message: 'Hardcoded password detected',
    rule: 'B106',
    suggestion: 'Use environment variables for sensitive data'
  },
  {
    type: 'quality',
    severity: 'medium',
    file: 'models/user.py',
    line: 89,
    message: 'Missing docstring',
    rule: 'C0111',
    suggestion: 'Add comprehensive docstring documentation'
  }
];

export const mockMetrics: Metric[] = [
  {
    title: 'Quality Score',
    value: '85.2',
    change: '+5.3% from last analysis',
    changeType: 'positive',
    icon: 'Star',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Total Issues',
    value: 23,
    change: '+3 new issues',
    changeType: 'negative',
    icon: 'AlertTriangle',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Files Analyzed',
    value: 47,
    change: '3 new files',
    changeType: 'neutral',
    icon: 'Folder',
    color: 'from-blue-500 to-purple-600'
  },
  {
    title: 'Security Issues',
    value: 5,
    change: '-2 resolved',
    changeType: 'positive',
    icon: 'Shield',
    color: 'from-red-500 to-red-600'
  }
];

export const mockAgents: Agent[] = [
  {
    id: 'doc',
    name: 'Documentation Agent',
    avatar: 'BookOpen',
    color: 'from-blue-500 to-purple-600',
    lastUpdated: '2 min ago',
    messages: [
      {
        id: '1',
        message: 'Generated API documentation for 3 new endpoints',
        timestamp: 'Just now'
      },
      {
        id: '2',
        message: 'Updated README with security guidelines',
        timestamp: '5 min ago'
      }
    ]
  },
  {
    id: 'test',
    name: 'Test Generator Agent',
    avatar: 'TestTube',
    color: 'from-pink-500 to-red-500',
    lastUpdated: '1 min ago',
    messages: [
      {
        id: '1',
        message: 'Created 12 new unit tests for complex functions',
        timestamp: '2 min ago'
      },
      {
        id: '2',
        message: 'Added edge case tests for authentication module',
        timestamp: '8 min ago'
      }
    ]
  },
  {
    id: 'qa',
    name: 'QA Agent',
    avatar: 'CheckCircle',
    color: 'from-cyan-500 to-blue-500',
    lastUpdated: '30 sec ago',
    messages: [
      {
        id: '1',
        message: 'Deployment blocked due to 2 critical issues',
        timestamp: '30 sec ago'
      },
      {
        id: '2',
        message: 'Quality gate passed for staging environment',
        timestamp: '12 min ago'
      }
    ]
  }
];