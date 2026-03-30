'use client';

import React, { useState, useEffect } from 'react';
import { Modal, List, Tag, Space, Typography, Divider } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { getShortcuts, defaultShortcuts } from '@/hooks/useShortcut';

const { Text } = Typography;

const ShortcutList: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
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

  const shortcuts = [...defaultShortcuts, ...getShortcuts()];

  return (
    <Modal
      title={
        <Space>
          <KeyOutlined />
          <span>快捷键列表</span>
        </Space>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={700}
    >
      <div style={{ padding: '16px 0' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          提示：按 Ctrl+/ (Cmd+/) 打开此列表
        </Text>
      </div>

      <List
        dataSource={shortcuts}
        renderItem={(shortcut) => (
          <List.Item
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>{shortcut.label}</Text>
                  <Tag
                    style={{
                      background: 'var(--theme-primary)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '2px 8px',
                      fontSize: 11,
                      borderRadius: 4,
                    }}
                  >
                    {shortcut.key}
                  </Tag>
                </Space>
              }
              description={shortcut.description}
            />
          </List.Item>
        )}
        style={{
          maxHeight: 400,
          overflowY: 'auto',
        }}
      />
    </Modal>
  );
};

export default ShortcutList;
