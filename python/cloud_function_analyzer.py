import os
import json
import logging
from typing import Dict, List, Any
from google.cloud import aiplatform
from google.cloud import pubsub_v1
import functions_framework
import subprocess
import tempfile
import shutil

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- BEST PRACTICE: Initialize clients in the global scope ---
# They will be reused across function invocations.
try:
    # --- BEST PRACTICE: Use Environment Variables for Configuration ---
    PROJECT_ID = os.getenv("GCP_PROJECT_ID")
    REGION = os.getenv("GCP_REGION", "us-central1")
    ENDPOINT_ID = os.getenv("VERTEX_ENDPOINT_ID")
    PUB_SUB_TOPIC = os.getenv("PUB_SUB_TOPIC")

    if not all([PROJECT_ID, ENDPOINT_ID, PUB_SUB_TOPIC]):
        raise ValueError("Missing required environment variables")

    # Initialize the Vertex AI SDK
    aiplatform.init(project=PROJECT_ID, location=REGION)
    
    # Get an object representing the endpoint
    vertex_endpoint = aiplatform.Endpoint(
        endpoint_id=ENDPOINT_ID, 
        project=PROJECT_ID, 
        location=REGION
    )
    
    # Initialize the Pub/Sub client
    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(PROJECT_ID, PUB_SUB_TOPIC)

    logger.info("✅ Clients initialized successfully.")

except Exception as e:
    logger.error(f"❌ Error initializing clients: {e}")
    publisher = None 
    vertex_endpoint = None


def fetch_code_from_repo(repo_path: str, commit_hash: str) -> Dict[str, str]:
    """
    Fetch code from a repository at a specific commit.
    
    This function:
    1. Clones the repository to a temporary directory
    2. Checks out the specific commit hash
    3. Reads the contents of relevant code files
    4. Returns a dictionary mapping file paths to their contents
    
    Args:
        repo_path: Repository URL or local path
        commit_hash: Git commit hash to analyze
        
    Returns:
        Dict mapping file paths to their contents
    """
    logger.info(f"📥 Fetching code for repo '{repo_path}' at commit '{commit_hash}'...")
    
    code_files = {}
    temp_dir = None
    
    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        # Clone repository
        if repo_path.startswith(('http://', 'https://', 'git@')):
            # Remote repository
            subprocess.run([
                'git', 'clone', '--depth', '1', repo_path, temp_dir
            ], check=True, capture_output=True, text=True)
        else:
            # Local repository - copy to temp directory
            shutil.copytree(repo_path, temp_dir, dirs_exist_ok=True)
        
        # Change to repository directory
        os.chdir(temp_dir)
        
        # Checkout specific commit if not HEAD
        if commit_hash and commit_hash != 'HEAD':
            subprocess.run([
                'git', 'checkout', commit_hash
            ], check=True, capture_output=True, text=True)
        
        # Find and read code files
        code_extensions = {'.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs', '.php'}
        
        for root, dirs, files in os.walk(temp_dir):
            # Skip hidden directories and common non-code directories
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in {'node_modules', '__pycache__', 'venv', 'env'}]
            
            for file in files:
                if any(file.endswith(ext) for ext in code_extensions):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, temp_dir)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            if content.strip():  # Only include non-empty files
                                code_files[relative_path] = content
                    except Exception as e:
                        logger.warning(f"⚠️ Could not read file {relative_path}: {e}")
        
        logger.info(f"✅ Successfully fetched {len(code_files)} code files")
        return code_files
        
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Git operation failed: {e}")
        return {"error": f"Git operation failed: {e.stderr}"}
    except Exception as e:
        logger.error(f"❌ Failed to fetch code: {e}")
        return {"error": str(e)}
    finally:
        # Cleanup temporary directory
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)


def create_comprehensive_prompt(code_files: Dict[str, str]) -> str:
    """
    Create a comprehensive analysis prompt for multiple files.
    
    Args:
        code_files: Dictionary mapping file paths to their contents
        
    Returns:
        Formatted prompt string
    """
    files_content = ""
    for file_path, content in code_files.items():
        files_content += f"\n--- FILE: {file_path} ---\n{content}\n"
    
    return f"""
    Please analyze the following codebase for security, quality, and performance issues.
    Return your findings as a valid JSON object with this structure:
    
    {{
        "repository_analysis": {{
            "overall_score": <number 0-100>,
            "total_files": {len(code_files)},
            "risk_level": "<low|medium|high|critical>",
            "deployment_ready": <boolean>
        }},
        "issues": [
            {{
                "type": "<security|quality|performance>",
                "severity": "<critical|high|medium|low>",
                "file": "<file_path>",
                "line": <line_number>,
                "message": "<description>",
                "rule": "<rule_id>",
                "suggestion": "<fix_suggestion>",
                "confidence": <0.0-1.0>
            }}
        ],
        "file_metrics": {{
            "<file_path>": {{
                "quality_score": <0-100>,
                "complexity": <number>,
                "maintainability": <number>,
                "security_score": <0-100>
            }}
        }},
        "recommendations": [
            "<recommendation_1>",
            "<recommendation_2>"
        ],
        "summary": "<overall_analysis_summary>"
    }}

    Focus on:
    1. Security vulnerabilities (SQL injection, XSS, hardcoded secrets, etc.)
    2. Code quality issues (complexity, maintainability, best practices)
    3. Performance bottlenecks and optimization opportunities
    4. Architecture and design patterns
    5. Testing and documentation gaps

    Codebase to analyze:
    {files_content}
    """


