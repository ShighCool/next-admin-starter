'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, Button, Tooltip, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { menuItems, MenuItem } from './menuConfig';
import { useRouteTabs } from './RouteTabsContext';
import { useHeatmap } from '@/hooks/useHeatmap';
import HeatmapOverlay from '@/components/features/HeatmapOverlay';

const SideMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { menuOpenKeys, setMenuOpenKeys } = useRouteTabs();
  const [collapsed, setCollapsed] = useState(false);

  const { config, setConfig, events, isRecording, setIsRecording } = useHeatmap();

  const menuItemsWithKeys = useMemo(() => {
    const convertToAntdMenuItems = (items: MenuItem[]): MenuProps['items'] => {
      return items.map((item) => ({
        key: item.key,
        label: <span data-text={item.label}>{item.label}</span>,
        icon: item.icon,
        children: item.children ? convertToAntdMenuItems(item.children) : undefined,
      }));
    };
    return convertToAntdMenuItems(menuItems);
  }, []);

  const selectedKeys = useMemo(() => {
    const findSelectedKey = (items: MenuItem[], path: string): string | null => {
      for (const item of items) {
        if (item.path === path) {
          return item.key;
        }
        if (item.children) {
          const childKey = findSelectedKey(item.children, path);
          if (childKey) {
            return childKey;
          }
        }
      }
      return null;
    };
    const key = findSelectedKey(menuItems, pathname);
    return key ? [key] : [];
  }, [pathname]);

  const handleMenuSelect: MenuProps['onSelect'] = ({ key }) => {
    const findMenuItemByKey = (items: MenuItem[], targetKey: string): MenuItem | null => {
      for (const item of items) {
        if (item.key === targetKey) {
          return item;
        }
        if (item.children) {
          const found = findMenuItemByKey(item.children, targetKey);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const menuItem = findMenuItemByKey(menuItems, key);
    if (menuItem) {
      if (menuItem.path) {
        // 如果菜单项有路径，则跳转
        router.push(menuItem.path);
      } else if (menuItem.children && menuItem.children.length > 0) {
        // 如果菜单项有子菜单但没有路径，展开第一个子菜单
        const firstChild = menuItem.children[0];
        if (firstChild && firstChild.path) {
          router.push(firstChild.path);
        }
      }
    }
  };

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setMenuOpenKeys(keys as string[]);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        width: collapsed ? 64 : 200,
        height: '100%',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        borderRight: '1px solid var(--theme-border-color)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          padding: '12px',
          borderBottom: '1px solid var(--theme-border-color)',
          background:
            'linear-gradient(90deg, var(--theme-primary) 0%, color-mix(in srgb, var(--theme-primary) 80%, white) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: 72,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? 'scale(0.6)' : 'scale(1)',
            transition:
              'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'absolute',
            left: 12,
          }}
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            loading="eager"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
        <Tooltip title={collapsed ? '展开菜单' : '折叠菜单'} placement="right">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapse}
            style={{
              color: '#ffffff',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              flexShrink: 0,
              marginLeft: collapsed ? 'auto' : '12px',
              marginRight: collapsed ? 'auto' : '12px',
            }}
          />
        </Tooltip>
      </div>

      <HeatmapOverlay
        events={events}
        config={config}
        onConfigChange={(newConfig) => setConfig({ ...config, ...newConfig })}
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px 0',
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={menuOpenKeys}
          onOpenChange={handleOpenChange}
          onSelect={handleMenuSelect}
          items={menuItemsWithKeys}
          inlineCollapsed={collapsed}
          triggerSubMenuAction="hover"
          style={{
            border: 'none',
            background: 'transparent',
          }}
          theme="light"
          getPopupContainer={typeof window !== 'undefined' ? () => document.body : undefined}
        />
      </div>
    </div>
  );
};

export default SideMenu;
