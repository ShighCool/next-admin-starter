'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandMessage,
  CommandTask,
  ParsedCommand,
  CommandResult,
  CommandExecutor,
} from '@/types/ai-command';

// 预设命令执行器
const commandExecutors: Record<string, CommandExecutor> = {
  // 导航命令
  navigate: {
    type: 'navigate',
    execute: async (params) => {
      // TODO: 实际执行导航
      console.log('Navigate to:', params.path);
      return {
        success: true,
        message: `正在前往 ${params.path}`,
        data: { path: params.path },
      };
    },
  },

  // 用户查询命令
  user: {
    type: 'user',
    execute: async (params) => {
      // TODO: 实际查询用户
      console.log('Query user:', params);
      return {
        success: true,
        message: `查询用户: ${params.username || params.uid}`,
        data: { type: 'user', params },
      };
    },
  },

  // 数据统计命令
  stats: {
    type: 'stats',
    execute: async (params) => {
      // TODO: 实际获取统计数据
      console.log('Get stats:', params);
      return {
        success: true,
        message: `获取 ${params.category || '综合'} 统计数据`,
        data: { type: 'stats', params },
      };
    },
  },

  // 系统操作命令
  system: {
    type: 'system',
    execute: async (params) => {
      console.log('System operation:', params);
      return {
        success: true,
        message: `执行系统操作: ${params.action}`,
        data: { type: 'system', params },
      };
    },
  },
};

// 简单的关键词匹配解析器（非 AI 版本）
const parseCommand = (input: string): ParsedCommand[] => {
  const commands: ParsedCommand[] = [];
  const lowerInput = input.toLowerCase();

  // 导航类命令
  if (lowerInput.includes('跳转') || lowerInput.includes('前往') || lowerInput.includes('去')) {
    if (lowerInput.includes('首页') || lowerInput.includes('主页')) {
      commands.push({
        type: 'navigate',
        action: 'goto',
        params: { path: '/' },
        confidence: 0.9,
      });
    } else if (lowerInput.includes('用户') || lowerInput.includes('user')) {
      commands.push({
        type: 'navigate',
        action: 'goto',
        params: { path: '/examples/users' },
        confidence: 0.9,
      });
    } else if (lowerInput.includes('视频') || lowerInput.includes('video')) {
      commands.push({
        type: 'navigate',
        action: 'goto',
        params: { path: '/examples/users' },
        confidence: 0.9,
      });
    } else if (lowerInput.includes('分析') || lowerInput.includes('analytics')) {
      commands.push({
        type: 'navigate',
        action: 'goto',
        params: { path: '/analytics' },
        confidence: 0.9,
      });
    }
  }

  // 查询类命令
  if (lowerInput.includes('查询') || lowerInput.includes('搜索') || lowerInput.includes('找')) {
    if (lowerInput.includes('用户')) {
      const match = lowerInput.match(/用户[：:]\s*(.+)/);
      commands.push({
        type: 'user',
        action: 'query',
        params: {
          username: match ? match[1] : undefined,
        },
        confidence: 0.85,
      });
    }
  }

  // 统计类命令
  if (lowerInput.includes('统计') || lowerInput.includes('数据')) {
    commands.push({
      type: 'stats',
      action: 'get',
      params: { category: 'general' },
      confidence: 0.8,
    });
  }

  // 如果没有匹配到命令，返回空
  if (commands.length === 0) {
    commands.push({
      type: 'unknown',
      action: 'unknown',
      params: {},
      confidence: 0.1,
    });
  }

  return commands;
};

