// Recognition result types
export interface RecognitionResult {
  character: string;
  confidence: number;
  alternatives: Alternative[];
}

export interface Alternative {
  character: string;
  confidence: number;
}

// History types
export interface HistoryEntry {
  id: number;
  filename: string;
  recognized_character: string;
  confidence: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Upload types
export interface UploadResponse {
  filename: string;
  filepath: string;
}

// Preprocessing types
export interface PreprocessingResult {
  features: number[];
}