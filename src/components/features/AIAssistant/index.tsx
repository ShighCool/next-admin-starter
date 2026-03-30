'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Badge, Input, Space, Divider, Avatar, Tag, Tooltip } from 'antd';
import {
  RobotOutlined,
  CloseOutlined,
  SendOutlined,
  MinusOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  BulbOutlined,
} from '@ant-design/icons';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'suggestion';
}

const AIAssistant: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '您好！我是您的 AI 助手。我可以帮您：\\n\\n• 搜索和分析数据\\n• 生成代码片段\\n• 提供智能建议\\n• 回答系统问题',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 快捷建议
  const suggestions = [
    {
      icon: <ThunderboltOutlined />,
      text: '分析今日数据',
      prompt: '帮我分析今天的用户数据和访问情况',
    },
    { icon: <BulbOutlined />, text: '代码优化建议', prompt: '查看当前页面并提供代码优化建议' },
    { icon: <RobotOutlined />, text: '系统健康检查', prompt: '检查系统运行状态和性能指标' },
  ];

  // 模拟 AI 响应
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses = [
      '根据我的分析，今天用户访问量比昨天增长了 15%，主要是来自移动端的流量。建议您关注移动端体验优化。',
      '我注意到最近的数据增长趋势很稳定。如果需要深入分析，我可以为您生成详细的报告。',
      '从代码角度，我建议将这个组件拆分成更小的子组件，这样可以提高可维护性和性能。',
      '系统运行状态良好，所有服务正常。内存使用率在合理范围内，无需担心。',
      '这是一个很好的问题！根据当前的数据模式，我建议采用渐进式加载策略来优化性能。',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await simulateAIResponse(inputValue);
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI 响应失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    setInputValue(prompt);
    if (!expanded) {
      setExpanded(true);
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 如果未展开且收到新消息，增加未读数
  useEffect(() => {
    if (!expanded && messages.length > 1) {
      setUnreadCount(messages.filter((m) => m.role === 'assistant').length);
    } else {
      setUnreadCount(0);
    }
  }, [expanded, messages]);

  return (
    <>
      {/* 悬浮按钮 */}
      {!expanded && (
        <Tooltip title="AI 助手" placement="left">
          <Badge count={unreadCount} offset={[-5, 5]}>
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<RobotOutlined />}
              onClick={() => {
                setExpanded(true);
                setUnreadCount(0);
              }}
              style={{
                position: 'fixed',
                right: 24,
                bottom: 24,
                width: 56,
                height: 56,
                boxShadow: '0 4px 16px color-mix(in srgb, var(--theme-primary) 40%, transparent)',
                zIndex: 9999,
                background: 'var(--theme-primary)',
                border: 'none',
              }}
            />
          </Badge>
        </Tooltip>
      )}

      {/* AI 助手面板 */}
      {expanded && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            width: 380,
            height: minimized ? 56 : 600,
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid var(--theme-border-color)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'height 0.3s ease',
          }}
        >
          {/* 头部 */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                'linear-gradient(135deg, var(--theme-primary) 0%, color-mix(in srgb, var(--theme-primary) 70%, white) 100%)',
            }}
          >
            <Space size={8}>
              <Avatar
                size={32}
                icon={<RobotOutlined />}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.2,
                  }}
                >
                  AI 助手
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.2,
                  }}
                >
                  {loading ? '正在思考...' : '随时为您服务'}
                </div>
              </div>
            </Space>
            <Space size={4}>
              <Button
                type="text"
                size="small"
                icon={minimized ? <PlusOutlined /> : <MinusOutlined />}
                onClick={() => setMinimized(!minimized)}
                style={{ color: '#ffffff' }}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => {
                  setExpanded(false);
                  setMinimized(false);
                }}
                style={{ color: '#ffffff' }}
              />
            </Space>
          </div>

          {!minimized && (
            <>
              {/* 消息列表 */}
              <div
                ref={messagesContainerRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      gap: 8,
                      flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    {message.role === 'assistant' && (
                      <Avatar
                        size={28}
                        icon={<RobotOutlined />}
                        style={{
                          flexShrink: 0,
                          background: 'var(--theme-primary)',
                        }}
                      />
                    )}
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: message.role === 'user' ? 'var(--theme-primary)' : '#f5f5f5',
                        color: message.role === 'user' ? '#ffffff' : '#1a1f2e',
                        fontSize: 13,
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.content.split('\\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Avatar
                      size={28}
                      icon={<RobotOutlined />}
                      style={{
                        flexShrink: 0,
                        background: 'var(--theme-primary)',
                      }}
                    />
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: '#f5f5f5',
                        fontSize: 13,
                      }}
                    >
                      <span style={{ opacity: 0.6 }}>...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 快捷建议 */}
              {messages.length <= 1 && (
                <>
                  <Divider style={{ margin: '8px 16px' }} />
                  <div style={{ padding: '0 16px 12px' }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#9ca3af',
                        marginBottom: 8,
                      }}
                    >
                      快捷操作
                    </div>
                    <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                      {suggestions.map((suggestion, index) => (
                        <Tag
                          key={index}
                          icon={suggestion.icon}
                          onClick={() => handleSuggestionClick(suggestion.prompt)}
                          style={{
                            cursor: 'pointer',
                            padding: '8px 12px',
                            fontSize: 12,
                            borderRadius: 8,
                            border: '1px solid #e5e7eb',
                            background: '#ffffff',
                            width: '100%',
                            textAlign: 'left',
                          }}
                        >
                          {suggestion.text}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </>
              )}

              {/* 输入区域 */}
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #f0f0f0',
                  background: '#fafbfc',
                }}
              >
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="输入问题..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={handleSend}
                    disabled={loading}
                    style={{
                      fontSize: 13,
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    loading={loading}
                    disabled={!inputValue.trim()}
                  />
                </Space.Compact>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
