'use client';

import { useEffect, useCallback } from 'react';

export interface Shortcut {
  key: string;
  label: string;
  description?: string;
  action: () => void;
  disabled?: boolean;
  global?: boolean; // 是否全局快捷键
}

let shortcuts: Shortcut[] = [];

export const registerShortcut = (shortcut: Shortcut) => {
  shortcuts.push(shortcut);
  return () => {
    shortcuts = shortcuts.filter((s) => s.key !== shortcut.key);
  };
};

export const unregisterShortcut = (key: string) => {
  shortcuts = shortcuts.filter((s) => s.key !== key);
};

export const getShortcuts = () => shortcuts;

export const useShortcut = (shortcut: Shortcut) => {
  useEffect(() => {
    const cleanup = registerShortcut(shortcut);
    return cleanup;
  }, [shortcut]);
};

export const useGlobalKeyboard = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否在输入框中
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isInput) return;

      // 生成快捷键字符串
      const parts: string[] = [];
      if (e.ctrlKey) parts.push('Ctrl');
      if (e.metaKey) parts.push('Cmd');
      if (e.altKey) parts.push('Alt');
      if (e.shiftKey) parts.push('Shift');
      if (e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Alt' && e.key !== 'Shift') {
        parts.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      }

      const key = parts.join('+');

      // 查找匹配的快捷键
      const matchedShortcut = shortcuts.find((s) => s.key === key && !s.disabled && s.global);

      if (matchedShortcut) {
        e.preventDefault();
        matchedShortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// 默认快捷键
export const defaultShortcuts: Shortcut[] = [
  {
    key: 'Ctrl+K',
    label: '命令面板',
    description: '打开全局命令面板',
    action: () => {
      // 由 CommandPalette 组件处理
    },
    global: true,
  },
  {
    key: 'Ctrl+B',
    label: '侧边栏',
    description: '切换侧边栏显示/隐藏',
    action: () => {
      // 切换侧边栏
    },
    global: true,
  },
  {
    key: 'Ctrl+/',
    label: '快捷键',
    description: '显示快捷键列表',
    action: () => {
      // 显示快捷键面板
    },
    global: true,
  },
  {
    key: 'Ctrl+T',
    label: '切换主题',
    description: '在浅色和深色主题之间切换',
    action: () => {
      document.body.classList.toggle('dark');
    },
    global: true,
  },
  {
    key: 'Ctrl+Q',
    label: '退出登录',
    description: '退出当前账户',
    action: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
    global: true,
  },
  {
    key: 'Ctrl+.',
    label: 'AI 助手',
    description: '打开/关闭 AI 助手',
    action: () => {
      // 切换 AI 助手
    },
    global: true,
  },
  {
    key: 'Escape',
    label: '关闭弹窗',
    description: '关闭当前打开的弹窗',
    action: () => {
      // 关闭弹窗逻辑
    },
    global: true,
  },
];
