
import { toast } from "sonner";
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

// Base API URL - In a real app, this would be your backend API
// For now, we'll mock responses with local JSON
const BASE_URL = "/api";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generic API call handler with error handling
async function apiCall<T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> {
  try {
    // For a real application, you would use fetch or axios here
    // For now, we'll simulate responses
    console.log(`API Call: ${method} ${endpoint}`, data);
    
    await delay(800); // Simulate network delay
    
    // Mock responses based on endpoint
    switch (endpoint) {
      case "/user/login":
        if (data?.username && data?.password) {
          return {
            code: 200,
            message: "登录成功",
            data: {
              token: "mock-token-" + Date.now(),
              userId: "user-" + Math.floor(Math.random() * 1000),
            },
          } as unknown as T;
        }
        throw new Error("用户名或密码不正确");
        
      case "/document/upload":
        return {
          code: 200,
          message: "上传成功",
          data: {
            documentId: "doc-" + Math.floor(Math.random() * 10000),
          },
        } as unknown as T;
        
      case "/search":
        return {
          code: 200,
          message: "检索成功",
          data: {
            results: Array(Math.min(5, data?.topK || 10)).fill(null).map((_, i) => ({
              documentId: `doc-${i + 1}`,
              documentName: `文档 ${i + 1} - 包含${data?.keywords?.join(',')}关键词`,
              score: Math.random() * 0.4 + 0.6, // Score between 0.6 and 1.0
              merkleProof: Array(3).fill(null).map(() => 
                Array(64).fill(0).map(() => 
                  Math.floor(Math.random() * 16).toString(16)
                ).join('')
              ),
            })),
          },
        } as unknown as T;
        
      case "/verify":
        return {
          code: 200,
          message: "验证成功",
          data: {
            verified: true,
            rootHash: Array(64).fill(0).map(() => 
              Math.floor(Math.random() * 16).toString(16)
            ).join(''),
          },
        } as unknown as T;
        
      case "/document/decrypt":
        return {
          code: 200,
          message: "解密成功",
          data: {
            documentName: `文档 ${data?.documentId?.split('-')[1]}`,
            content: "这是解密后的文档内容。这个示例包含了多个关键词，如区块链、加密、搜索、验证等技术领域词汇。本文档系统基于区块链技术，实现了可验证的多关键字加密检索功能，确保文档的完整性和真实性。",
          },
        } as unknown as T;
        
      case "/document/list":
        const total = 35; // Total mock documents
        const start = (data?.pageNum - 1) * data?.pageSize;
        const end = Math.min(start + data?.pageSize, total);
        
        return {
          code: 200,
          message: "获取成功",
          data: {
            total,
            documents: Array(end - start).fill(null).map((_, i) => ({
              documentId: `doc-${start + i + 1}`,
              documentName: `文档 ${start + i + 1}`,
              uploadTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            })),
          },
        } as unknown as T;
        
      case "/blockchain/rootHash":
        return {
          code: 200,
          message: "获取成功",
          data: {
            rootHash: Array(64).fill(0).map(() => 
              Math.floor(Math.random() * 16).toString(16)
            ).join(''),
            timestamp: new Date().toISOString(),
          },
        } as unknown as T;
        
      case "/index/create":
        return {
          code: 200,
          message: "索引创建成功",
          data: {
            indexed: true,
          },
        } as unknown as T;
        
      default:
        throw new Error("未知的API端点");
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
