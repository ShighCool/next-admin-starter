'use client';

import { useState, useEffect, useRef } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import ProTable from '@/components/core/ProTable';
import SearchForm from '@/components/core/SearchForm';
import ModalForm from '@/components/core/ModalForm';
import { Button, Form, Input, Select, Switch, Space, Tag, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { usePageTitle } from '@/hooks/usePageTitle';

interface BackendPermissionItem {
  id: string;
  name: string;
  code: string;
  module: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: boolean;
  createTime: string;
}

export default function BackendPermissionPage() {
  usePageTitle('后台权限');
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const modalFormRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<BackendPermissionItem[]>([]);

  // 模拟数据
  const mockData: BackendPermissionItem[] = [
    {
      id: '1',
      name: '获取用户列表',
      code: 'user:list',
      module: '用户模块',
      method: 'GET',
      path: '/api/users',
      status: true,
      createTime: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      name: '创建用户',
      code: 'user:create',
      module: '用户模块',
      method: 'POST',
      path: '/api/users',
      status: true,
      createTime: '2024-01-15 10:35:00',
    },
    {
      id: '3',
      name: '更新用户',
      code: 'user:update',
      module: '用户模块',
      method: 'PUT',
      path: '/api/users/:id',
      status: true,
      createTime: '2024-01-15 10:36:00',
    },
    {
      id: '4',
      name: '删除用户',
      code: 'user:delete',
      module: '用户模块',
      method: 'DELETE',
      path: '/api/users/:id',
      status: false,
      createTime: '2024-01-15 10:37:00',
    },
    {
      id: '5',
      name: '获取订单列表',
      code: 'order:list',
      module: '订单模块',
      method: 'GET',
      path: '/api/orders',
      status: true,
      createTime: '2024-01-16 14:20:00',
    },
    {
      id: '6',
      name: '创建订单',
      code: 'order:create',
      module: '订单模块',
      method: 'POST',
      path: '/api/orders',
      status: true,
      createTime: '2024-01-16 14:21:00',
    },
  ];

  const columns: ColumnsType<BackendPermissionItem> = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (text) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: string) => {
        const colorMap: Record<string, string> = {
          GET: 'green',
          POST: 'blue',
          PUT: 'orange',
          DELETE: 'red',
          PATCH: 'purple',
        };
        return <Tag color={colorMap[method]}>{method}</Tag>;
      },
    },
    {
      title: 'API 路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
      render: (text) => (
        <code
          style={{
            background: '#f5f5f5',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          {text}
        </code>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: boolean) => (
        <Tag color={status ? 'success' : 'default'}>{status ? '启用' : '禁用'}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(mockData);
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    loadData();
  };

  const handleReset = () => {
    searchForm.resetFields();
    loadData();
  };

  const handleAdd = () => {
    form.resetFields();
    modalFormRef.current?.open();
  };

  const handleEdit = (record: BackendPermissionItem) => {
    form.setFieldsValue(record);
    modalFormRef.current?.open();
  };

  const handleDelete = (id: string) => {
    console.log('删除权限:', id);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('提交数据:', values);
      modalFormRef.current?.close();
      loadData();
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AuthGuard>
      <div style={{ padding: '24px' }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 24,
            color: '#1a1f2e',
          }}
        >
          后台权限管理
        </h1>

        <ProTable
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          searchForm={
            <SearchForm
              form={searchForm}
              onSearch={handleSearch}
              onReset={handleReset}
              loading={loading}
            >
              <Form.Item name="name" label="权限名称">
                <Input placeholder="请输入权限名称" />
              </Form.Item>
              <Form.Item name="code" label="权限编码">
                <Input placeholder="请输入权限编码" />
              </Form.Item>
              <Form.Item name="module" label="所属模块">
                <Select placeholder="请选择所属模块" allowClear>
                  <Select.Option value="用户模块">用户模块</Select.Option>
                  <Select.Option value="订单模块">订单模块</Select.Option>
                  <Select.Option value="商品模块">商品模块</Select.Option>
                  <Select.Option value="权限模块">权限模块</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="method" label="请求方法">
                <Select placeholder="请选择请求方法" allowClear>
                  <Select.Option value="GET">GET</Select.Option>
                  <Select.Option value="POST">POST</Select.Option>
                  <Select.Option value="PUT">PUT</Select.Option>
                  <Select.Option value="DELETE">DELETE</Select.Option>
                  <Select.Option value="PATCH">PATCH</Select.Option>
                </Select>
              </Form.Item>
            </SearchForm>
          }
          headerActions={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增权限
            </Button>
          }
          onRefresh={loadData}
          pagination={{
            current: 1,
            pageSize: 10,
            total: mockData.length,
          }}
        />

        <ModalForm ref={modalFormRef} form={form} title="后台权限配置" onOk={handleOk} width={600}>
          <Form.Item
            name="name"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="权限编码"
            rules={[{ required: true, message: '请输入权限编码' }]}
          >
            <Input placeholder="请输入权限编码，如 user:list" />
          </Form.Item>
          <Form.Item
            name="module"
            label="所属模块"
            rules={[{ required: true, message: '请选择所属模块' }]}
          >
            <Select placeholder="请选择所属模块">
              <Select.Option value="用户模块">用户模块</Select.Option>
              <Select.Option value="订单模块">订单模块</Select.Option>
              <Select.Option value="商品模块">商品模块</Select.Option>
              <Select.Option value="权限模块">权限模块</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="method"
            label="请求方法"
            rules={[{ required: true, message: '请选择请求方法' }]}
          >
            <Select placeholder="请选择请求方法">
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
              <Select.Option value="PATCH">PATCH</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="path"
            label="API 路径"
            rules={[{ required: true, message: '请输入 API 路径' }]}
          >
            <Input placeholder="请输入 API 路径，如 /api/users" />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </ModalForm>
      </div>
    </AuthGuard>
  );
}
