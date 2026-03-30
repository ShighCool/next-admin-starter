// 工作台布局配置
export interface WorkspaceLayout {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
  items: LayoutItem[];
}

// 布局项
export interface LayoutItem {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  config?: ComponentConfig;
}

// 组件类型
export type ComponentType =
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  | 'stat-card'
  | 'todo-list'
  | 'quick-links'
  | 'recent-activity'
  | 'notification'
  | 'calendar'
  | 'custom';

// 组件配置
export interface ComponentConfig {
  title?: string;
  dataSource?: string;
  refreshInterval?: number;
  [key: string]: any;
}

// 预设模板
export interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  items: LayoutItem[];
}

// 快捷链接配置
export interface QuickLink {
  id: string;
  title: string;
  icon?: string;
  path: string;
  color?: string;
}

// 待办事项配置
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: Date;
}

// 组件库定义
export interface ComponentLibraryItem {
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  category: 'chart' | 'data' | 'productivity' | 'communication';
}
