'use client';

import React from 'react';
import { Card, Statistic } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { LayoutItem } from '@/types/workspace';

interface StatCardWidgetProps {
  item: LayoutItem;
  isEditing?: boolean;
}

const StatCardWidget: React.FC<StatCardWidgetProps> = ({ item, isEditing }) => {
  const config = item.config || {};

  const iconMap: Record<string, React.ReactNode> = {
    UserOutlined: <UserOutlined />,
    EyeOutlined: <EyeOutlined />,
    ShoppingCartOutlined: <ShoppingCartOutlined />,
    DollarOutlined: <DollarOutlined />,
  };

  return (
    <Card
      style={{
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        borderTop: '3px solid var(--theme-primary)',
        boxShadow: '0 1px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
      }}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div style={{ marginBottom: 12 }}>
        <span
          style={{
            fontSize: 14,
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          {config.title}
        </span>
      </div>

      <Statistic
        value={config.value}
        prefix={config.prefix}
        suffix={config.suffix}
        styles={{
          content: {
            fontSize: 28,
            fontWeight: 700,
            color: '#1a1f2e',
          },
        }}
      />

      {config.trend !== undefined && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {config.trend > 0 ? (
            <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 12 }} />
          ) : (
            <ArrowDownOutlined style={{ color: '#f5222d', fontSize: 12 }} />
          )}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: config.trend > 0 ? '#52c41a' : '#f5222d',
            }}
          >
            {Math.abs(config.trend)}%
          </span>
          <span
            style={{
              fontSize: 12,
              color: '#9ca3af',
            }}
          >
            较上周
          </span>
        </div>
      )}
    </Card>
  );
};

export default StatCardWidget;
