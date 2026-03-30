'use client';

import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  loading?: boolean;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  loading = false,
  color = 'var(--theme-primary)',
}) => {
  return (
    <Card
      loading={loading}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        borderTop: '3px solid color',
        boxShadow: '0 1px 8px color-mix(in srgb, color 20%, transparent)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      }}
      styles={{
        body: {
          padding: '20px 24px',
        },
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <span
          style={{
            fontSize: 14,
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          {title}
        </span>
      </div>

      <Statistic
        value={value}
        prefix={prefix}
        suffix={suffix}
        styles={{
          content: {
            fontSize: 28,
            fontWeight: 700,
            color: '#1a1f2e',
          },
        }}
      />

      {trend && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {trend.isUp ? (
            <ArrowUpOutlined
              style={{
                color: '#52c41a',
                fontSize: 12,
              }}
            />
          ) : (
            <ArrowDownOutlined
              style={{
                color: '#f5222d',
                fontSize: 12,
              }}
            />
          )}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: trend.isUp ? '#52c41a' : '#f5222d',
            }}
          >
            {Math.abs(trend.value)}%
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

export default StatCard;
