import { toast } from "sonner";
import mockResponses from "../mocks/responses.json";
import { API_CONFIG } from "../config/api.config";
import {
  UserLoginRequest,
  UserLoginResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  DocumentUploadRequest,
  DocumentUploadResponse,
  SearchRequest,
  SearchResponse,
  VerifyRequest,
  VerifyResponse,
  DecryptRequest,
  DecryptResponse,
  DocumentListRequest,
  DocumentListResponse,
  RootHashResponse,
  CreateIndexRequest,
  CreateIndexResponse,
} from "../types/api";

// Helper function to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generic API call handler
async function apiCall<T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> {
  try {
    console.log(`API Call: ${method} ${endpoint}`, data);
    
    // 模拟网络延迟
    await delay(800);
    
    if (API_CONFIG.useMockData) {
      // Extract the endpoint without the /api prefix for mock data
      const mockEndpoint = endpoint.replace('/api', '');
      
      // Mock login validation
      if (mockEndpoint === "/user/login") {
        const loginData = data as UserLoginRequest;
        if (loginData.username === "root" && loginData.password === "root123") {
          return mockResponses[mockEndpoint].success as T;
        } else {
          return mockResponses[mockEndpoint].failure as T;
        }
      }

      // Mock register validation
      if (mockEndpoint === "/user/register") {
        const registerData = data as UserRegisterRequest;
        if (registerData.username === "taken") {
          return mockResponses[mockEndpoint].failure as T;
        } else {
          return mockResponses[mockEndpoint].success as T;
        }
      }
      
      // For other endpoints, use standard mock responses
      const mockResponse = mockResponses[mockEndpoint];
      if (!mockResponse) {
        throw new Error("Mock data not found for endpoint: " + mockEndpoint);
      }
      
      // 对于某些endpoints，需要动态生成响应
      if (mockEndpoint === "/search" && data?.keywords) {
        mockResponse.data.results = mockResponse.data.results.map(result => ({
          ...result,
          documentName: `${result.documentName} - 包含${data.keywords.join(',')}关键词`,
        }));
      }
      
      return mockResponse as T;
    } else {
      // 使用真实API
      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          // 如果有token，添加到header
          ...(localStorage.getItem("token") ? {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    toast.error(message);
    throw error;
  }
}

// API functions mapped to endpoints
export const api = {
  login: (data: UserLoginRequest) => 
    apiCall<UserLoginResponse>("/api/user/login", "POST", data),
    
  register: (data: UserRegisterRequest) => 
    apiCall<UserRegisterResponse>("/api/user/register", "POST", data),
  
  uploadDocument: (data: DocumentUploadRequest) => 
    apiCall<DocumentUploadResponse>("/api/document/upload", "POST", data),
    
  search: (data: SearchRequest) => 
    apiCall<SearchResponse>("/api/search", "POST", data),
    
  verify: (data: VerifyRequest) => 
    apiCall<VerifyResponse>("/api/verify", "POST", data),
    
  decrypt: (data: DecryptRequest) => 
    apiCall<DecryptResponse>("/api/document/decrypt", "POST", data),
    
  getDocumentList: (data: DocumentListRequest) => 
    apiCall<DocumentListResponse>("/api/document/list", "POST", data),
    
  getRootHash: () => 
    apiCall<RootHashResponse>("/api/blockchain/rootHash", "POST"),
    
  createIndex: (data: CreateIndexRequest) => 
    apiCall<CreateIndexResponse>("/api/index/create", "POST", data),
};
