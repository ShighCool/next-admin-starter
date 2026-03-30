'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Input,
  Button,
  Space,
  Typography,
  List,
  Tag,
  Progress,
  Card,
  Tooltip,
  Divider,
  Empty,
  Badge,
} from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useAICommand } from '@/hooks/useAICommand';
import { CommandMessage, CommandTask } from '@/types/ai-command';

const { Text, Paragraph } = Typography;

interface AICommandPanelProps {
  open: boolean;
  onClose: () => void;
}

const AICommandPanel: React.FC<AICommandPanelProps> = ({ open, onClose }) => {
  const {
    messages,
    tasks,
    isProcessing,
    handleUserInput,
    createTask,
    executeTask,
    clearMessages,
    clearTasks,
  } = useAICommand();

  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 快捷命令
  const quickCommands = [
    { label: '跳转首页', command: '跳转到首页' },
    { label: '仪表板', command: '跳转到仪表板' },
    { label: '工作区', command: '跳转到工作区' },
    { label: '用户管理', command: '跳转到用户管理' },
    { label: '表单示例', command: '跳转到表单示例' },
    { label: '图表示例', command: '跳转到图表示例' },
    { label: '数据分析', command: '跳转到数据分析' },
    { label: 'Hook 市场', command: '跳转到 Hook 市场' },
  ];

  // 预设任务
  const presetTasks = [
    {
      name: '每日数据报告',
      description: '生成今日系统运行报告',
      steps: ['收集用户数据', '收集统计数据', '生成统计图表', '导出报告'],
    },
    {
      name: '系统健康检查',
      description: '检查系统各项指标',
      steps: ['检查数据库连接', '检查缓存状态', '检查 API 响应', '生成健康报告'],
    },
    {
      name: '数据备份',
      description: '备份关键数据',
      steps: ['备份数据库', '备份日志文件', '验证备份完整性', '清理旧备份'],
    },
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;
    handleUserInput(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
    handleSend();
  };

  const handleExecutePresetTask = (task: (typeof presetTasks)[0]) => {
    const newTask = createTask(task.name, task.description, task.steps);
    executeTask(newTask.id);
    setActiveTab('tasks');
  };

  const renderMessage = (message: CommandMessage) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
      <div
        key={message.id}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: 16,
        }}
      >
        {!isUser && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isSystem ? '#faad14' : 'var(--theme-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            {isSystem ? (
              <ClockCircleOutlined style={{ color: '#fff', fontSize: 16 }} />
            ) : (
              <RobotOutlined style={{ color: '#fff', fontSize: 16 }} />
            )}
          </div>
        )}
        <div
          style={{
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: 12,
            background: isUser ? 'var(--theme-primary)' : isSystem ? '#fff7e6' : '#f5f5f5',
            color: isUser ? '#fff' : '#1a1f2e',
            wordBreak: 'break-word',
            border: isSystem ? '1px solid #ffd591' : 'none',
          }}
        >
          <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</Paragraph>
        </div>
        {isUser && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
              flexShrink: 0,
            }}
          >
            <UserOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
        )}
      </div>
    );
  };

  const renderTask = (task: CommandTask) => {
    const statusIcon = {
      pending: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      running: <SyncOutlined spin style={{ color: '#1890ff' }} />,
      completed: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      failed: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    };

    const statusColor = {
      pending: 'default',
      running: 'processing',
      completed: 'success',
      failed: 'error',
    };

    return (
      <Card
        key={task.id}
        size="small"
        style={{ marginBottom: 12 }}
        styles={{ body: { padding: '12px' } }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
          }}
        >
          <Space>
            {statusIcon[task.status]}
            <Text strong>{task.name}</Text>
          </Space>
          <Tag color={statusColor[task.status]}>{task.status}</Tag>
        </div>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
          {task.description}
        </Text>
        {task.status !== 'pending' && (
          <Progress percent={task.progress} size="small" style={{ marginBottom: 8 }} />
        )}
        <List
          size="small"
          dataSource={task.steps}
          renderItem={(step) => (
            <List.Item style={{ padding: '4px 0' }}>
              <Space>
                {step.status === 'completed' && (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                )}
                {step.status === 'running' && (
                  <SyncOutlined spin style={{ color: '#1890ff', fontSize: 12 }} />
                )}
                {step.status === 'failed' && (
                  <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
                )}
                {step.status === 'pending' && (
                  <ClockCircleOutlined style={{ color: '#d9d9d9', fontSize: 12 }} />
                )}
                <Text style={{ fontSize: 12 }}>{step.name}</Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    );
  };

  return (
    <Drawer
      title={
        <Space>
          <RobotOutlined style={{ color: 'var(--theme-primary)' }} />
          <span>AI 操作助手</span>
          {isProcessing && <SyncOutlined spin />}
        </Space>
      }
      onClose={onClose}
      open={open}
      size={480}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
      footer={null}
    >
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
        <Button
          type={activeTab === 'chat' ? 'primary' : 'text'}
          onClick={() => setActiveTab('chat')}
          style={{ flex: 1, borderRadius: 0, height: 48 }}
        >
          <Space>
            <RobotOutlined />
            对话
            {messages.length > 1 && (
              <Badge
                count={messages.length - 1}
                style={{ backgroundColor: 'var(--theme-primary)' }}
              />
            )}
          </Space>
        </Button>
        <Button
          type={activeTab === 'tasks' ? 'primary' : 'text'}
          onClick={() => setActiveTab('tasks')}
          style={{ flex: 1, borderRadius: 0, height: 48 }}
        >
          <Space>
            <HistoryOutlined />
            任务
            {tasks.length > 0 && (
              <Badge count={tasks.length} style={{ backgroundColor: 'var(--theme-primary)' }} />
            )}
          </Space>
        </Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'chat' ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                快捷命令
              </Text>
              <Space wrap>
                {quickCommands.map((cmd) => (
                  <Tag
                    key={cmd.label}
                    onClick={() => handleQuickCommand(cmd.command)}
                    style={{ cursor: 'pointer', marginBottom: 4 }}
                  >
                    {cmd.label}
                  </Tag>
                ))}
              </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div style={{ minHeight: 300 }}>
              {messages.map(renderMessage)}
              {isProcessing && (
                <div style={{ display: 'flex', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--theme-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <RobotOutlined style={{ color: '#fff', fontSize: 16 }} />
                  </div>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: '#f5f5f5',
                    }}
                  >
                    <SyncOutlined spin /> 思考中...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                预设任务
              </Text>
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                {presetTasks.map((task) => (
                  <Card
                    key={task.name}
                    size="small"
                    hoverable
                    onClick={() => handleExecutePresetTask(task)}
                    styles={{ body: { padding: '12px' } }}
                  >
                    <Space>
                      <ThunderboltOutlined style={{ color: 'var(--theme-primary)' }} />
                      <Text strong style={{ flex: 1 }}>
                        {task.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {task.steps.length} 步
                      </Text>
                    </Space>
                  </Card>
                ))}
              </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Space style={{ justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  任务历史
                </Text>
                {tasks.length > 0 && (
                  <Button type="text" size="small" icon={<ClearOutlined />} onClick={clearTasks}>
                    清除
                  </Button>
                )}
              </Space>
              {tasks.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无任务"
                  style={{ padding: '40px 0' }}
                />
              ) : (
                tasks.map(renderTask)
              )}
            </div>
          </>
        )}
      </div>

      {activeTab === 'chat' && (
        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入指令，例如：跳转到用户管理"
              disabled={isProcessing}
              size="large"
              allowClear
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || isProcessing}
              size="large"
            >
              发送
            </Button>
          </Space.Compact>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              按 Enter 发送，Shift + Enter 换行
            </Text>
            {messages.length > 1 && (
              <Button
                type="text"
                size="small"
                icon={<ClearOutlined />}
                onClick={clearMessages}
                style={{ fontSize: 11, padding: 0, height: 'auto' }}
              >
                清除对话
              </Button>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default AICommandPanel;
