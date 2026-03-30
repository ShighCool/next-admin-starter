'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Tag, Space } from 'antd';
import {
  SearchOutlined,
  MacCommandOutlined,
  UserOutlined,
  BarChartOutlined,
  FormOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { menuItems } from '@/components/layouts/menuConfig';
import { useCommandPalette } from './CommandPaletteContext';

export interface CommandItem {
  id?: string;
  type?: 'page' | 'command' | 'action';
  label: string;
  description?: string;
  icon?: React.ReactNode;
  path?: string;
  action?: () => void;
  keywords?: string[];
  shortcut?: string;
  divider?: boolean;
}

const CommandPalette: React.FC = () => {
  const { isOpen, open, close } = useCommandPalette();
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState<CommandItem[]>([]);
  const router = useRouter();
  const inputRef = useRef<any>(null);

  // 命令列表
  const commands: CommandItem[] = [
    // 页面
    ...getAllPagesFromMenu(),
    { divider: true, label: '命令' },
    // 命令
    {
      id: 'theme-toggle',
      type: 'command',
      label: '切换主题',
      description: '在浅色和深色主题之间切换',
      icon: <MoonOutlined />,
      action: () => {
        const body = document.body;
        body.classList.toggle('dark');
      },
      keywords: ['theme', 'dark', 'light', '模式', '主题'],
      shortcut: 'Ctrl+T',
    },
    {
      id: 'settings',
      type: 'command',
      label: '系统设置',
      description: '打开系统设置页面',
      icon: <SettingOutlined />,
      action: () => {
        router.push('/settings');
      },
      keywords: ['settings', '设置', '配置'],
      shortcut: 'Ctrl+,',
    },
    {
      id: 'logout',
      type: 'command',
      label: '退出登录',
      description: '退出当前账户',
      icon: <UserOutlined />,
      action: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      },
      keywords: ['logout', 'exit', '退出', '登出'],
      shortcut: 'Ctrl+Q',
    },
  ];

  function getAllPagesFromMenu(): CommandItem[] {
    const pages: CommandItem[] = [];

    function traverse(items: any[]) {
      items.forEach((item) => {
        if (item.path && item.path !== '') {
          pages.push({
            id: item.key,
            type: 'page' as const,
            label: item.label,
            path: item.path,
            icon: item.icon,
            keywords: [item.label, item.key],
          });
        }
        if (item.children) {
          traverse(item.children);
        }
      });
    }

    traverse(menuItems);
    return pages;
  }

  // 模糊搜索算法
  const fuzzyMatch = (text: string, query: string): boolean => {
    if (!query) return true;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // 精确匹配
    if (lowerText.includes(lowerQuery)) return true;

    // 拼音匹配（简单实现）
    const pinyin = text.toLowerCase().replace(/[a-z]/g, '');
    if (pinyin.includes(lowerQuery)) return true;

    // 模糊匹配
    let queryIndex = 0;
    for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
      if (lowerText[i] === lowerQuery[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === lowerQuery.length;
  };

  // 高亮匹配文本
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let matchIndex = lowerText.indexOf(lowerQuery);

    while (matchIndex !== -1) {
      parts.push(text.slice(lastIndex, matchIndex));
      parts.push(
        <span
          key={matchIndex}
          style={{
            background: 'var(--theme-primary)',
            color: '#fff',
            padding: '0 2px',
            borderRadius: 2,
          }}
        >
          {text.slice(matchIndex, matchIndex + query.length)}
        </span>
      );
      lastIndex = matchIndex + query.length;
      matchIndex = lowerText.indexOf(lowerQuery, lastIndex);
    }

    parts.push(text.slice(lastIndex));
    return <>{parts}</>;
  };

  useEffect(() => {
    if (!searchValue) {
      setFilteredItems(commands.filter((c: any) => !c.divider));
      setSelectedIndex(0);
      return;
    }

    const filtered = commands
      .filter((item: any) => {
        if (item.divider) return false;
        const searchText = item.label + ' ' + (item.keywords?.join(' ') || '');
        return fuzzyMatch(searchText, searchValue);
      })
      .slice(0, 10);

    setFilteredItems(filtered);
    setSelectedIndex(0);
  }, [searchValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K 或 Cmd+K 打开命令面板
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
      // ESC 关闭
      if (e.key === 'Escape' && isOpen) {
        close();
      }
      // 上下键导航
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        }
        // Enter 选择
        if (e.key === 'Enter') {
          e.preventDefault();
          const selectedItem = filteredItems[selectedIndex];
          if (selectedItem) {
            handleSelect(selectedItem);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, open, close]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (item: CommandItem) => {
    if (item.type === 'page' && item.path) {
      router.push(item.path);
    } else if (item.action) {
      item.action();
    }
    close();
    setSearchValue('');
  };

  return (
    <Modal
      open={isOpen}
      onCancel={close}
      footer={null}
      closable={false}
      width={640}
      styles={{
        body: { padding: 0 },
      }}
    >
      <div
        style={{
          padding: '16px 16px 8px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Input
          ref={inputRef}
          size="large"
          placeholder="搜索页面、命令... (↑↓ 导航, Enter 选择)"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoFocus
          style={{
            border: 'none',
            boxShadow: 'none',
            fontSize: 16,
          }}
        />
      </div>

      <div
        style={{
          maxHeight: 400,
          overflowY: 'auto',
          padding: '8px 0',
        }}
      >
        {filteredItems.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af',
            }}
          >
            没有找到匹配的结果
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background:
                  index === selectedIndex
                    ? 'color-mix(in srgb, var(--theme-primary) 10%, white)'
                    : 'transparent',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {item.icon && (
                <span style={{ fontSize: 16, color: 'var(--theme-primary)' }}>{item.icon}</span>
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#1a1f2e',
                    marginBottom: 2,
                  }}
                >
                  {highlightMatch(item.label, searchValue)}
                </div>
                {item.description && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                    }}
                  >
                    {item.description}
                  </div>
                )}
              </div>
              {item.shortcut && (
                <Tag
                  style={{
                    fontSize: 11,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: '#f5f5f5',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {item.shortcut}
                </Tag>
              )}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        <Space size={16}>
          <span>
            <kbd style={{ padding: '2px 4px', background: '#f5f5f5', borderRadius: 3 }}>↑↓</kbd>{' '}
            导航
          </span>
          <span>
            <kbd style={{ padding: '2px 4px', background: '#f5f5f5', borderRadius: 3 }}>Enter</kbd>{' '}
            选择
          </span>
          <span>
            <kbd style={{ padding: '2px 4px', background: '#f5f5f5', borderRadius: 3 }}>Esc</kbd>{' '}
            关闭
          </span>
        </Space>
        <span>
          按 <MacCommandOutlined /> + K 打开
        </span>
      </div>
    </Modal>
  );
};

export default CommandPalette;