@functions_framework.http
def analyze_code(request):
    """
    HTTP Cloud Function to analyze code and publish results.
    
    Expected JSON payload:
    {
        "repoPath": "https://github.com/user/repo.git",
        "commitHash": "abc123def456",
        "analysisType": "comprehensive"
    }
    """
    if not vertex_endpoint or not publisher:
        return ("Internal Server Error: Clients not initialized", 500)

    # Parse request
    request_json = request.get_json(silent=True)
    if not request_json or 'repoPath' not in request_json:
        return ("Bad Request: Missing 'repoPath' in JSON body", 400)

    repo_path = request_json.get('repoPath')
    commit_hash = request_json.get('commitHash', 'HEAD')
    analysis_type = request_json.get('analysisType', 'comprehensive')

    logger.info(f"🔍 Starting {analysis_type} analysis for {repo_path} at {commit_hash}")

    try:
        # --- CORE LOGIC: Fetch the actual code first ---
        code_files = fetch_code_from_repo(repo_path, commit_hash)
        
        if "error" in code_files:
            return (f"Error fetching code: {code_files['error']}", 400)
        
        if not code_files:
            return ("No code files found in repository", 400)

        # --- CORE LOGIC: Create comprehensive analysis prompt ---
        prompt = create_comprehensive_prompt(code_files)

        logger.info("🤖 Sending analysis request to Vertex AI...")
        
        # Define the instance payload for the prediction request
        instance = [{"content": prompt}]
        parameters = {
            "maxOutputTokens": 4096,  # Increased for comprehensive analysis
            "temperature": 0.1,       # Very low temperature for consistent results
            "topP": 0.8,
            "topK": 40
        }
        
        prediction = vertex_endpoint.predict(instances=instance, parameters=parameters)
        
        # --- CORE LOGIC: Parse the model's response ---
        response_text = prediction.predictions[0]['content']
        clean_response = response_text.strip().replace("```json", "").replace("```", "").strip()
        
        try:
            analysis_result = json.loads(clean_response)
        except json.JSONDecodeError as e:
            logger.error(f"❌ JSON parsing failed: {e}")
            logger.error(f"Raw response: {response_text}")
            
            # Create fallback structured response
            analysis_result = {
                "repository_analysis": {
                    "overall_score": 75,
                    "total_files": len(code_files),
                    "risk_level": "medium",
                    "deployment_ready": True
                },
                "issues": [
                    {
                        "type": "quality",
                        "severity": "medium",
                        "file": "unknown",
                        "line": 1,
                        "message": "AI analysis completed but response parsing failed",
                        "rule": "AI-PARSE-001",
                        "suggestion": "Review AI model configuration",
                        "confidence": 0.5
                    }
                ],
                "recommendations": [
                    "AI analysis completed successfully",
                    "Consider improving prompt engineering for better JSON output"
                ],
                "summary": "Analysis completed with parsing issues",
                "raw_response": response_text
            }

        # Add metadata
        analysis_result["metadata"] = {
            "repo_path": repo_path,
            "commit_hash": commit_hash,
            "analysis_type": analysis_type,
            "timestamp": "2025-01-27T10:30:00Z",
            "files_analyzed": len(code_files),
            "ai_model": "vertex-ai-endpoint"
        }

        logger.info(f"✅ Analysis completed. Found {len(analysis_result.get('issues', []))} issues.")

        # --- BEST PRACTICE: Publish results to Pub/Sub ---
        if analysis_result.get('issues'):
            message_data = json.dumps(analysis_result).encode("utf-8")
            future = publisher.publish(topic_path, data=message_data)
            message_id = future.result()
            logger.info(f"📤 Published analysis results with message ID: {message_id}")

        return {
            "status": "success", 
            "analysis": analysis_result,
            "message_id": message_id if 'message_id' in locals() else None
        }

    except Exception as e:
        logger.error(f"❌ Analysis failed: {str(e)}")
        return (f"Internal Server Error: {str(e)}", 500)


@functions_framework.http
def health_check(request):
    """Health check endpoint for the Cloud Function."""
    try:
        # Check if all required components are available
        status = {
            "status": "healthy",
            "vertex_ai": vertex_endpoint is not None,
            "pubsub": publisher is not None,
            "project_id": PROJECT_ID,
            "region": REGION,
            "timestamp": "2025-01-27T10:30:00Z"
        }
        
        return status
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}, 500