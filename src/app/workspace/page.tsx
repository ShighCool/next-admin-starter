'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Space, Card, Row, Col, Drawer, Typography, Tag, App } from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useWorkspace } from '@/hooks/useWorkspace';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ComponentLibraryItem } from '@/types/workspace';
import AuthGuard from '@/components/auth/AuthGuard';
import StatCardWidget from '@/components/workspace/widgets/StatCardWidget';
import LineChart from '@/components/core/Chart/LineChart';
import BarChart from '@/components/core/Chart/BarChart';

const { Text } = Typography;

// 组件库
const componentLibrary: ComponentLibraryItem[] = [
  {
    type: 'stat-card',
    name: '统计卡片',
    description: '显示关键指标',
    icon: 'statistic',
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    category: 'data',
  },
  {
    type: 'chart-line',
    name: '折线图',
    description: '趋势分析',
    icon: 'line-chart',
    defaultSize: { w: 8, h: 4 },
    minSize: { w: 4, h: 3 },
    category: 'chart',
  },
  {
    type: 'chart-bar',
    name: '柱状图',
    description: '数据对比',
    icon: 'bar-chart',
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    category: 'chart',
  },
  {
    type: 'todo-list',
    name: '待办列表',
    description: '任务管理',
    icon: 'check-circle',
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    category: 'productivity',
  },
  {
    type: 'quick-links',
    name: '快捷入口',
    description: '快速访问',
    icon: 'link',
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 3, h: 2 },
    category: 'productivity',
  },
];

