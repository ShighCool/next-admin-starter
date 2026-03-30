'use client';

import { useState, useCallback, useEffect } from 'react';
import { WorkspaceLayout, LayoutItem, WorkspaceTemplate } from '@/types/workspace';

const STORAGE_KEY = 'workspace-layout';
const TEMPLATES_KEY = 'workspace-templates';

export const useWorkspace = () => {
  const [layout, setLayout] = useState<WorkspaceLayout | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // 加载布局
  const loadLayout = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (error) {
        console.error('加载布局失败:', error);
      }
    } else {
      // 使用默认布局
      const defaultLayout: WorkspaceLayout = {
        id: 'default',
        name: '默认工作台',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDefault: true,
        items: [
          {
            id: 'stat-1',
            type: 'stat-card',
            x: 0,
            y: 0,
            w: 3,
            h: 2,
            config: { title: '总用户数', value: 12580, trend: 12.5, icon: 'UserOutlined' },
          },
          {
            id: 'stat-2',
            type: 'stat-card',
            x: 3,
            y: 0,
            w: 3,
            h: 2,
            config: { title: '今日访问', value: 3456, trend: 8.3, icon: 'EyeOutlined' },
          },
          {
            id: 'stat-3',
            type: 'stat-card',
            x: 6,
            y: 0,
            w: 3,
            h: 2,
            config: { title: '订单数量', value: 892, trend: -3.2, icon: 'ShoppingCartOutlined' },
          },
          {
            id: 'stat-4',
            type: 'stat-card',
            x: 9,
            y: 0,
            w: 3,
            h: 2,
            config: {
              title: '总收入',
              value: 125680,
              trend: 15.7,
              icon: 'DollarOutlined',
              prefix: '¥',
            },
          },
          {
            id: 'chart-1',
            type: 'chart-line',
            x: 0,
            y: 2,
            w: 8,
            h: 4,
            config: { title: '访问趋势' },
          },
          {
            id: 'chart-2',
            type: 'chart-bar',
            x: 8,
            y: 2,
            w: 4,
            h: 4,
            config: { title: '用户增长' },
          },
          {
            id: 'todo-1',
            type: 'todo-list',
            x: 0,
            y: 6,
            w: 4,
            h: 3,
            config: { title: '待办事项' },
          },
          {
            id: 'quick-1',
            type: 'quick-links',
            x: 4,
            y: 6,
            w: 4,
            h: 3,
            config: { title: '快捷入口' },
          },
          {
            id: 'activity-1',
            type: 'recent-activity',
            x: 8,
            y: 6,
            w: 4,
            h: 3,
            config: { title: '最近活动' },
          },
        ],
      };
      setLayout(defaultLayout);
    }
  }, []);

  // 保存布局
  const saveLayout = useCallback((newLayout: WorkspaceLayout) => {
    setLayout(newLayout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
  }, []);

  // 更新布局项
  const updateLayoutItem = useCallback(
    (itemId: string, updates: Partial<LayoutItem>) => {
      if (!layout) return;

      const newItems = layout.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      );

      saveLayout({
        ...layout,
        items: newItems,
        updatedAt: new Date(),
      });
    },
    [layout, saveLayout]
  );

  // 添加布局项
  const addLayoutItem = useCallback(
    (item: LayoutItem) => {
      if (!layout) return;

      const newItems = [...layout.items, item];
      saveLayout({
        ...layout,
        items: newItems,
        updatedAt: new Date(),
      });
    },
    [layout, saveLayout]
  );

  // 删除布局项
  const removeLayoutItem = useCallback(
    (itemId: string) => {
      if (!layout) return;

      const newItems = layout.items.filter((item) => item.id !== itemId);
      saveLayout({
        ...layout,
        items: newItems,
        updatedAt: new Date(),
      });
    },
    [layout, saveLayout]
  );

  // 重置布局
  const resetLayout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    loadLayout();
  }, [loadLayout]);

  // 保存模板
  const saveTemplate = useCallback((template: WorkspaceTemplate) => {
    const saved = localStorage.getItem(TEMPLATES_KEY);
    const templates: WorkspaceTemplate[] = saved ? JSON.parse(saved) : [];

    const index = templates.findIndex((t) => t.id === template.id);
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }

    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }, []);

  // 加载模板
  const loadTemplate = useCallback(
    (templateId: string) => {
      const saved = localStorage.getItem(TEMPLATES_KEY);
      const templates: WorkspaceTemplate[] = saved ? JSON.parse(saved) : [];

      const template = templates.find((t) => t.id === templateId);
      if (template) {
        const newLayout: WorkspaceLayout = {
          id: `workspace-${Date.now()}`,
          name: template.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDefault: false,
          items: template.items,
        };
        saveLayout(newLayout);
        setSelectedTemplate(templateId);
      }
    },
    [saveLayout]
  );

  // 删除模板
  const deleteTemplate = useCallback((templateId: string) => {
    const saved = localStorage.getItem(TEMPLATES_KEY);
    const templates: WorkspaceTemplate[] = saved ? JSON.parse(saved) : [];

    const newTemplates = templates.filter((t) => t.id !== templateId);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(newTemplates));
  }, []);

  useEffect(() => {
    loadLayout();
  }, [loadLayout]);

  return {
    layout,
    isEditing,
    setIsEditing,
    selectedTemplate,
    setSelectedTemplate,
    updateLayoutItem,
    addLayoutItem,
    removeLayoutItem,
    saveLayout,
    resetLayout,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
  };
};
