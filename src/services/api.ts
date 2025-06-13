const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AnalysisRequest {
  repoPath: string;
  commitHash?: string;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  repoPath: string;
  commitHash?: string;
  timestamp: string;
  results: {
    qualityScore: number;
    issuesFound: number;
    filesAnalyzed: number;
  };
}

export interface ApiMetrics {
  qualityScore: number;
  totalIssues: number;
  filesAnalyzed: number;
  securityIssues: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  async getMetrics(): Promise<ApiMetrics> {
    return this.request('/metrics');
  }

  async getIssues(filters?: { type?: string; severity?: string }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.severity) params.append('severity', filters.severity);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/issues${query}`);
  }

  async startAnalysis(data: AnalysisRequest): Promise<AnalysisResponse> {
    return this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAgents() {
    return this.request('/agents');
  }
}

export const apiService = new ApiService();