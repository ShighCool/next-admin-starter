export interface HookMetadata {
  id: string;
  name: string;
  description: string;
  category: 'table' | 'form' | 'operation' | 'data' | 'ui' | 'utility';
  version: string;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  dependencies?: string[];
  features: string[];
  codePreview: string;
  usage: string;
  createdAt: number;
  updatedAt: number;
}

export interface InstalledHook {
  metadata: HookMetadata;
  installedAt: number;
  enabled: boolean;
}

export interface HookSearchParams {
  keyword?: string;
  category?: string;
  tags?: string[];
  sortBy?: 'popular' | 'newest' | 'rating';
}
