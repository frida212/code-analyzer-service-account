"""
Test script for Cloud Functions to verify deployment and functionality.
"""

import requests
import json
import time
from typing import Dict, Any

class CloudFunctionTester:
    """Test suite for Code Analyzer Cloud Functions."""
    
    def __init__(self, project_id: str, region: str = "us-central1"):
        self.project_id = project_id
        self.region = region
        self.base_url = f"https://{region}-{project_id}.cloudfunctions.net"
        
    def test_health_check(self) -> Dict[str, Any]:
        """Test the health check endpoint."""
        print("🔍 Testing health check endpoint...")
        
        try:
            response = requests.get(f"{self.base_url}/health-check", timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Health check passed!")
                print(f"   Status: {result.get('status')}")
                print(f"   Vertex AI: {result.get('vertex_ai')}")
                print(f"   Pub/Sub: {result.get('pubsub')}")
                return {"success": True, "data": result}
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            print(f"❌ Health check error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def test_code_analysis(self, repo_path: str = "https://github.com/octocat/Hello-World.git") -> Dict[str, Any]:
        """Test the code analysis endpoint."""
        print(f"🔍 Testing code analysis with repo: {repo_path}")
        
        payload = {
            "repoPath": repo_path,
            "commitHash": "HEAD",
            "analysisType": "comprehensive"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/analyze-code",
                json=payload,
                timeout=300  # 5 minutes for analysis
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Code analysis completed!")
                print(f"   Status: {result.get('status')}")
                print(f"   Issues found: {len(result.get('issues', []))}")
                print(f"   Files analyzed: {result.get('metadata', {}).get('files_analyzed', 0)}")
                return {"success": True, "data": result}
            else:
                print(f"❌ Code analysis failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except Exception as e:
            print(f"❌ Code analysis error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def test_all_endpoints(self) -> Dict[str, Any]:
        """Test all available endpoints."""
        print("🚀 Starting comprehensive Cloud Function tests...")
        print("=" * 50)
        
        results = {}
        
        # Test health check
        results["health_check"] = self.test_health_check()
        time.sleep(2)
        
        # Test code analysis (only if health check passed)
        if results["health_check"]["success"]:
            results["code_analysis"] = self.test_code_analysis()
        else:
            print("⚠️ Skipping code analysis test due to health check failure")
            results["code_analysis"] = {"success": False, "error": "Health check failed"}
        
        # Summary
        print("\n📊 Test Results Summary:")
        print("=" * 30)
        for test_name, result in results.items():
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"{test_name}: {status}")
            if not result["success"]:
                print(f"   Error: {result.get('error', 'Unknown error')}")
        
        return results

def main():
    """Run Cloud Function tests."""
    import os
    
    # Get project ID from environment or prompt user
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    if not project_id:
        project_id = input("Enter your Google Cloud Project ID: ").strip()
    
    if not project_id:
        print("❌ Project ID is required")
        return
    
    # Initialize tester
    tester = CloudFunctionTester(project_id)
    
    print(f"🧪 Testing Cloud Functions for project: {project_id}")
    print(f"📡 Base URL: {tester.base_url}")
    print()
    
    # Run tests
    results = tester.test_all_endpoints()
    
    # Final summary
    total_tests = len(results)
    passed_tests = sum(1 for r in results.values() if r["success"])
    
    print(f"\n🎯 Final Results: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! Your Cloud Functions are working correctly.")
        print(f"\n🔗 Your analysis endpoint is ready:")
        print(f"   {tester.base_url}/analyze-code")
    else:
        print("⚠️ Some tests failed. Please check the deployment and configuration.")

if __name__ == "__main__":
    main()