from google.cloud import aiplatform
import os
from typing import Optional

class VertexAIManager:
    """
    Manages Vertex AI SDK initialization and configuration for the Code Analyzer Agent.
    """
    
    def __init__(self, project_id: Optional[str] = None, region: Optional[str] = None):
        # TODO: Replace these placeholder values with your actual Google Cloud project details
        
        # Your Google Cloud project ID
        # You can find this in the Google Cloud Console dashboard
        self.project_id = project_id or "your-project-id-here"
        
        # The region where your Vertex AI resources are located
        # Common regions: "us-central1", "europe-west2", "asia-southeast1"
        self.region = region or "us-central1"
        
        # Initialize the SDK
        self.initialize_vertex_ai()
    
    def initialize_vertex_ai(self):
        """Initialize the Vertex AI SDK with project and location settings."""
        try:
            # Set up authentication using the service account key
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            if not credentials_path:
                print("⚠️  Warning: GOOGLE_APPLICATION_CREDENTIALS not set")
                print("   Please set it to your service account key file path")
            
            # Initialize Vertex AI
            aiplatform.init(project=self.project_id, location=self.region)
            
            print(f"✅ Vertex AI SDK initialized successfully!")
            print(f"   Project: {self.project_id}")
            print(f"   Region: {self.region}")
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to initialize Vertex AI SDK: {str(e)}")
            return False
    
    def get_project_info(self):
        """Get current project and region information."""
        return {
            "project_id": self.project_id,
            "region": self.region,
            "credentials_set": bool(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
        }

# Example usage
if __name__ == "__main__":
    # Initialize with your specific project details
    vertex_manager = VertexAIManager(
        project_id="code-analyzer-service-account",  # Replace with your actual project ID
        region="us-central1"  # Replace with your preferred region
    )
    
    # Display configuration
    info = vertex_manager.get_project_info()
    print("\n📊 Current Configuration:")
    for key, value in info.items():
        print(f"   {key}: {value}")