export const useAICommand = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<CommandMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content:
        '您好！我是您的 AI 操作助手。我可以帮您：\n\n📌 快速导航：跳转到任何页面\n📌 查询信息：搜索用户、数据等\n📌 执行操作：统计数据、系统操作\n\n请告诉我您想做什么？',
      timestamp: Date.now(),
    },
  ]);
  const [tasks, setTasks] = useState<CommandTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const taskQueueRef = useRef<CommandTask[]>([]);

  // 添加消息
  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string) => {
    const message: CommandMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  // 执行命令
  const executeCommand = useCallback(
    async (command: ParsedCommand): Promise<CommandResult> => {
      const executor = commandExecutors[command.type];

      if (!executor) {
        return {
          success: false,
          message: `未知命令类型: ${command.type}`,
          error: 'Unknown command type',
        };
      }

      try {
        const result = await executor.execute(command.params);

        // 特殊处理导航命令
        if (command.type === 'navigate' && result.success && result.data?.path) {
          router.push(result.data.path);
        }

        return result;
      } catch (error) {
        return {
          success: false,
          message: `执行命令失败: ${error instanceof Error ? error.message : '未知错误'}`,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    [router]
  );

  // 处理用户输入
  const handleUserInput = useCallback(
    async (input: string) => {
      addMessage('user', input);
      setIsProcessing(true);

      try {
        // 解析命令
        const commands = parseCommand(input);

        if (commands.length === 0 || commands[0].confidence < 0.3) {
          // TODO: 当 AI 服务可用时，发送给 AI 进行自然语言理解
          addMessage(
            'assistant',
            '抱歉，我没有理解您的指令。请尝试使用更清晰的描述，例如："跳转到用户管理页面" 或 "查询用户数据"'
          );
          return;
        }

        // 执行命令
        const results = [];
        for (const command of commands) {
          const result = await executeCommand(command);
          results.push(result);
        }

        // 生成回复
        const successResults = results.filter((r) => r.success);
        if (successResults.length > 0) {
          const response = successResults.map((r) => r.message).join('\n');
          addMessage('assistant', response);
        } else {
          addMessage('assistant', '执行失败：' + results[0]?.message || '未知错误');
        }
      } catch (error) {
        addMessage('assistant', `处理出错: ${error instanceof Error ? error.message : '未知错误'}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [addMessage, executeCommand]
  );

  // 创建多步骤任务
  const createTask = useCallback((name: string, description: string, steps: string[]) => {
    const task: CommandTask = {
      id: 'task_' + Date.now(),
      name,
      description,
      status: 'pending',
      progress: 0,
      steps: steps.map((stepName, index) => ({
        id: 'step_' + Date.now() + '_' + index,
        name: stepName,
        status: 'pending',
      })),
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  // 执行任务
  const executeTask = useCallback(
    async (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: 'running', startedAt: Date.now() } : t))
      );

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      try {
        for (let i = 0; i < task.steps.length; i++) {
          const step = task.steps[i];

          // 更新步骤状态
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    steps: t.steps.map((s) => (s.id === step.id ? { ...s, status: 'running' } : s)),
                    progress: ((i + 1) / task.steps.length) * 100,
                  }
                : t
            )
          );

          // 模拟执行步骤
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 更新步骤完成状态
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    steps: t.steps.map((s) =>
                      s.id === step.id ? { ...s, status: 'completed', output: '完成' } : s
                    ),
                  }
                : t
            )
          );
        }

        // 任务完成
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: 'completed', completedAt: Date.now() } : t
          )
        );

        addMessage('assistant', `✅ 任务 "${task.name}" 已完成`);
      } catch (error) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: 'failed',
                  error: error instanceof Error ? error.message : '未知错误',
                }
              : t
          )
        );

        addMessage(
          'assistant',
          `❌ 任务 "${task.name}" 失败: ${error instanceof Error ? error.message : '未知错误'}`
        );
      }
    },
    [tasks, addMessage]
  );

  // 清除消息
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'init',
        role: 'assistant',
        content: '对话已清除。请告诉我您想做什么？',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // 清除任务
  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return {
    messages,
    tasks,
    isProcessing,
    handleUserInput,
    createTask,
    executeTask,
    clearMessages,
    clearTasks,
  };
};
