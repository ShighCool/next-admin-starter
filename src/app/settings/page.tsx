'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AuthGuard from '@/components/auth/AuthGuard';
import {
  Card,
  Form,
  Switch,
  Select,
  InputNumber,
  Slider,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Button,
  App,
  Tabs,
  ColorPicker,
  Input,
} from 'antd';
import {
  SettingOutlined,
  BellOutlined,
  LockOutlined,
  MoonOutlined,
  GlobalOutlined,
  SafetyOutlined,
  SaveOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';
import { usePageTitle } from '@/hooks/usePageTitle';

const { Title, Text } = Typography;
const { Option } = Select;

export default function SettingsPage() {
  usePageTitle('系统设置');

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [themeColor, setThemeColor] = useState<Color | string>('#4f9bfa');

  useEffect(() => {
    // 加载设置
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      form.setFieldsValue(settings);
    }
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 模拟保存
      setTimeout(() => {
        localStorage.setItem('user-settings', JSON.stringify(values));
        message.success('设置已保存');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('设置已重置');
  };

  const handleThemeColorChange = (color: Color) => {
    setThemeColor(color);
    const hex = color.toHexString();
    document.documentElement.style.setProperty('--theme-primary', hex);
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <Space>
          <GlobalOutlined />
          通用设置
        </Space>
      ),
      children: (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card title="外观设置" style={{ borderRadius: 12 }}>
            {' '}
            <Form.Item label="主题颜色" name="themeColor">
              <ColorPicker
                value={themeColor}
                onChange={handleThemeColorChange}
                showText
                size="large"
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="界面模式" name="themeMode">
              <Select size="large">
                <Option value="light">
                  <Space>
                    <span>🌞</span> 浅色模式
                  </Space>
                </Option>
                <Option value="dark">
                  <Space>
                    <span>🌙</span> 深色模式
                  </Space>
                </Option>
                <Option value="auto">
                  <Space>
                    <span>🔄</span> 跟随系统
                  </Space>
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label="字体大小" name="fontSize">
              <Select size="large">
                <Option value="small">小</Option>
                <Option value="medium">中</Option>
                <Option value="large">大</Option>
              </Select>
            </Form.Item>
            <Form.Item label="紧凑模式" name="compactMode" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>

          <Card title="语言设置" style={{ borderRadius: 12 }}>
            <Form.Item label="界面语言" name="language">
              <Select size="large">
                <Option value="zh-CN">简体中文</Option>
                <Option value="en-US">English</Option>
                <Option value="ja-JP">日本語</Option>
              </Select>
            </Form.Item>
            <Form.Item label="时区" name="timezone">
              <Select size="large">
                <Option value="Asia/Shanghai">上海 (GMT+8)</Option>
                <Option value="Asia/Tokyo">东京 (GMT+9)</Option>
                <Option value="America/New_York">纽约 (GMT-5)</Option>
                <Option value="Europe/London">伦敦 (GMT+0)</Option>
              </Select>
            </Form.Item>
          </Card>
        </Space>
      ),
    },
    {
      key: 'notification',
      label: (
        <Space>
          <BellOutlined />
          通知设置
        </Space>
      ),
      children: (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card title="桌面通知" style={{ borderRadius: 12 }}>
            {' '}
            <Form.Item label="启用桌面通知" name="desktopNotification" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="声音提醒" name="soundNotification" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="弹窗提示" name="popupNotification" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>

          <Card title="通知类型" style={{ borderRadius: 12 }}>
            <Form.Item label="系统更新" name="notifySystemUpdate" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="消息通知" name="notifyMessage" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="订单提醒" name="notifyOrder" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="活动提醒" name="notifyActivity" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>
        </Space>
      ),
    },
    {
      key: 'security',
      label: (
        <Space>
          <SafetyOutlined />
          安全设置
        </Space>
      ),
      children: (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card title="登录安全" style={{ borderRadius: 12 }}>
            {' '}
            <Form.Item label="两步验证" name="twoFactorAuth" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="登录提醒" name="loginAlert" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="异地登录检测" name="abnormalLogin" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>

          <Card title="会话管理" style={{ borderRadius: 12 }}>
            <Form.Item label="自动登出时间" name="autoLogout">
              <Select size="large">
                <Option value="15">15 分钟</Option>
                <Option value="30">30 分钟</Option>
                <Option value="60">1 小时</Option>
                <Option value="120">2 小时</Option>
                <Option value="0">永不登出</Option>
              </Select>
            </Form.Item>
            <Form.Item label="同时在线设备数" name="maxSessions">
              <InputNumber min={1} max={5} size="large" />
            </Form.Item>
          </Card>

          <Card title="数据隐私" style={{ borderRadius: 12 }}>
            <Form.Item label="匿名数据收集" name="anonymousData" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="使用统计" name="usageStats" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>
        </Space>
      ),
    },
    {
      key: 'about',
      label: (
        <Space>
          <SettingOutlined />
          关于
        </Space>
      ),
      children: (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            {' '}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  overflow: 'hidden',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={80}
                  height={80}
                  loading="eager"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <Title level={3} style={{ marginBottom: 8 }}>
                Next Admin Starter
              </Title>
              <Text type="secondary">版本 1.0.0</Text>
            </div>
            <Divider />
            <Space orientation="vertical" size="small" style={{ textAlign: 'left' }}>
              <div>
                <Text strong>技术栈：</Text>
                <br />
                <Text type="secondary">Next.js 15 + React 19 + Ant Design 6 + TypeScript</Text>
              </div>
              <div>
                <Text strong>特性：</Text>
                <br />
                <Text type="secondary">服务端渲染、主题系统、权限管理、路由标签页、命令面板</Text>
              </div>
              <div>
                <Text strong>许可证：</Text>
                <br />
                <Text type="secondary">MIT License</Text>
              </div>
            </Space>
          </Card>

          <Card title="快捷操作" style={{ borderRadius: 12 }}>
            <Space orientation="vertical" style={{ width: '100%' }}>
              <Button
                block
                icon={<ReloadOutlined />}
                onClick={() => {
                  message.info('检查更新功能开发中...');
                }}
              >
                检查更新
              </Button>
              <Button
                block
                onClick={() => {
                  window.open(
                    'https://github.com/your-repo/next-admin-starter/blob/main/.next/logs',
                    '_blank'
                  );
                }}
              >
                查看日志
              </Button>
              <Button
                block
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.clear();
                    message.success('缓存已清理，请刷新页面');
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }
                }}
              >
                清理缓存
              </Button>
            </Space>
          </Card>
        </Space>
      ),
    },
  ];

  return (
    <AuthGuard>
      <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          系统设置
        </Title>

        <Card
          style={{
            borderRadius: 12,
            border: '1px solid var(--theme-border-color)',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              themeMode: 'light',
              fontSize: 'medium',
              language: 'zh-CN',
              timezone: 'Asia/Shanghai',
              autoLogout: 30,
              maxSessions: 3,
              desktopNotification: true,
              soundNotification: true,
              popupNotification: true,
              notifySystemUpdate: true,
              notifyMessage: true,
              notifyOrder: true,
              notifyActivity: false,
              twoFactorAuth: false,
              loginAlert: true,
              abnormalLogin: true,
              anonymousData: true,
              usageStats: true,
            }}
          >
            <Tabs items={tabItems} tabBarStyle={{ marginBottom: 24 }} size="large" />
          </Form>

          <Divider />

          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={loading}
              size="large"
            >
              保存设置
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset} size="large">
              重置默认
            </Button>
          </Space>
        </Card>
      </div>
    </AuthGuard>
  );
}
