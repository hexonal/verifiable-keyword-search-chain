
import { toast } from "sonner";
import mockResponses from "../mocks/responses.json";
import { API_CONFIG } from "../config/api.config";
import {
  UserLoginRequest,
  UserLoginResponse,
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
      // 使用模拟数据
      const mockResponse = mockResponses[endpoint];
      if (!mockResponse) {
        throw new Error("Mock data not found for endpoint: " + endpoint);
      }
      
      // 对于某些endpoints，需要动态生成响应
      if (endpoint === "/search" && data?.keywords) {
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
    apiCall<UserLoginResponse>("/user/login", "POST", data),
    
  uploadDocument: (data: DocumentUploadRequest) => 
    apiCall<DocumentUploadResponse>("/document/upload", "POST", data),
    
  search: (data: SearchRequest) => 
    apiCall<SearchResponse>("/search", "POST", data),
    
  verify: (data: VerifyRequest) => 
    apiCall<VerifyResponse>("/verify", "POST", data),
    
  decrypt: (data: DecryptRequest) => 
    apiCall<DecryptResponse>("/document/decrypt", "POST", data),
    
  getDocumentList: (data: DocumentListRequest) => 
    apiCall<DocumentListResponse>("/document/list", "POST", data),
    
  getRootHash: () => 
    apiCall<RootHashResponse>("/blockchain/rootHash", "POST"),
    
  createIndex: (data: CreateIndexRequest) => 
    apiCall<CreateIndexResponse>("/index/create", "POST", data),
};
