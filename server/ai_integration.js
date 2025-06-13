const { spawn } = require('child_process');
const path = require('path');

class AIAnalysisService {
  constructor() {
    this.pythonPath = 'python3'; // or 'python' depending on your system
    this.scriptPath = path.join(__dirname, '../python/code_analyzer_ai.py');
  }

  async analyzeWithAI(repoPath, options = {}) {
    return new Promise((resolve, reject) => {
      console.log('🤖 Starting AI-powered analysis...');
      
      const pythonProcess = spawn(this.pythonPath, [
        this.scriptPath,
        '--repo-path', repoPath,
        '--format', 'json'
      ]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            console.log('✅ AI analysis completed successfully');
            resolve(result);
          } catch (parseError) {
            console.error('❌ Failed to parse AI analysis result:', parseError);
            reject(new Error('Invalid AI analysis output'));
          }
        } else {
          console.error('❌ AI analysis failed:', errorOutput);
          reject(new Error(`AI analysis process exited with code ${code}`));
        }
      });

      pythonProcess.on('error', (error) => {
        console.error('❌ Failed to start AI analysis process:', error);
        reject(error);
      });
    });
  }

  async getAIInsights(analysisData) {
    // Mock AI insights generation
    // In production, this would call Vertex AI for deeper insights
    return {
      summary: "AI has identified several areas for improvement in your codebase.",
      recommendations: [
        "Implement input validation for all user-facing endpoints",
        "Add comprehensive error handling in critical functions",
        "Consider implementing automated testing for complex business logic"
      ],
      risk_level: "medium",
      confidence: 0.89
    };
  }
}

module.exports = { AIAnalysisService };