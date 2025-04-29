export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    userId: string;
  };
}

export interface UserRegisterRequest {
  username: string;
  password: string;
}

export interface UserRegisterResponse {
  code: number;
  message: string;
}

export interface DocumentUploadRequest {
  documentName: string;
  content: string;
}

export interface DocumentUploadResponse {
  code: number;
  message: string;
  data: {
    documentId: string;
  };
}

export interface SearchRequest {
  keywords: string[];
  topK: number;
}

export interface SearchResult {
  documentId: string;
  documentName: string;
  score: number;
  merkleProof: string[];
}

export interface SearchResponse {
  code: number;
  message: string;
  data: {
    results: SearchResult[];
  };
}

export interface VerifyRequest {
  documentId: string;
  merkleProof: string[];
}

export interface VerifyResponse {
  code: number;
  message: string;
  data: {
    verified: boolean;
    rootHash: string;
  };
}

export interface DecryptRequest {
  documentId: string;
}

export interface DecryptResponse {
  code: number;
  message: string;
  data: {
    documentName: string;
    content: string;
  };
}

export interface DocumentListRequest {
  pageNum: number;
  pageSize: number;
}

export interface Document {
  documentId: string;
  documentName: string;
  uploadTime: string;
}

export interface DocumentListResponse {
  code: number;
  message: string;
  data: {
    total: number;
    documents: Document[];
  };
}

export interface RootHashResponse {
  code: number;
  message: string;
  data: {
    rootHash: string;
    timestamp: string;
  };
}

export interface CreateIndexRequest {
  documentId: string;
}

export interface CreateIndexResponse {
  code: number;
  message: string;
  data: {
    indexed: boolean;
  };
}
