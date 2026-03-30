'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRouteTabs } from './RouteTabsContext';
import { Button } from 'antd';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

const RouteTabs: React.FC = () => {
  const { tabs, activeTab, removeTab, setActiveTab, toggleCollapse, isCollapsed, isSwitching } =
    useRouteTabs();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (tab: { key: string; path: string }) => {
    setActiveTab(tab.key);
    router.push(tab.path);
  };

  const handleTabClose = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    removeTab(key);
  };

  const handleCloseAll = () => {
    tabs.forEach((tab) => removeTab(tab.key));
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        borderBottom: '1px solid var(--theme-border-color)',
        padding: isCollapsed ? '8px 24px' : '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="route-tabs-container"
      >
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={(e) => {
              if (activeTab === tab.key) {
                e.currentTarget.style.background =
                  'color-mix(in srgb, var(--theme-primary) 85%, black)';
              } else {
                e.currentTarget.style.background =
                  'color-mix(in srgb, var(--theme-primary) 12%, #f5f5f5)';
                e.currentTarget.style.borderColor =
                  'color-mix(in srgb, var(--theme-primary) 30%, transparent)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                activeTab === tab.key ? 'var(--theme-primary)' : '#f5f5f5';
              e.currentTarget.style.borderColor =
                activeTab === tab.key ? 'none' : '1px solid transparent';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === tab.key ? 'var(--theme-primary)' : '#f5f5f5',
              color: activeTab === tab.key ? '#ffffff' : '#4a5568',
              border: activeTab === tab.key ? 'none' : '1px solid transparent',
              boxShadow:
                activeTab === tab.key
                  ? '0 2px 8px color-mix(in srgb, var(--theme-primary) 40%, transparent)'
                  : 'none',
              transform: activeTab === tab.key ? 'translateY(-1px)' : 'translateY(0)',
            }}
          >
            <span style={{ lineHeight: 1.5 }}>{tab.title}</span>
            <button
              onClick={(e) => handleTabClose(e, tab.key)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab.key ? '#ffffff' : '#9ca3af',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '10px',
                padding: 0,
              }}
            >
              <CloseOutlined />
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {!isCollapsed && tabs.length > 1 && (
          <Button
            type="link"
            size="small"
            onClick={handleCloseAll}
            style={{
              color: '#6b7280',
              fontSize: '12px',
              fontWeight: 500,
              padding: '4px 8px',
              height: 'auto',
            }}
          >
            关闭全部
          </Button>
        )}
        <Button
          type="text"
          size="small"
          icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={toggleCollapse}
          style={{
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'color-mix(in srgb, var(--theme-primary) 8%, white)';
            e.currentTarget.style.color = 'var(--theme-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        />
      </div>

      <style jsx global>{`
        .route-tabs-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RouteTabs;
