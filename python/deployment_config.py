"""
Deployment configuration and utilities for Vertex AI Cloud Functions.
"""

import os
import json
from typing import Dict, List

class DeploymentConfig:
    """Configuration manager for Cloud Function deployment."""
    
    def __init__(self):
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "code-analyzer-service-account")
        self.region = os.getenv("GCP_REGION", "us-central1")
        self.function_region = os.getenv("FUNCTION_REGION", "us-central1")
        
    def get_deployment_command(self, function_name: str, entry_point: str) -> str:
        """
        Generate the gcloud deployment command for the Cloud Function.
        
        Args:
            function_name: Name of the Cloud Function
            entry_point: Entry point function name
            
        Returns:
            Complete gcloud deployment command
        """
        env_vars = self._get_environment_variables()
        env_var_string = ",".join([f"{k}={v}" for k, v in env_vars.items()])
        
        command = f"""gcloud functions deploy {function_name} \\
  --runtime python311 \\
  --trigger-http \\
  --allow-unauthenticated \\
  --region {self.function_region} \\
  --entry-point {entry_point} \\
  --memory 1GB \\
  --timeout 540s \\
  --set-env-vars {env_var_string} \\
  --source . \\
  --project {self.project_id}"""
        
        return command
    
    def _get_environment_variables(self) -> Dict[str, str]:
        """Get required environment variables for deployment."""
        return {
            "GCP_PROJECT_ID": self.project_id,
            "GCP_REGION": self.region,
            "VERTEX_ENDPOINT_ID": "your-endpoint-id-here",  # Replace with actual endpoint ID
            "PUB_SUB_TOPIC": "code-analysis-results",
            "GOOGLE_CLOUD_PROJECT": self.project_id
        }
    
    def generate_requirements_txt(self) -> str:
        """Generate requirements.txt for Cloud Function deployment."""
        requirements = [
            "google-cloud-aiplatform>=1.38.0",
            "google-cloud-pubsub>=2.18.0",
            "functions-framework>=3.4.0",
            "google-auth>=2.15.0",
            "requests>=2.28.0"
        ]
        return "\n".join(requirements)
    
    def generate_main_py(self) -> str:
        """Generate main.py file for Cloud Function deployment."""
        return '''# main.py - Cloud Function entry point
from cloud_function_analyzer import analyze_code, health_check

# The functions are automatically discovered by Functions Framework
# No additional code needed here
'''

# Example usage
if __name__ == "__main__":
    config = DeploymentConfig()
    
    print("🚀 Cloud Function Deployment Configuration")
    print("=" * 50)
    
    # Generate deployment command
    deploy_cmd = config.get_deployment_command("analyze-code", "analyze_code")
    print("\n📦 Deployment Command:")
    print(deploy_cmd)
    
    # Generate requirements.txt
    requirements = config.generate_requirements_txt()
    print(f"\n📋 requirements.txt:")
    print(requirements)
    
    # Generate main.py
    main_py = config.generate_main_py()
    print(f"\n📄 main.py:")
    print(main_py)
    
    print("\n✅ Configuration generated successfully!")
    print("\nNext steps:")
    print("1. Create your Vertex AI endpoint using vertex_ai_endpoint_manager.py")
    print("2. Update VERTEX_ENDPOINT_ID in the deployment command")
    print("3. Create a Pub/Sub topic named 'code-analysis-results'")
    print("4. Run the deployment command")