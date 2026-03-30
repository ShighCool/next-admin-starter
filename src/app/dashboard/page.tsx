'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import StatCard from '@/components/core/StatCard';
import ChartCard from '@/components/core/Chart/ChartCard';
import LineChart from '@/components/core/Chart/LineChart';
import BarChart from '@/components/core/Chart/BarChart';
import PieChart from '@/components/core/Chart/PieChart';
import RadarChart from '@/components/core/Chart/RadarChart';
import MixedChart from '@/components/core/Chart/MixedChart';
import { Row, Col, Card, Progress, Space, Typography, Tag } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';

const { Text } = Typography;

export default function DashboardPage() {
  usePageTitle('仪表板');
  // 模拟数据
  const stats = [
    {
      title: '总用户数',
      value: 12580,
      prefix: <TeamOutlined />,
      trend: { value: 12.5, isUp: true },
      color: '#52c41a',
    },
    {
      title: '今日访问',
      value: 3456,
      prefix: <FireOutlined />,
      trend: { value: 8.3, isUp: true },
      color: '#1890ff',
    },
    {
      title: '订单数量',
      value: 892,
      prefix: <ThunderboltOutlined />,
      trend: { value: 3.2, isUp: false },
      color: '#faad14',
    },
    {
      title: '总收入',
      value: 125680,
      prefix: <DollarOutlined />,
      trend: { value: 15.7, isUp: true },
      color: '#722ed1',
    },
  ];

  const visitData = [
    { name: '周一', value: 820 },
    { name: '周二', value: 932 },
    { name: '周三', value: 901 },
    { name: '周四', value: 934 },
    { name: '周五', value: 1290 },
    { name: '周六', value: 1330 },
    { name: '周日', value: 1320 },
  ];

  const userData = [
    { name: '1月', value: 1200 },
    { name: '2月', value: 1320 },
    { name: '3月', value: 1010 },
    { name: '4月', value: 1340 },
    { name: '5月', value: 900 },
    { name: '6月', value: 2300 },
  ];

  // 饼图数据 - 流量来源分布
  const pieData = [
    { name: '直接访问', value: 335 },
    { name: '邮件营销', value: 310 },
    { name: '联盟广告', value: 234 },
    { name: '视频广告', value: 135 },
    { name: '搜索引擎', value: 1548 },
  ];

  // 雷达图数据 - 能力评估
  const radarIndicators = [
    { name: '销售', max: 100 },
    { name: '管理', max: 100 },
    { name: '技术', max: 100 },
    { name: '客服', max: 100 },
    { name: '研发', max: 100 },
    { name: '市场', max: 100 },
  ];

  const radarSeries = [
    { name: '本月', data: [85, 90, 75, 88, 92, 80] },
    { name: '上月', data: [70, 85, 80, 82, 88, 75] },
  ];

  // 混合图表数据 - 销售与转化
  const mixedXData = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];
  const mixedBarData = [
    {
      name: '销售额',
      data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290],
      color: '#4f9bfa',
    },
  ];
  const mixedLineData = [
    { name: '转化率', data: [12, 15, 14, 16, 18, 20, 19, 12, 15, 14, 16, 18], color: '#9B59B6' },
  ];

  const recentActivity = [
    { id: 1, user: '张三', action: '创建了新订单', time: '2分钟前', status: 'success' },
    { id: 2, user: '李四', action: '更新了用户信息', time: '5分钟前', status: 'info' },
    { id: 3, user: '王五', action: '删除了过期数据', time: '10分钟前', status: 'warning' },
    { id: 4, user: '赵六', action: '导出了报表', time: '15分钟前', status: 'success' },
    { id: 5, user: '钱七', action: '修改了系统配置', time: '20分钟前', status: 'error' },
  ];

  return (
    <AuthGuard>
      <div style={{ padding: '24px' }}>
        {/* 欢迎标题 */}
        <div
          style={{
            marginBottom: 24,
            padding: '24px',
            background:
              'linear-gradient(135deg, var(--theme-primary) 0%, color-mix(in srgb, var(--theme-primary) 70%, white) 100%)',
            borderRadius: 16,
            boxShadow: '0 8px 24px color-mix(in srgb, var(--theme-primary) 30%, transparent)',
            color: '#ffffff',
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
              marginBottom: 8,
            }}
          >
            欢迎回来，管理员
          </h1>
          <p
            style={{
              fontSize: 14,
              margin: 0,
              opacity: 0.9,
            }}
          >
            今日是美好的一天，系统运行正常
          </p>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  border: '1px solid var(--theme-border-color)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                styles={{
                  body: { padding: '20px' },
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 16px color-mix(in srgb, var(--theme-primary) 20%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>{stat.title}</Text>
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: 8,
                        background: `color-mix(in srgb, ${stat.color} 10%, white)`,
                        color: stat.color,
                        fontSize: 16,
                      }}
                    >
                      {stat.prefix}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#1a1f2e',
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.prefix && stat.prefix.type?.displayName === 'DollarOutlined' && '¥'}
                    {stat.value.toLocaleString()}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                    }}
                  >
                    {stat.trend.isUp ? (
                      <Tag color="success" icon={<RiseOutlined />}>
                        +{stat.trend.value}%
                      </Tag>
                    ) : (
                      <Tag color="error" icon={<FallOutlined />}>
                        -{stat.trend.value}%
                      </Tag>
                    )}
                    <Text type="secondary">较上周</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 图表 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={14}>
            <ChartCard
              title={
                <Space>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>访问趋势</span>
                  <Tag color="blue">近7天</Tag>
                </Space>
              }
              height={360}
              extra={
                <Space size={12}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    总访问: {visitData.reduce((a, b) => a + b.value, 0).toLocaleString()}
                  </Text>
                </Space>
              }
            >
              <LineChart data={visitData} height={300} color="var(--theme-primary)" />
            </ChartCard>
          </Col>
          <Col xs={24} lg={10}>
            <ChartCard
              title={
                <Space>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>用户增长</span>
                  <Tag color="purple">近6月</Tag>
                </Space>
              }
              height={360}
              extra={
                <Space size={12}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    新增: {userData[userData.length - 1].value.toLocaleString()}
                  </Text>
                </Space>
              }
            >
              <BarChart data={userData} height={300} color="#9B59B6" />
            </ChartCard>
          </Col>
        </Row>

        {/* 第二行图表 - 饼图、雷达图、混合图表 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={8}>
            <ChartCard
              title={
                <Space>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>流量来源</span>
                  <Tag color="orange">分布</Tag>
                </Space>
              }
              height={340}
              extra={
                <Space size={12}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    总计: {pieData.reduce((a, b) => a + b.value, 0).toLocaleString()}
                  </Text>
                </Space>
              }
            >
              <PieChart
                data={pieData}
                height={280}
                colors={['#4f9bfa', '#9B59B6', '#F39C12', '#52c41a', '#ff4d4f']}
              />
            </ChartCard>
          </Col>

          <Col xs={24} lg={8}>
            <ChartCard
              title={
                <Space>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>能力评估</span>
                  <Tag color="cyan">对比</Tag>
                </Space>
              }
              height={340}
            >
              <RadarChart
                indicators={radarIndicators}
                series={radarSeries}
                height={280}
                colors={['#4f9bfa', '#9B59B6']}
              />
            </ChartCard>
          </Col>

          <Col xs={24} lg={8}>
            <ChartCard
              title={
                <Space>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>销售与转化</span>
                  <Tag color="geekblue">混合</Tag>
                </Space>
              }
              height={340}
            >
              <MixedChart
                xData={mixedXData}
                barData={mixedBarData}
                lineData={mixedLineData}
                height={280}
                yName="销售额"
              />
            </ChartCard>
          </Col>
        </Row>

        {/* 近期活动和系统说明 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card
              title={
                <Space>
                  <FireOutlined style={{ color: '#ff4d4f' }} />
                  <span style={{ fontSize: 16, fontWeight: 600 }}>近期活动</span>
                </Space>
              }
              style={{
                borderRadius: 12,
                border: '1px solid var(--theme-border-color)',
              }}
              styles={{
                body: { padding: 0 },
              }}
            >
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background:
                        item.status === 'success'
                          ? '#52c41a'
                          : item.status === 'error'
                            ? '#ff4d4f'
                            : item.status === 'warning'
                              ? '#faad14'
                              : '#1890ff',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#1a1f2e',
                        marginBottom: 2,
                      }}
                    >
                      <strong>{item.user}</strong> {item.action}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.time}
                    </Text>
                  </div>
                </div>
              ))}
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card
              title={
                <Space>
                  <ThunderboltOutlined style={{ color: '#1890ff' }} />
                  <span style={{ fontSize: 16, fontWeight: 600 }}>系统状态</span>
                </Space>
              }
              style={{
                borderRadius: 12,
                border: '1px solid var(--theme-border-color)',
              }}
            >
              <Space orientation="vertical" size={20} style={{ width: '100%' }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>CPU 使用率</Text>
                    <Text style={{ fontSize: 14, fontWeight: 600, color: '#52c41a' }}>32%</Text>
                  </div>
                  <Progress percent={32} strokeColor="#52c41a" size="small" />
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>内存使用</Text>
                    <Text style={{ fontSize: 14, fontWeight: 600, color: '#1890ff' }}>58%</Text>
                  </div>
                  <Progress percent={58} strokeColor="#1890ff" size="small" />
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>磁盘使用</Text>
                    <Text style={{ fontSize: 14, fontWeight: 600, color: '#faad14' }}>45%</Text>
                  </div>
                  <Progress percent={45} strokeColor="#faad14" size="small" />
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>网络带宽</Text>
                    <Text style={{ fontSize: 14, fontWeight: 600, color: '#722ed1' }}>28%</Text>
                  </div>
                  <Progress percent={28} strokeColor="#722ed1" size="small" />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </AuthGuard>
  );
}
