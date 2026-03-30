'use client';

import React, { useState, useRef } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  App,
  Row,
  Col,
  Card,
  Space,
} from 'antd';
import type { FormInstance } from 'antd';
import ModalForm from '@/components/core/ModalForm';
import DrawerForm from '@/components/core/DrawerForm';
import InfoModal from '@/components/core/InfoModal';
import FileUpload from '@/components/core/FileUpload';
import ImagePreview from '@/components/core/ImagePreview';
import AuthGuard from '@/components/auth/AuthGuard';
import { usePageTitle } from '@/hooks/usePageTitle';

const { TextArea } = Input;
const { Option } = Select;

export default function FormsExamplePage() {
  usePageTitle('表单示例');
  const { message } = App.useApp();

  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [drawerForm] = Form.useForm();
  const modalFormRef = useRef<any>(null);
  const drawerFormRef = useRef<any>(null);
  const infoModalRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'
  );

  const handleFormSubmit = async (values: any) => {
    console.log('表单提交:', values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('表单提交成功');
      form.resetFields();
    }, 1000);
  };

  const handleModalSubmit = async (values: any) => {
    console.log('模态框表单提交:', values);
    setTimeout(() => {
      message.success('保存成功');
      modalFormRef.current?.close();
    }, 1000);
  };

  const handleDrawerSubmit = async (values: any) => {
    console.log('抽屉表单提交:', values);
    setTimeout(() => {
      message.success('保存成功');
      drawerFormRef.current?.close();
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
            表单示例
          </h1>
          <Space>
            <Button type="default" size="small" onClick={() => modalFormRef.current?.open()}>
              ModalForm
            </Button>
            <Button type="default" size="small" onClick={() => drawerFormRef.current?.open()}>
              DrawerForm
            </Button>
            <Button type="default" size="small" onClick={() => infoModalRef.current?.open()}>
              InfoModal
            </Button>
          </Space>
        </div>

        <div style={{ padding: '0 24px' }}>
          <Card
            title="基础表单"
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              borderTop: '3px solid var(--theme-primary)',
              boxShadow: '0 1px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
            }}
          >
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input placeholder="请输入用户名" />
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
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="手机号"
                    rules={[{ required: true, message: '请输入手机号' }]}
                  >
                    <Input placeholder="请输入手机号" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="age"
                    label="年龄"
                    rules={[{ required: true, message: '请输入年龄' }]}
                  >
                    <InputNumber
                      placeholder="请输入年龄"
                      style={{ width: '100%' }}
                      min={1}
                      max={120}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gender"
                    label="性别"
                    rules={[{ required: true, message: '请选择性别' }]}
                  >
                    <Select placeholder="请选择性别">
                      <Option value="male">男</Option>
                      <Option value="female">女</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="birthday"
                    label="生日"
                    rules={[{ required: true, message: '请选择生日' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="address" label="地址">
                    <Input placeholder="请输入地址" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="bio" label="个人简介">
                    <TextArea rows={4} placeholder="请输入个人简介" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="isActive" label="状态" valuePropName="checked">
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="avatar" label="头像上传">
                    <FileUpload
                      uploadType="dragger"
                      uploadText="点击或拖拽文件到此区域上传"
                      hint="支持 jpg、png 格式，文件大小不超过 2MB"
                      maxCount={1}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                  </Button>
                  <Button onClick={() => form.resetFields()}>重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          <Card
            title="图片预览"
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              borderTop: '3px solid var(--theme-primary)',
              boxShadow: '0 1px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
              marginTop: 16,
            }}
          >
            <Space size={16}>
              <ImagePreview src={previewImage} width={120} height={120} alt="示例图片" />
              <ImagePreview
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
                width={120}
                height={120}
                alt="示例图片2"
              />
              <ImagePreview
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"
                width={120}
                height={120}
                alt="示例图片3"
              />
            </Space>
          </Card>
        </div>
      </div>

      {/* ModalForm 示例 */}
      <ModalForm
        ref={modalFormRef}
        form={modalForm}
        title="模态框表单"
        onOk={handleModalSubmit}
        width={600}
      >
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <TextArea rows={4} placeholder="请输入描述" />
        </Form.Item>
      </ModalForm>

      {/* DrawerForm 示例 */}
      <DrawerForm
        ref={drawerFormRef}
        form={drawerForm}
        title="抽屉表单"
        onOk={handleDrawerSubmit}
        width={600}
      >
        <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item name="content" label="内容">
          <TextArea rows={4} placeholder="请输入内容" />
        </Form.Item>
      </DrawerForm>

      {/* InfoModal 示例 */}
      <InfoModal ref={infoModalRef} title="信息展示" width={500}>
        <div style={{ padding: '20px 0' }}>
          <p style={{ marginBottom: 16, color: '#6b7280' }}>
            这是一个纯展示的模态框组件，用于展示信息或确认操作。
          </p>
          <p style={{ marginBottom: 0, color: '#6b7280' }}>
            使用 ref 的 open() 和 close() 方法来控制显示和隐藏。
          </p>
        </div>
      </InfoModal>
    </AuthGuard>
  );
}
