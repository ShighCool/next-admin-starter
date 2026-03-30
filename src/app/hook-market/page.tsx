'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Tag,
  Rate,
  Row,
  Col,
  Modal,
  Divider,
  Tabs,
  Badge,
  Empty,
  App,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  StarOutlined,
  CodeOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useHookMarket } from '@/hooks/market/useHookMarket';
import { usePageTitle } from '@/hooks/usePageTitle';
import { HookMetadata } from '@/types/hook-market';

const { Text, Title, Paragraph } = Typography;
const { Search } = Input;

const HookMarketPage: React.FC = () => {
  usePageTitle('Hook 市场');
  const { message } = App.useApp();

  const {
    installedHooks,
    selectedCategory,
    setSelectedCategory,
    loadInstalledHooks,
    installHook,
    uninstallHook,
    isInstalled,
    getAvailableHooks,
    getHooksByCategory,
    searchHooks,
  } = useHookMarket();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedHook, setSelectedHook] = useState<HookMetadata | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'market' | 'installed'>('market');

  const categories = [
    { key: 'all', label: '全部', icon: <AppstoreOutlined /> },
    { key: 'table', label: '表格', icon: <ApiOutlined /> },
    { key: 'form', label: '表单', icon: <CodeOutlined /> },
    { key: 'ui', label: 'UI', icon: <ThunderboltOutlined /> },
    { key: 'data', label: '数据', icon: <ApiOutlined /> },
  ];

  useEffect(() => {
    loadInstalledHooks();
  }, [loadInstalledHooks]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleInstall = (hook: HookMetadata) => {
    installHook(hook);
    message.success('安装成功: ' + hook.name);
  };

  const handleUninstall = (hookId: string) => {
    uninstallHook(hookId);
    message.success('卸载成功');
  };

  const showDetail = (hook: HookMetadata) => {
    setSelectedHook(hook);
    setDetailVisible(true);
  };

  const getFilteredHooks = (): HookMetadata[] => {
    let hooks: HookMetadata[];

    if (activeTab === 'installed') {
      hooks = installedHooks.map((h) => h.metadata);
    } else {
      hooks =
        selectedCategory === 'all'
          ? getAvailableHooks()
          : getHooksByCategory(selectedCategory).filter((h) => !isInstalled(h.id));
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      hooks = hooks.filter(
        (h) =>
          h.name.toLowerCase().includes(keyword) ||
          h.description.toLowerCase().includes(keyword) ||
          h.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    }

    return hooks;
  };

  const renderHookCard = (hook: HookMetadata) => (
    <Card
      key={hook.id}
      hoverable
      style={{ height: '100%' }}
      onClick={() => showDetail(hook)}
      styles={{ body: { padding: '16px' } }}
    >
      <div style={{ marginBottom: 12 }}>
        <Space>
          <Text strong style={{ fontSize: 16 }}>
            {hook.name}
          </Text>
          <Tag color="blue">{hook.version}</Tag>
          {isInstalled(hook.id) && (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              已安装
            </Tag>
          )}
        </Space>
      </div>

      <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
        {hook.description}
      </Paragraph>

      <div style={{ marginBottom: 12 }}>
        <Space wrap>
          {hook.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} style={{ fontSize: 11 }}>
              {tag}
            </Tag>
          ))}
        </Space>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size={12}>
          <Rate disabled defaultValue={hook.rating} style={{ fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {hook.rating} 分
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {hook.downloads} 次下载
          </Text>
        </Space>
      </div>

      {isInstalled(hook.id) && (
        <Button
          danger
          size="small"
          style={{ marginTop: 12 }}
          onClick={(e) => {
            e.stopPropagation();
            handleUninstall(hook.id);
          }}
        >
          卸载
        </Button>
      )}
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
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
          <Title level={3} style={{ margin: 0, color: '#1a1f2e' }}>
            <AppstoreOutlined style={{ color: 'var(--theme-primary)', marginRight: 8 }} />
            Hook 市场
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            浏览、安装和管理自定义 Hook
          </Text>
        </div>
        <Space>
          <Badge count={installedHooks.length} offset={[-5, 5]}>
            <Button icon={<DownloadOutlined />}>已安装 {installedHooks.length}</Button>
          </Badge>
        </Space>
      </div>

      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'market' | 'installed')}
          items={[
            {
              key: 'market',
              label: (
                <span>
                  <AppstoreOutlined />
                  Hook 市场
                </span>
              ),
            },
            {
              key: 'installed',
              label: (
                <span>
                  <DownloadOutlined />
                  已安装
                  {installedHooks.length > 0 && (
                    <Badge count={installedHooks.length} style={{ marginLeft: 8 }} />
                  )}
                </span>
              ),
            },
          ]}
        />

        <Divider style={{ margin: '16px 0' }} />

        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索 Hook..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
        </div>

        {activeTab === 'market' && (
          <Space style={{ marginBottom: 16 }}>
            {categories.map((cat) => (
              <Button
                key={cat.key}
                type={selectedCategory === cat.key ? 'primary' : 'default'}
                icon={cat.icon}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </Button>
            ))}
          </Space>
        )}
      </Card>

      {getFilteredHooks().length === 0 ? (
        <Card style={{ borderRadius: 12 }}>
          <Empty description="没有找到 Hook" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {getFilteredHooks().map((hook) => (
            <Col key={hook.id} xs={24} sm={12} md={8} lg={6}>
              {renderHookCard(hook)}
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={
          <Space>
            <CodeOutlined style={{ color: 'var(--theme-primary)' }} />
            {selectedHook?.name}
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
        styles={{ body: { padding: '24px' } }}
      >
        {selectedHook && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <Tag color="blue">{selectedHook.version}</Tag>
              <Space>
                <StarOutlined style={{ color: '#faad14' }} />
                <Text strong>{selectedHook.rating}</Text>
              </Space>
              <Text type="secondary">{selectedHook.downloads} 次下载</Text>
              <Text type="secondary">{selectedHook.author}</Text>
            </Space>

            <Paragraph style={{ fontSize: 14, marginBottom: 16 }}>
              {selectedHook.description}
            </Paragraph>

            <Divider>功能特性</Divider>
            <div style={{ marginBottom: 16 }}>
              {selectedHook.features.map((feature, index) => (
                <Tag key={index} color="green" style={{ marginBottom: 8 }}>
                  {feature}
                </Tag>
              ))}
            </div>

            <Divider>使用示例</Divider>
            <Card
              styles={{ body: { padding: '12px', background: '#f5f5f5' } }}
              style={{ marginBottom: 16 }}
            >
              <pre
                style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}
              >
                {selectedHook.codePreview}
              </pre>
            </Card>

            <Divider>使用说明</Divider>
            <Paragraph style={{ fontSize: 14, marginBottom: 24 }}>{selectedHook.usage}</Paragraph>

            <Space>
              {isInstalled(selectedHook.id) ? (
                <Button danger onClick={() => handleUninstall(selectedHook.id)}>
                  卸载
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleInstall(selectedHook)}
                >
                  安装 Hook
                </Button>
              )}
              <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HookMarketPage;
