export type CommandStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface CommandMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface CommandTask {
  id: string;
  name: string;
  description: string;
  status: CommandStatus;
  progress: number;
  steps: CommandStep[];
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface CommandStep {
  id: string;
  name: string;
  status: CommandStatus;
  output?: string;
  error?: string;
}

export interface ParsedCommand {
  type: string;
  action: string;
  params: Record<string, any>;
  confidence: number;
}

export interface CommandExecutor {
  type: string;
  execute: (params: Record<string, any>) => Promise<CommandResult>;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface AIConfig {
  enabled: boolean;
  provider?: 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// TODO: 需要连接 AI 服务时启用以下类型
// export interface AIResponse {
//   content: string
//   reasoning?: string
//   commands?: ParsedCommand[]
//   confidence?: number
// }

// export interface AIFunction {
//   name: string
//   description: string
//   parameters: Record<string, any>
//   execute: (params: any) => Promise<any>
// }
