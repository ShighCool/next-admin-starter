'use client';

import React, { useState, useEffect } from 'react';
import { Drawer, List, Button, Space, Typography, Timeline, Tag, Tooltip } from 'antd';
import {
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import {
  getGlobalHistory,
  canUndoGlobal,
  canRedoGlobal,
  undoGlobal,
  redoGlobal,
  clearGlobalHistory,
} from '@/hooks/useHistory';

const { Text } = Typography;

interface HistoryPanelProps {
  tooltipTitle?: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ tooltipTitle = '操作历史' }) => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(getGlobalHistory());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    // 监听历史变化
    const interval = setInterval(() => {
      setHistory(getGlobalHistory());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleUndo = () => {
    undoGlobal();
    setHistory(getGlobalHistory());
  };

  const handleRedo = () => {
    redoGlobal();
    setHistory(getGlobalHistory());
  };

  const handleClear = () => {
    clearGlobalHistory();
    setHistory([]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return `${Math.floor(diff / 86400000)} 天前`;
  };

  return (
    <>
      {/* 触发按钮（可以在 HeaderBar 中添加） */}
      <Tooltip title={tooltipTitle}>
        <Button
          type="text"
          icon={<HistoryOutlined />}
          onClick={() => setOpen(true)}
          style={{
            color: '#6b7280',
            fontSize: 16,
          }}
        />
      </Tooltip>

      <Drawer
        title={
          <Space>
            <HistoryOutlined />
            <span>操作历史</span>
          </Space>
        }
        onClose={() => setOpen(false)}
        open={open}
        size={400}
        extra={
          <Space>
            <Button
              type="text"
              icon={<UndoOutlined />}
              onClick={handleUndo}
              disabled={!canUndoGlobal()}
              size="small"
            >
              撤销
            </Button>
            <Button
              type="text"
              icon={<RedoOutlined />}
              onClick={handleRedo}
              disabled={!canRedoGlobal()}
              size="small"
            >
              重做
            </Button>
            <Button type="text" icon={<DeleteOutlined />} onClick={handleClear} size="small" danger>
              清空
            </Button>
          </Space>
        }
      >
        {history.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af',
            }}
          >
            暂无操作历史
          </div>
        ) : (
          <Timeline
            mode="left"
            items={history.map((item, index) => ({
              color: index === history.length - 1 ? 'var(--theme-primary)' : 'gray',
              dot: <ClockCircleOutlined style={{ fontSize: 16 }} />,
              children: (
                <div
                  key={item.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    background:
                      index === history.length - 1
                        ? 'color-mix(in srgb, var(--theme-primary) 5%, white)'
                        : 'transparent',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <Text strong>{item.action}</Text>
                    <Tag
                      style={{
                        fontSize: 11,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {formatTime(item.timestamp)}
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.description}
                  </Text>
                </div>
              ),
            }))}
          />
        )}
      </Drawer>
    </>
  );
};

export default HistoryPanel;
