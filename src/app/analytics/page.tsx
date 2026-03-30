'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Statistic,
  Row,
  Col,
  Progress,
  App,
  Divider,
  Modal,
  Form,
  DatePicker,
  Select,
} from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  FireOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useHeatmap } from '@/hooks/useHeatmap';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ElementClickStats } from '@/types/heatmap';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const AnalyticsPage: React.FC = () => {
  usePageTitle('数据分析');
  const { message } = App.useApp();
  const router = useRouter();

  const { events, getHeatmapData, getElementStats, clearEvents, setConfig, setIsRecording } =
    useHeatmap();

  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementClickStats | null>(null);
  const [exportForm] = Form.useForm();

  const stats = getHeatmapData();
  const elementStats = getElementStats();

  const handleViewHeatmap = () => {
    setConfig({ enabled: true, showClicks: true, showHeatmap: true, intensity: 0.5, radius: 20 });
    setIsRecording(true);
    message.success('热力图已开启，请跳转到 dashboard 页面查看效果');
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const handleExport = () => {
    setExportModalVisible(true);
  };

  const handleExportConfirm = async () => {
    try {
      const values = await exportForm.validateFields();
      const data = JSON.stringify(
        {
          heatmapData: stats,
          elementStats,
          exportTime: new Date().toISOString(),
          dateRange: values.dateRange
            ? [values.dateRange[0].toISOString(), values.dateRange[1].toISOString()]
            : undefined,
          format: values.format || 'json',
        },
        null,
        2
      );
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().getTime()}.${values.format || 'json'}`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('数据已导出');
      setExportModalVisible(false);
      exportForm.resetFields();
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  const handleClear = () => {
    setClearModalVisible(true);
  };

  const handleClearConfirm = () => {
    clearEvents();
    message.success('数据已清除');
    setClearModalVisible(false);
  };

  const handleViewDetail = (record: ElementClickStats) => {
    setSelectedElement(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => {
        if (index === 0)
          return (
            <Tag color="gold" icon={<RiseOutlined />}>
              1
            </Tag>
          );
        if (index === 1) return <Tag color="volcano">2</Tag>;
        if (index === 2) return <Tag color="orange">3</Tag>;
        return <Tag>{index + 1}</Tag>;
      },
    },
    {
      title: '元素',
      dataIndex: 'label',
      key: 'label',
      render: (label: string) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {label || '未命名元素'}
        </Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          button: 'blue',
          link: 'green',
          menu: 'orange',
          form: 'purple',
          other: 'default',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: '点击次数',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      sorter: (a: ElementClickStats, b: ElementClickStats) => b.count - a.count,
      render: (count: number) => (
        <Text strong style={{ fontSize: 15 }}>
          {count}
        </Text>
      ),
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 180,
      render: (percentage: number) => (
        <div>
          <Progress
            percent={Number(percentage.toFixed(1))}
            size="small"
            showInfo={false}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {percentage.toFixed(1)}%
          </Text>
        </div>
      ),
    },
    {
      title: '最后点击',
      dataIndex: 'lastClicked',
      key: 'lastClicked',
      width: 180,
      render: (timestamp: number) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(timestamp).toLocaleString()}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: ElementClickStats) => (
        <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #d4a5a5 0%, #c38d9e 100%)',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(196, 141, 158, 0.25)',
          color: '#ffffff',
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: '#ffffff', fontSize: 26 }}>
            <FireOutlined style={{ marginRight: 12 }} />
            点击热力图分析
          </Title>
          <Text style={{ fontSize: 14, opacity: 0.95, marginTop: 6, display: 'block' }}>
            深入分析用户行为数据，优化界面交互设计
          </Text>
        </div>
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={handleViewHeatmap}
            style={{
              borderColor: 'rgba(255,255,255,0.6)',
              color: '#ffffff',
            }}
          >
            查看热力图
          </Button>
          <Button
            ghost
            icon={<ExportOutlined />}
            onClick={handleExport}
            style={{
              borderColor: 'rgba(255,255,255,0.6)',
              color: '#ffffff',
            }}
          >
            导出报告
          </Button>
          <Button
            danger
            ghost
            icon={<DeleteOutlined />}
            onClick={handleClear}
            style={{
              borderColor: 'rgba(255,255,255,0.6)',
              color: '#ffffff',
            }}
          >
            清除数据
          </Button>
        </Space>{' '}
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
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
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(196, 141, 158, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <Statistic
              title="总点击次数"
              value={stats.stats.totalClicks}
              prefix={<FireOutlined style={{ color: '#d4a5a5' }} />}
              styles={{ content: { color: '#d4a5a5', fontSize: 28, fontWeight: 700 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
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
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(82, 196, 26, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <Statistic
              title="活跃元素数"
              value={stats.stats.uniqueElements}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              styles={{ content: { color: '#52c41a', fontSize: 28, fontWeight: 700 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
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
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(24, 144, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <Statistic
              title="平均点击/元素"
              value={
                stats.stats.uniqueElements > 0
                  ? (stats.stats.totalClicks / stats.stats.uniqueElements).toFixed(1)
                  : 0
              }
              suffix="次"
              prefix={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
              styles={{ content: { color: '#1890ff', fontSize: 28, fontWeight: 700 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
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
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(250, 173, 20, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <Statistic
              title="数据统计天数"
              value={
                stats.stats.dateRange.end > stats.stats.dateRange.start
                  ? Math.ceil(
                      (stats.stats.dateRange.end - stats.stats.dateRange.start) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 0
              }
              suffix="天"
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              styles={{ content: { color: '#faad14', fontSize: 28, fontWeight: 700 } }}
            />
          </Card>
        </Col>
      </Row>

      {/* 热门元素排行 */}
      <Card
        title={
          <Space>
            <FireOutlined style={{ color: '#d4a5a5', fontSize: 18 }} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>热门元素排行</span>
            <Tag color="purple">TOP 10</Tag>
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary">总计 {elementStats.length} 个元素</Text>
          </Space>
        }
        style={{
          borderRadius: 12,
          border: '1px solid var(--theme-border-color)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          columns={columns}
          dataSource={elementStats}
          rowKey="selector"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个元素`,
            style: { padding: '16px 24px' },
          }}
          size="middle"
          style={{
            borderRadius: 12,
          }}
          rowClassName={(record, index) => (index < 3 ? 'top-three-row' : '')}
        />
        <style jsx global>{`
          .top-three-row {
            background: linear-gradient(
              90deg,
              rgba(196, 141, 158, 0.06) 0%,
              rgba(196, 141, 158, 0) 100%
            ) !important;
          }
          .top-three-row:hover {
            background: linear-gradient(
              90deg,
              rgba(196, 141, 158, 0.12) 0%,
              rgba(196, 141, 158, 0) 100%
            ) !important;
          }
        `}</style>
      </Card>

      {/* 导出数据 Modal */}
      <Modal
        title={
          <Space>
            <ExportOutlined />
            <span>导出分析报告</span>
          </Space>
        }
        open={exportModalVisible}
        onOk={handleExportConfirm}
        onCancel={() => {
          setExportModalVisible(false);
          exportForm.resetFields();
        }}
        okText="导出"
        cancelText="取消"
        width={500}
      >
        <Form form={exportForm} layout="vertical">
          <Form.Item
            name="dateRange"
            label="日期范围"
            rules={[{ required: true, message: '请选择日期范围' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="format"
            label="导出格式"
            initialValue="json"
            rules={[{ required: true, message: '请选择导出格式' }]}
          >
            <Select>
              <Select.Option value="json">JSON</Select.Option>
              <Select.Option value="csv">CSV</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 清除数据确认 Modal */}
      <Modal
        title={
          <Space>
            <DeleteOutlined />
            <span>确认清除数据</span>
          </Space>
        }
        open={clearModalVisible}
        onOk={handleClearConfirm}
        onCancel={() => setClearModalVisible(false)}
        okText="确认清除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <div style={{ padding: '20px 0' }}>
          <Text type="warning">您确定要清除所有热力图数据吗？此操作不可撤销。</Text>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              当前数据统计：
              <br />• 总点击次数：{stats.stats.totalClicks}
              <br />• 活跃元素数：{stats.stats.uniqueElements}
            </Text>
          </div>
        </div>
      </Modal>

      {/* 元素详情 Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            <span>元素详情</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedElement && (
          <div style={{ padding: '20px 0' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">元素名称</Text>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                  {selectedElement.label || '未命名元素'}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">元素类型</Text>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                  {selectedElement.type}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">点击次数</Text>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#d4a5a5', marginTop: 4 }}>
                  {selectedElement.count}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">占比</Text>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                  {selectedElement.percentage.toFixed(2)}%
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">首次点击</Text>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  {new Date(selectedElement.firstClicked).toLocaleString()}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary">最后点击</Text>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  {new Date(selectedElement.lastClicked).toLocaleString()}
                </div>
              </Col>
              <Col span={24}>
                <Text type="secondary">选择器</Text>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: 'monospace',
                    background: '#f5f5f5',
                    padding: '8px',
                    borderRadius: 4,
                    marginTop: 4,
                  }}
                >
                  {selectedElement.selector}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AnalyticsPage;
