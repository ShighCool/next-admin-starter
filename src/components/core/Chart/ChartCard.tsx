'use client';

import React from 'react';
import { Card } from 'antd';

export interface ChartProps {
  title?: React.ReactNode;
  height?: number;
  extra?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
}

const ChartCard: React.FC<ChartProps> = ({
  title,
  height = 400,
  extra,
  children,
  loading = false,
}) => {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        borderTop: '3px solid var(--theme-primary)',
        boxShadow: '0 1px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
      }}
      styles={{
        body: {
          padding: '24px',
        },
      }}
    >
      <div style={{ height }}>{children}</div>
    </Card>
  );
};

export default ChartCard;