export default function WorkspacePage() {
  usePageTitle('工作区');
  const { message } = App.useApp();
  const router = useRouter();

  const {
    layout,
    isEditing,
    setIsEditing,
    updateLayoutItem,
    addLayoutItem,
    removeLayoutItem,
    saveLayout,
    resetLayout,
  } = useWorkspace();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAddComponent = (component: ComponentLibraryItem) => {
    const newItem = {
      id: Date.now().toString(),
      type: component.type,
      x: 0,
      y: 0,
      w: component.defaultSize.w,
      h: component.defaultSize.h,
      minW: component.minSize.w,
      minH: component.minSize.h,
      config: { title: component.name },
    };
    addLayoutItem(newItem);
    setDrawerOpen(false);
  };

  const handleRemoveComponent = (itemId: string) => {
    removeLayoutItem(itemId);
  };

  const renderWidget = (item: any) => {
    switch (item.type) {
      case 'stat-card':
        return <StatCardWidget item={item} isEditing={isEditing} />;
      case 'chart-line':
        return (
          <Card
            title={item.config?.title}
            style={{ height: '100%', borderRadius: 12 }}
            styles={{ body: { padding: '16px' } }}
          >
            <LineChart
              data={[
                { name: '1月', value: 820 },
                { name: '2月', value: 932 },
                { name: '3月', value: 901 },
                { name: '4月', value: 934 },
                { name: '5月', value: 1290 },
                { name: '6月', value: 1330 },
              ]}
              height={300}
              color="var(--theme-primary)"
            />
          </Card>
        );
      case 'chart-bar':
        return (
          <Card
            title={item.config?.title}
            style={{ height: '100%', borderRadius: 12 }}
            styles={{ body: { padding: '16px' } }}
          >
            <BarChart
              data={[
                { name: '产品A', value: 1200 },
                { name: '产品B', value: 1320 },
                { name: '产品C', value: 1010 },
              ]}
              height={300}
              color="#9B59B6"
            />
          </Card>
        );
      case 'todo-list':
        return (
          <Card
            title={item.config?.title}
            style={{ height: '100%', borderRadius: 12 }}
            styles={{ body: { padding: '16px' } }}
          >
            <div style={{ padding: '8px 0', color: '#6b7280', fontSize: 13 }}>
              <div style={{ marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#f5222d',
                    marginRight: 8,
                  }}
                ></span>
                <span>完成系统升级</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#faad14',
                    marginRight: 8,
                  }}
                ></span>
                <span>审核待处理</span>
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#52c41a',
                    marginRight: 8,
                  }}
                ></span>
                <span>数据备份</span>
              </div>
            </div>
          </Card>
        );
      case 'quick-links':
        return (
          <Card
            title={item.config?.title}
            style={{ height: '100%', borderRadius: 12 }}
            styles={{ body: { padding: '16px' } }}
          >
            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
              <div
                style={{
                  padding: '12px',
                  borderRadius: 8,
                  background: 'var(--theme-primary)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
                onClick={() => router.push('/examples/users')}
              >
                用户管理
              </div>
              <div
                style={{
                  padding: '12px',
                  borderRadius: 8,
                  background: '#52c41a',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
                onClick={() => router.push('/analytics')}
              >
                数据统计
              </div>
              <div
                style={{
                  padding: '12px',
                  borderRadius: 8,
                  background: '#faad14',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
                onClick={() => router.push('/settings')}
              >
                系统设置
              </div>
            </Space>
          </Card>
        );
      default:
        return (
          <Card style={{ height: '100%', borderRadius: 12 }}>
            <Text type="secondary">未知组件类型: {item.type}</Text>
          </Card>
        );
    }
  };

  if (!layout) {
    return (
      <AuthGuard>
        <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>加载中...</div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div style={{ padding: '24px', minHeight: 'calc(100vh - 120px)' }}>
        {/* 工作台头部 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            padding: '20px 24px',
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid var(--theme-border-color)',
            boxShadow: '0 1px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                margin: 0,
                color: '#1a1f2e',
              }}
            >
              {layout.name}
            </h1>
            <Text type="secondary" style={{ fontSize: 13 }}>
              最后更新: {new Date(layout.updatedAt).toLocaleString()}
            </Text>
          </div>
          <Space>
            <Button icon={<AppstoreOutlined />} onClick={() => setDrawerOpen(true)}>
              添加组件
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsEditing(!isEditing)}
              type={isEditing ? 'primary' : 'default'}
            >
              {isEditing ? '完成编辑' : '编辑布局'}
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => {
                const templateName = prompt('请输入模板名称：', '我的工作区');
                if (templateName) {
                  const templates = JSON.parse(localStorage.getItem('workspace-templates') || '[]');
                  templates.push({
                    id: Date.now(),
                    name: templateName,
                    layout: layout,
                    createdAt: new Date().toISOString(),
                  });
                  localStorage.setItem('workspace-templates', JSON.stringify(templates));
                  message.success('模板保存成功');
                }
              }}
            >
              保存模板
            </Button>
            <Button icon={<SaveOutlined />} onClick={() => saveLayout(layout)}>
              保存
            </Button>
            <Button icon={<DeleteOutlined />} onClick={resetLayout} danger>
              重置
            </Button>
          </Space>
        </div>

        {/* 工作台网格布局 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '16px',
            minHeight: 600,
          }}
        >
          {layout.items.map((item) => (
            <div
              key={item.id}
              style={{
                gridColumn: `span ${item.w}`,
                gridRow: `auto / span ${item.h}`,
                position: 'relative',
              }}
            >
              {renderWidget(item)}
              {isEditing && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveComponent(item.id)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 4,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* 组件库抽屉 */}
        <Drawer
          title={
            <Space>
              <AppstoreOutlined />
              <span>组件库</span>
            </Space>
          }
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          size={400}
        >
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: 13, marginBottom: 12, display: 'block' }}>
                数据类组件
              </Text>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                {componentLibrary
                  .filter((c) => c.category === 'data')
                  .map((component) => (
                    <Card
                      key={component.type}
                      size="small"
                      hoverable
                      onClick={() => handleAddComponent(component)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e5e7eb',
                      }}
                      styles={{ body: { padding: '12px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag color="blue" style={{ margin: 0 }}>
                          {component.category}
                        </Tag>
                        <Text style={{ flex: 1, fontWeight: 500 }}>{component.name}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {component.description}
                      </Text>
                    </Card>
                  ))}
              </Space>
            </div>

            <div>
              <Text strong style={{ fontSize: 13, marginBottom: 12, display: 'block' }}>
                图表类组件
              </Text>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                {componentLibrary
                  .filter((c) => c.category === 'chart')
                  .map((component) => (
                    <Card
                      key={component.type}
                      size="small"
                      hoverable
                      onClick={() => handleAddComponent(component)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e5e7eb',
                      }}
                      styles={{ body: { padding: '12px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag color="purple" style={{ margin: 0 }}>
                          {component.category}
                        </Tag>
                        <Text style={{ flex: 1, fontWeight: 500 }}>{component.name}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {component.description}
                      </Text>
                    </Card>
                  ))}
              </Space>
            </div>

            <div>
              <Text strong style={{ fontSize: 13, marginBottom: 12, display: 'block' }}>
                生产力组件
              </Text>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                {componentLibrary
                  .filter((c) => c.category === 'productivity')
                  .map((component) => (
                    <Card
                      key={component.type}
                      size="small"
                      hoverable
                      onClick={() => handleAddComponent(component)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #e5e7eb',
                      }}
                      styles={{ body: { padding: '12px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag color="green" style={{ margin: 0 }}>
                          {component.category}
                        </Tag>
                        <Text style={{ flex: 1, fontWeight: 500 }}>{component.name}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {component.description}
                      </Text>
                    </Card>
                  ))}
              </Space>
            </div>
          </Space>
        </Drawer>
      </div>
    </AuthGuard>
  );
}
