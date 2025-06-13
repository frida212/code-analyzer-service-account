const express = require('express');
const path = require('path');
const cors = require('cors');
const { AIAnalysisService } = require('./ai_integration');

const app = express();
const aiService = new AIAnalysisService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist directory (for production build)
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    ai_enabled: true,
    vertex_ai_ready: process.env.GOOGLE_APPLICATION_CREDENTIALS ? true : false
  });
});

// Enhanced metrics endpoint with AI insights
app.get('/api/metrics', async (req, res) => {
  try {
    const baseMetrics = {
      qualityScore: 85.2,
      totalIssues: 23,
      filesAnalyzed: 47,
      securityIssues: 5
    };

    // Add AI-powered insights
    const aiInsights = await aiService.getAIInsights(baseMetrics);
    
    res.json({
      ...baseMetrics,
      ai_insights: aiInsights,
      last_ai_analysis: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting AI metrics:', error);
    res.json({
      qualityScore: 85.2,
      totalIssues: 23,
      filesAnalyzed: 47,
      securityIssues: 5,
      ai_insights: null,
      error: 'AI insights temporarily unavailable'
    });
  }
});

app.get('/api/issues', (req, res) => {
  const issues = [
    {
      type: 'security',
      severity: 'critical',
      file: 'auth/login.py',
      line: 42,
      message: 'SQL injection vulnerability detected',
      rule: 'B608',
      suggestion: 'Use parameterized queries instead of string concatenation',
      ai_detected: true,
      confidence: 0.95
    },
    {
      type: 'quality',
      severity: 'high',
      file: 'utils/helpers.py',
      line: 128,
      message: 'Function complexity too high (15)',
      rule: 'CC001',
      suggestion: 'Break down function into smaller, more focused functions',
      ai_detected: true,
      confidence: 0.87
    },
    {
      type: 'performance',
      severity: 'medium',
      file: 'api/endpoints.py',
      line: 67,
      message: 'Low maintainability index (42.3)',
      rule: 'MI001',
      suggestion: 'Refactor to improve code maintainability',
      ai_detected: false,
      confidence: 0.72
    }
  ];
  
  const { type, severity } = req.query;
  let filteredIssues = issues;
  
  if (type) {
    filteredIssues = filteredIssues.filter(issue => issue.type === type);
  }
  
  if (severity) {
    filteredIssues = filteredIssues.filter(issue => issue.severity === severity);
  }
  
  res.json(filteredIssues);
});

// Enhanced analysis endpoint with AI integration
app.post('/api/analyze', async (req, res) => {
  const { repoPath, commitHash, useAI = true } = req.body;
  
  console.log(`🔍 Starting analysis for: ${repoPath}`);
  
  try {
    let analysisResults;
    
    if (useAI && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Use AI-powered analysis
      console.log('🤖 Using AI-powered analysis...');
      analysisResults = await aiService.analyzeWithAI(repoPath, { commitHash });
    } else {
      // Fallback to mock analysis
      console.log('📊 Using standard analysis...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      analysisResults = {
        success: true,
        message: 'Analysis completed successfully',
        repoPath,
        commitHash,
        timestamp: new Date().toISOString(),
        results: {
          qualityScore: Math.floor(Math.random() * 20) + 80,
          issuesFound: Math.floor(Math.random() * 10) + 15,
          filesAnalyzed: Math.floor(Math.random() * 20) + 40,
          ai_powered: false
        }
      };
    }
    
    res.json(analysisResults);
    
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message,
      repoPath,
      commitHash,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/agents', (req, res) => {
  res.json([
    {
      id: 'doc',
      name: 'Documentation Agent',
      status: 'active',
      lastUpdated: new Date().toISOString(),
      ai_powered: true,
      messages: [
        {
          id: '1',
          message: 'AI generated comprehensive API documentation for 3 new endpoints',
          timestamp: new Date().toISOString()
        }
      ]
    },
    {
      id: 'test',
      name: 'Test Generator Agent',
      status: 'active',
      lastUpdated: new Date().toISOString(),
      ai_powered: true,
      messages: [
        {
          id: '1',
          message: 'AI created 12 intelligent unit tests covering edge cases',
          timestamp: new Date().toISOString()
        }
      ]
    },
    {
      id: 'qa',
      name: 'QA Agent',
      status: 'analyzing',
      lastUpdated: new Date().toISOString(),
      ai_powered: true,
      messages: [
        {
          id: '1',
          message: 'AI-powered quality gate analysis in progress...',
          timestamp: new Date().toISOString()
        }
      ]
    }
  ]);
});

// New AI-specific endpoints
app.get('/api/ai/status', (req, res) => {
  res.json({
    vertex_ai_enabled: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
    project_id: process.env.GOOGLE_CLOUD_PROJECT || 'not-configured',
    region: process.env.VERTEX_AI_REGION || 'us-central1',
    models_available: ['code-bison@001', 'text-bison@001'],
    last_health_check: new Date().toISOString()
  });
});

// Catch all handler for React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}`);
  console.log(`🔧 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🤖 AI Status: ${process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Enabled' : '⚠️  Configure GOOGLE_APPLICATION_CREDENTIALS'}`);
});

module.exports = app;