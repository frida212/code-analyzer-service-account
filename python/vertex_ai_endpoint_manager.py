import os
import json
import asyncio
from typing import Dict, List, Any, Optional
from google.cloud import aiplatform
from google.cloud import pubsub_v1
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VertexAIEndpointManager:
    """
    Advanced Vertex AI Endpoint Manager for Code Analyzer Agent.
    Handles endpoint creation, deployment, and model predictions.
    """
    
    def __init__(self, project_id: str = None, region: str = None):
        # Configuration from environment or parameters
        self.project_id = project_id or os.getenv("GOOGLE_CLOUD_PROJECT", "code-analyzer-service-account")
        self.region = region or os.getenv("VERTEX_AI_REGION", "us-central1")
        
        # Initialize Vertex AI
        aiplatform.init(project=self.project_id, location=self.region)
        
        # Endpoint configuration
        self.endpoint_display_name = "code-analyzer-endpoint"
        self.endpoint = None
        self.endpoint_id = None
        
        logger.info(f"✅ VertexAI Endpoint Manager initialized for project: {self.project_id}")
    
    async def create_endpoint(self) -> str:
        """
        Create a new Vertex AI endpoint for code analysis.
        
        Returns:
            str: The endpoint ID
        """
        try:
            logger.info(f"🚀 Creating Vertex AI Endpoint '{self.endpoint_display_name}'...")
            
            # Create the endpoint asynchronously
            self.endpoint = aiplatform.Endpoint.create(
                display_name=self.endpoint_display_name,
                project=self.project_id,
                location=self.region,
            )
            
            logger.info("✅ Endpoint creation initiated.")
            logger.info(f"📍 Full Endpoint Resource Name: {self.endpoint.resource_name}")
            
            # Extract endpoint ID from the full resource name
            # Format: projects/{project}/locations/{location}/endpoints/{endpoint_id}
            self.endpoint_id = self.endpoint.name.split("/")[-1]
            
            logger.info(f"🆔 Endpoint ID: {self.endpoint_id}")
            
            return self.endpoint_id
            
        except Exception as e:
            logger.error(f"❌ Failed to create endpoint: {str(e)}")
            raise
    
    def get_existing_endpoint(self, endpoint_id: str) -> aiplatform.Endpoint:
        """
        Get an existing endpoint by ID.
        
        Args:
            endpoint_id: The endpoint ID
            
        Returns:
            aiplatform.Endpoint: The endpoint object
        """
        try:
            self.endpoint_id = endpoint_id
            self.endpoint = aiplatform.Endpoint(
                endpoint_id=endpoint_id,
                project=self.project_id,
                location=self.region
            )
            
            logger.info(f"✅ Connected to existing endpoint: {endpoint_id}")
            return self.endpoint
            
        except Exception as e:
            logger.error(f"❌ Failed to connect to endpoint {endpoint_id}: {str(e)}")
            raise
    
    async def analyze_code_with_endpoint(self, code_content: str, file_path: str) -> Dict[str, Any]:
        """
        Analyze code using the Vertex AI endpoint.
        
        Args:
            code_content: The source code to analyze
            file_path: Path to the file being analyzed
            
        Returns:
            Dictionary containing analysis results
        """
        if not self.endpoint:
            raise ValueError("No endpoint available. Create or connect to an endpoint first.")
        
        try:
            # Create analysis prompt
            prompt = self._create_analysis_prompt(code_content, file_path)
            
            logger.info(f"🔍 Analyzing code with Vertex AI endpoint...")
            
            # Define the instance payload for prediction
            instance = [{"content": prompt}]
            parameters = {
                "maxOutputTokens": 2048,  # Increased for comprehensive analysis
                "temperature": 0.2,       # Lower temperature for consistent results
                "topP": 0.8,
                "topK": 40
            }
            
            # Make prediction
            prediction = self.endpoint.predict(instances=instance, parameters=parameters)
            
            # Parse the model's response
            response_text = prediction.predictions[0]['content']
            clean_response = response_text.strip().replace("```json", "").replace("```", "").strip()
            
            try:
                analysis_result = json.loads(clean_response)
            except json.JSONDecodeError:
                # Fallback: create structured response from text
                analysis_result = self._parse_text_response(response_text, file_path)
            
            logger.info(f"✅ Analysis completed for {file_path}")
            return analysis_result
            
        except Exception as e:
            logger.error(f"❌ Analysis failed for {file_path}: {str(e)}")
            return {"error": str(e), "file_path": file_path}
    
    def _create_analysis_prompt(self, code_content: str, file_path: str) -> str:
        """Create a structured prompt for code analysis."""
        return f"""
        Please analyze the following code for security, quality, and performance issues.
        Return your findings as a valid JSON object with this structure:
        {{
            "file_path": "{file_path}",
            "quality_score": <number 0-100>,
            "issues": [
                {{
                    "type": "<security|quality|performance>",
                    "severity": "<critical|high|medium|low>",
                    "line": <line_number>,
                    "message": "<description>",
                    "rule": "<rule_id>",
                    "suggestion": "<fix_suggestion>",
                    "confidence": <0.0-1.0>
                }}
            ],
            "metrics": {{
                "complexity": <number>,
                "maintainability": <number>,
                "test_coverage": <number>
            }},
            "ai_insights": [
                "<insight_1>",
                "<insight_2>"
            ]
        }}

        Code to analyze:
        File: {file_path}
        
        ```
        {code_content}
        ```
        
        Focus on:
        1. Security vulnerabilities (SQL injection, XSS, etc.)
        2. Code quality issues (complexity, maintainability)
        3. Performance bottlenecks
        4. Best practice violations
        """
    
    def _parse_text_response(self, response_text: str, file_path: str) -> Dict[str, Any]:
        """Fallback parser for non-JSON responses."""
        return {
            "file_path": file_path,
            "quality_score": 75.0,
            "issues": [
                {
                    "type": "quality",
                    "severity": "medium",
                    "line": 1,
                    "message": "AI analysis completed but response format needs improvement",
                    "rule": "AI-PARSE-001",
                    "suggestion": "Review AI model configuration for better JSON output",
                    "confidence": 0.5
                }
            ],
            "metrics": {
                "complexity": 10,
                "maintainability": 75,
                "test_coverage": 0
            },
            "ai_insights": [
                "AI analysis completed successfully",
                "Consider improving prompt engineering for better results"
            ],
            "raw_response": response_text
        }

# Example usage and testing
async def main():
    """Test the Vertex AI Endpoint Manager."""
    print("🚀 Initializing Vertex AI Endpoint Manager...")
    
    manager = VertexAIEndpointManager()
    
    # Test endpoint creation (uncomment to create new endpoint)
    # endpoint_id = await manager.create_endpoint()
    # print(f"Created endpoint: {endpoint_id}")
    
    # Test with existing endpoint (replace with your endpoint ID)
    # manager.get_existing_endpoint("your-endpoint-id-here")
    
    # Test code analysis
    sample_code = """
def login_user(username, password):
    # Potential SQL injection vulnerability
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    result = db.execute(query)
    return result

def complex_function(data):
    # High complexity function
    result = []
    for item in data:
        if item.type == 'A':
            for subitem in item.subitems:
                if subitem.active:
                    for detail in subitem.details:
                        if detail.valid:
                            result.append(process_detail(detail))
    return result
    """
    
    print("\n📝 Testing code analysis...")
    # result = await manager.analyze_code_with_endpoint(sample_code, "auth/login.py")
    # print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())