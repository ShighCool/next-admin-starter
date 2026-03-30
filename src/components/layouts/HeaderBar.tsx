'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar, Badge, Space, Button, Breadcrumb, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  HistoryOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  FireOutlined,
  RobotOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import HistoryPanel from '@/components/features/HistoryPanel';
import ThemeEditor from '@/components/features/ThemeEditor';
import PerformanceMonitor from '@/components/features/PerformanceMonitor';
import { useHeatmap } from '@/hooks/useHeatmap';
import AICommandPanel from '@/components/features/AICommandPanel';
import { useCommandPalette } from '@/components/features/CommandPalette/CommandPaletteContext';

const HeaderBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [notificationCount, setNotificationCount] = useState(3);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { open: openCommandPalette } = useCommandPalette();

  const { config, setConfig, events, isRecording, setIsRecording } = useHeatmap();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('全屏失败:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: '新用户注册通知',
    },
    {
      key: '2',
      label: '系统更新通知',
    },
    {
      key: '3',
      label: '订单提醒',
    },
    {
      type: 'divider',
    },
    {
      key: 'all',
      label: '查看全部',
    },
  ];

  // 生成面包屑
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbItems: Array<{ title: string; href?: string }> = [
      {
        title: '首页',
        href: '/',
      },
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;
      const firstChar = path.charAt(0);
      const title = firstChar ? firstChar.toUpperCase() + path.slice(1) : path;
      breadcrumbItems.push({
        title,
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbItems;
  };

  const [user, setUser] = useState<{ username?: string }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
        setUser(userData);
      } catch {
        setUser({});
      }
    }
  }, []);

  return (
    <div
      style={{
        height: 60,
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        borderBottom: '1px solid var(--theme-border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* 面包屑 */}
      <Breadcrumb
        items={generateBreadcrumbs()}
        style={{
          fontSize: 14,
          color: '#6b7280',
        }}
      />

      {/* 右侧操作栏 */}
      <Space size={12}>
        {/* 功能按钮组 */}
        <Space size={4}>
          <Tooltip title="搜索 (Ctrl+K)">
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={openCommandPalette}
              style={{
                color: '#6b7280',
                fontSize: 16,
              }}
            />
          </Tooltip>
          <HistoryPanel tooltipTitle="操作历史" />
          <ThemeEditor tooltipTitle="主题编辑" />
          <PerformanceMonitor tooltipTitle="性能监控" />
          <Tooltip title={isFullscreen ? '退出全屏' : '全屏显示'}>
            <Button
              type="text"
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullscreen}
              style={{
                color: '#6b7280',
                fontSize: 16,
              }}
            />
          </Tooltip>
          <Tooltip title={config.showHeatmap ? '关闭热力图' : '开启热力图'}>
            <Button
              type="text"
              icon={<FireOutlined />}
              onClick={() => {
                const newShowHeatmap = !config.showHeatmap;
                setConfig({ ...config, showHeatmap: newShowHeatmap });
                setIsRecording(newShowHeatmap);
              }}
              style={{
                color: config.showHeatmap ? '#ff4d4f' : '#6b7280',
                fontSize: 16,
              }}
            />
          </Tooltip>
          <Tooltip title="AI 操作助手">
            <Button
              type="text"
              icon={<RobotOutlined />}
              onClick={() => setAiPanelOpen(true)}
              style={{
                color: '#6b7280',
                fontSize: 16,
              }}
            />
          </Tooltip>
        </Space>

        {/* 分隔线 */}
        <div
          style={{
            width: 1,
            height: 24,
            background: '#e5e7eb',
          }}
        />

        {/* 通知 */}
        <Dropdown menu={{ items: notificationMenuItems }} placement="bottomRight">
          <Badge count={notificationCount} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{
                color: '#6b7280',
                fontSize: 16,
              }}
            />
          </Badge>
        </Dropdown>

        {/* 用户信息 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space
            style={{
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: 6,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'color-mix(in srgb, var(--theme-primary) 8%, white)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{
                background: 'var(--theme-primary)',
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#1a1f2e',
              }}
            >
              {user.username || 'Admin'}
            </span>
          </Space>
        </Dropdown>

        <AICommandPanel open={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
      </Space>
    </div>
  );
};

export default HeaderBar;
