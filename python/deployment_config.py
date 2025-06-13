"""
Enhanced deployment configuration for Cloud Functions with multi-agent support.
"""

import os
import json
from typing import Dict, List

class EnhancedDeploymentConfig:
    """Enhanced configuration manager for multi-agent Cloud Function deployment."""
    
    def __init__(self):
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "code-analyzer-service-account")
        self.region = os.getenv("GCP_REGION", "us-central1")
        self.function_region = os.getenv("FUNCTION_REGION", "us-central1")
        
    def get_deployment_commands(self) -> Dict[str, str]:
        """
        Generate deployment commands for all Cloud Functions.
        
        Returns:
            Dictionary of function names to deployment commands
        """
        env_vars = self._get_environment_variables()
        env_var_string = ",".join([f"{k}={v}" for k, v in env_vars.items()])
        
        functions = {
            "analyze-code": {
                "entry_point": "analyze_code",
                "trigger": "--trigger-http --allow-unauthenticated",
                "memory": "2GB",
                "timeout": "540s"
            },
            "health-check": {
                "entry_point": "health_check", 
                "trigger": "--trigger-http --allow-unauthenticated",
                "memory": "512MB",
                "timeout": "60s"
            },
            "doc-agent": {
                "entry_point": "doc_agent",
                "trigger": "--trigger-topic=code-analysis-results",
                "memory": "1GB", 
                "timeout": "300s"
            },
            "test-agent": {
                "entry_point": "test_agent",
                "trigger": "--trigger-topic=code-analysis-results",
                "memory": "1GB",
                "timeout": "300s"
            },
            "qa-agent": {
                "entry_point": "qa_agent",
                "trigger": "--trigger-topic=code-analysis-results", 
                "memory": "1GB",
                "timeout": "300s"
            }
        }
        
        commands = {}
        for func_name, config in functions.items():
            commands[func_name] = f"""gcloud functions deploy {func_name} \\
  --runtime python311 \\
  {config['trigger']} \\
  --region {self.function_region} \\
  --entry-point {config['entry_point']} \\
  --memory {config['memory']} \\
  --timeout {config['timeout']} \\
  --set-env-vars {env_var_string} \\
  --source . \\
  --project {self.project_id}"""
        
        return commands
    
    def _get_environment_variables(self) -> Dict[str, str]:
        """Get required environment variables for deployment."""
        return {
            "GCP_PROJECT_ID": self.project_id,
            "GCP_PROJECT": self.project_id,  # Alternative name for compatibility
            "GCP_REGION": self.region,
            "VERTEX_ENDPOINT_ID": "your-endpoint-id-here",  # Replace with actual endpoint ID
            "PUB_SUB_TOPIC": "code-analysis-results",
            "DOC_AGENT_TOPIC": "doc-agent-messages",
            "GOOGLE_CLOUD_PROJECT": self.project_id
        }
    
    def generate_pubsub_topics_script(self) -> str:
        """Generate script to create required Pub/Sub topics."""
        topics = [
            "code-analysis-results",
            "doc-agent-messages", 
            "test-agent-messages",
            "qa-agent-messages"
        ]
        
        script = "#!/bin/bash\n\n"
        script += "# Create Pub/Sub topics for Code Analyzer Agent\n\n"
        
        for topic in topics:
            script += f"echo 'Creating topic: {topic}'\n"
            script += f"gcloud pubsub topics create {topic} --project={self.project_id}\n\n"
        
        script += "echo 'All topics created successfully!'\n"
        return script
    
    def generate_deployment_script(self) -> str:
        """Generate complete deployment script for all functions."""
        commands = self.get_deployment_commands()
        
        script = "#!/bin/bash\n\n"
        script += "# Deploy all Code Analyzer Agent Cloud Functions\n\n"
        script += "set -e  # Exit on any error\n\n"
        
        # Create topics first
        script += "echo 'Creating Pub/Sub topics...'\n"
        script += "./create_topics.sh\n\n"
        
        # Deploy functions
        for func_name, command in commands.items():
            script += f"echo 'Deploying {func_name}...'\n"
            script += command + "\n\n"
        
        script += "echo 'All functions deployed successfully!'\n"
        script += "echo 'Main analysis endpoint: https://{}-{}.cloudfunctions.net/analyze-code'\n".format(
            self.function_region, self.project_id
        )
        
        return script

# Example usage and script generation
if __name__ == "__main__":
    config = EnhancedDeploymentConfig()
    
    print("🚀 Enhanced Cloud Function Deployment Configuration")
    print("=" * 60)
    
    # Generate deployment commands
    commands = config.get_deployment_commands()
    print("\n📦 Individual Deployment Commands:")
    for func_name, command in commands.items():
        print(f"\n{func_name}:")
        print(command)
    
    # Generate Pub/Sub topics script
    topics_script = config.generate_pubsub_topics_script()
    print(f"\n📋 Pub/Sub Topics Script (save as create_topics.sh):")
    print(topics_script)
    
    # Generate complete deployment script
    deploy_script = config.generate_deployment_script()
    print(f"\n📄 Complete Deployment Script (save as deploy_all.sh):")
    print(deploy_script)
    
    print("\n✅ Configuration generated successfully!")
    print("\nNext steps:")
    print("1. Update VERTEX_ENDPOINT_ID in the environment variables")
    print("2. Save the scripts and make them executable:")
    print("   chmod +x create_topics.sh deploy_all.sh")
    print("3. Run: ./deploy_all.sh")
    print("4. Update your frontend CLOUD_FUNCTION_URL environment variable")