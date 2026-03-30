'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  App,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  Descriptions,
  Switch,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  LockOutlined,
  SaveOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { usePageTitle } from '@/hooks/usePageTitle';

const { Title, Text } = Typography;

export default function ProfilePage() {
  usePageTitle('个人中心');
  const { message } = App.useApp();

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
        setUser(userData);
        form.setFieldsValue({
          username: userData.username || 'admin',
          email: userData.email || 'admin@example.com',
          phone: userData.phone || '13800138000',
          bio: userData.bio || '暂无简介',
        });
      } catch {
        setUser({});
      }
    }
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 模拟保存
      setTimeout(() => {
        const updatedUser = { ...user, ...values };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success('个人信息已更新');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);

      // 模拟修改密码
      setTimeout(() => {
        message.success('密码修改成功，请重新登录');
        setLoading(false);
        passwordForm.resetFields();

        // 退出登录
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error('密码修改失败:', error);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/upload',
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success('头像上传成功');
      } else if (info.file.status === 'error') {
        message.error('头像上传失败');
      }
    },
  };

  return (
    <AuthGuard>
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          个人中心
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card
              style={{
                borderRadius: 12,
                textAlign: 'center',
                border: '1px solid var(--theme-border-color)',
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{
                      background: 'var(--theme-primary)',
                      fontSize: 48,
                    }}
                  />
                  <Upload {...uploadProps}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CameraOutlined />}
                      size="small"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 36,
                        height: 36,
                      }}
                    />
                  </Upload>
                </div>
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>
                {user.username || 'Admin'}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                {user.email || 'admin@example.com'}
              </Text>
              <Space wrap>
                <Tag color="blue">管理员</Tag>
                <Tag color="green">在线</Tag>
              </Space>
            </Card>

            <Card
              title="账户信息"
              style={{
                marginTop: 24,
                borderRadius: 12,
                border: '1px solid var(--theme-border-color)',
              }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="用户ID">
                  <Text code>{user.id || '10001'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="注册时间">2024-01-15 10:30:00</Descriptions.Item>
                <Descriptions.Item label="最后登录">
                  {new Date().toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="登录次数">128 次</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>基本信息</span>
                </Space>
              }
              style={{
                borderRadius: 12,
                border: '1px solid var(--theme-border-color)',
              }}
            >
              <Form form={form} layout="vertical" requiredMark={false}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="username"
                      label="用户名"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="邮箱"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="请输入邮箱" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="手机号"
                      rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="nickname" label="昵称">
                      <Input placeholder="请输入昵称" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="bio" label="个人简介">
                  <Input.TextArea rows={4} placeholder="请输入个人简介" maxLength={200} showCount />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSave}
                      loading={loading}
                      size="large"
                    >
                      保存修改
                    </Button>
                    <Button
                      size="large"
                      onClick={() => {
                        form.resetFields();
                        message.info('表单已重置');
                      }}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            <Card
              title={
                <Space>
                  <LockOutlined />
                  <span>安全设置</span>
                </Space>
              }
              style={{
                marginTop: 24,
                borderRadius: 12,
                border: '1px solid var(--theme-border-color)',
              }}
            >
              <Form form={passwordForm} layout="vertical" requiredMark={false}>
                <Form.Item
                  label="原密码"
                  name="oldPassword"
                  rules={[{ required: true, message: '请输入原密码' }]}
                >
                  <Input.Password placeholder="请输入原密码" size="large" />
                </Form.Item>

                <Form.Item
                  label="新密码"
                  name="newPassword"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 6, message: '密码至少6位' },
                  ]}
                >
                  <Input.Password placeholder="请输入新密码" size="large" />
                </Form.Item>

                <Form.Item
                  label="确认密码"
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: '请确认新密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请再次输入新密码" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    icon={<LockOutlined />}
                    onClick={handleChangePassword}
                    loading={loading}
                  >
                    修改密码
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </AuthGuard>
  );
}
