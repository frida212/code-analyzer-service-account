# 🚀 Code Analyzer Agent - AI Setup Instructions

## Prerequisites

1. **Google Cloud Project**: Ensure you have a Google Cloud project with Vertex AI API enabled
2. **Service Account**: Your service account key file (`code-analyzer-service-account-1e8494b4ad2f.json`)
3. **Python 3.8+**: Required for AI analysis components
4. **Node.js 16+**: Required for the dashboard and API server

## 🔧 Setup Steps

### 1. Environment Configuration

```bash
# Set the Google Cloud credentials
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/code-analyzer-service-account-1e8494b4ad2f.json"

# Set your project ID
export GOOGLE_CLOUD_PROJECT="code-analyzer-service-account"

# Set your preferred region
export VERTEX_AI_REGION="us-central1"
```

### 2. Python Environment Setup

```bash
# Create a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
cd python
pip install -r requirements.txt
```

### 3. Test Vertex AI Connection

```bash
# Run the setup script to verify connection
python vertex_ai_setup.py
```

Expected output:
```
✅ Vertex AI SDK initialized successfully!
   Project: code-analyzer-service-account
   Region: us-central1

📊 Current Configuration:
   project_id: code-analyzer-service-account
   region: us-central1
   credentials_set: True
```

### 4. Test AI Code Analysis

```bash
# Run the AI analyzer
python code_analyzer_ai.py
```

### 5. Start the Full Application

```bash
# Install Node.js dependencies
npm install

# Start the development server with AI integration
npm run dev
```

## 🤖 AI Features

### **Vertex AI Integration**
- **Code Quality Analysis**: AI-powered code review and quality scoring
- **Security Vulnerability Detection**: Advanced threat detection using ML models
- **Performance Optimization**: AI-suggested improvements for better performance
- **Automated Documentation**: AI-generated code documentation and comments

### **Multi-Agent AI System**
- **Documentation Agent**: Uses AI to generate comprehensive API docs
- **Test Generator Agent**: Creates intelligent unit tests with edge case coverage
- **QA Agent**: AI-powered quality assurance and deployment readiness checks

### **Smart Analysis Features**
- **Contextual Code Understanding**: AI analyzes code in context, not just syntax
- **Confidence Scoring**: Each AI suggestion includes a confidence level
- **Batch Repository Analysis**: Analyze entire codebases with AI insights
- **Risk Assessment**: AI-powered security and quality risk evaluation

## 🔍 API Endpoints with AI

### Enhanced Endpoints
- `GET /api/ai/status` - Check AI system status and configuration
- `POST /api/analyze` - Repository analysis with optional AI enhancement
- `GET /api/metrics` - Metrics with AI-generated insights
- `GET /api/issues` - Issues with AI confidence scores

### Example AI Analysis Request
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repoPath": "/path/to/repository",
    "commitHash": "abc123",
    "useAI": true
  }'
```

## 🛠 Troubleshooting

### Common Issues

**1. Authentication Error**
```
Error: Could not load the default credentials
```
**Solution**: Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to your service account key file.

**2. Project Not Found**
```
Error: Project not found or access denied
```
**Solution**: Verify your project ID and ensure Vertex AI API is enabled.

**3. Region Not Available**
```
Error: Location not supported
```
**Solution**: Use a supported region like `us-central1`, `europe-west2`, or `asia-southeast1`.

### Verification Commands

```bash
# Check credentials
echo $GOOGLE_APPLICATION_CREDENTIALS

# Verify project access
gcloud projects describe $GOOGLE_CLOUD_PROJECT

# Test API access
gcloud ai models list --region=$VERTEX_AI_REGION
```

## 🎯 Next Steps

1. **Configure Your Project**: Update the project ID and region in the Python files
2. **Enable APIs**: Ensure Vertex AI API is enabled in your Google Cloud Console
3. **Test Integration**: Run the test scripts to verify everything works
4. **Customize Models**: Adjust AI models and prompts for your specific use case
5. **Deploy**: Deploy to your preferred cloud platform with environment variables set

## 📚 Additional Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Google Cloud Authentication](https://cloud.google.com/docs/authentication)
- [Code Analysis Best Practices](https://cloud.google.com/vertex-ai/docs/generative-ai/code/code-models-overview)

---

🚀 Your AI-powered Code Analyzer Agent is ready to revolutionize your development workflow!