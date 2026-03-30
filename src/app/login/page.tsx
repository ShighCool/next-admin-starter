'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function LoginPage() {
  usePageTitle('登录');

  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      // TODO: 实现实际的登录逻辑
      // 模拟登录成功
      if (values.username === 'admin' && values.password === 'admin123') {
        localStorage.setItem('token', 'mock-token-123456');
        localStorage.setItem('user', JSON.stringify({ username: values.username }));
        message.success('登录成功');
        router.push('/');
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1f2e', margin: 0 }}>管理系统</h1>
          <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>请登录您的账户</p>
        </div>

        <Form onFinish={handleLogin} layout="vertical" size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" autoComplete="username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
          <p style={{ margin: 0 }}>默认账号: admin / 密码: admin123</p>
        </div>
      </Card>
    </div>
  );
}
