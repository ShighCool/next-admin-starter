'use client';

import React, { useState } from 'react';
import { Row, Col, Button, Card, Radio, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import ChartCard from '@/components/core/Chart/ChartCard';
import LineChart from '@/components/core/Chart/LineChart';
import BarChart from '@/components/core/Chart/BarChart';
import AuthGuard from '@/components/auth/AuthGuard';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ChartsExamplePage() {
  usePageTitle('图表示例');

  const [theme, setTheme] = useState<'blue' | 'green' | 'orange'>('blue');
  const [loading, setLoading] = useState(false);

  const colors = {
    blue: 'var(--theme-primary)',
    green: '#52c41a',
    orange: '#fa8c16',
  };

  const lineChartData = [
    { name: '1月', value: 820 },
    { name: '2月', value: 932 },
    { name: '3月', value: 901 },
    { name: '4月', value: 934 },
    { name: '5月', value: 1290 },
    { name: '6月', value: 1330 },
    { name: '7月', value: 1320 },
    { name: '8月', value: 1450 },
    { name: '9月', value: 1500 },
    { name: '10月', value: 1420 },
    { name: '11月', value: 1380 },
    { name: '12月', value: 1350 },
  ];

  const barChartData = [
    { name: '产品A', value: 1200 },
    { name: '产品B', value: 1320 },
    { name: '产品C', value: 1010 },
    { name: '产品D', value: 1340 },
    { name: '产品E', value: 900 },
    { name: '产品F', value: 2300 },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthGuard>
      <div style={{ padding: '2px' }}>
        <div
          style={{
            padding: '20px 24px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
              color: '#1a1f2e',
            }}
          >
            图表示例
          </h1>
          <Space>
            <Radio.Group value={theme} onChange={(e) => setTheme(e.target.value)} size="small">
              <Radio.Button value="blue">蓝色</Radio.Button>
              <Radio.Button value="green">绿色</Radio.Button>
              <Radio.Button value="orange">橙色</Radio.Button>
            </Radio.Group>
            <Button
              type="default"
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} style={{ padding: '0 24px' }}>
          <Col xs={24} lg={12}>
            <ChartCard title="年度销售趋势" height={300} loading={loading}>
              <LineChart data={lineChartData} height={300} color={colors[theme]} />
            </ChartCard>
          </Col>

          <Col xs={24} lg={12}>
            <ChartCard title="产品销量对比" height={300} loading={loading}>
              <BarChart data={barChartData} height={300} color={colors[theme]} />
            </ChartCard>
          </Col>

          <Col xs={24} lg={12}>
            <ChartCard title="月度访问量" height={300} loading={loading}>
              <LineChart data={lineChartData.slice(0, 7)} height={300} color={colors[theme]} />
            </ChartCard>
          </Col>

          <Col xs={24} lg={12}>
            <ChartCard title="用户活跃度" height={300} loading={loading}>
              <BarChart data={barChartData.slice(0, 4)} height={300} color={colors[theme]} />
            </ChartCard>
          </Col>
        </Row>

        <div
          style={{
            padding: '24px',
            marginTop: 16,
          }}
        >
          <Card
            title="图表组件说明"
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              borderTop: '3px solid var(--theme-primary)',
              boxShadow: '0 1px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
            }}
          >
            <p style={{ marginBottom: 12, color: '#6b7280', fontSize: 14 }}>
              本页面展示了项目中封装的图表组件：
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: 20,
                color: '#6b7280',
                fontSize: 14,
              }}
            >
              <li style={{ marginBottom: 8 }}>
                <strong>LineChart</strong> - 折线图组件，支持数据点交互和渐变填充
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>BarChart</strong> - 柱状图组件，支持多个数据项对比
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>ChartCard</strong> - 图表卡片容器，提供统一的样式和布局
              </li>
              <li>图表支持自定义颜色主题，可通过 color 属性设置</li>
            </ul>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
