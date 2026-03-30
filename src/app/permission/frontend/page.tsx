'use client';

import { useState, useEffect, useRef } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import ProTable from '@/components/core/ProTable';
import SearchForm from '@/components/core/SearchForm';
import ModalForm from '@/components/core/ModalForm';
import { Button, Form, Input, Select, Switch, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { usePageTitle } from '@/hooks/usePageTitle';

interface PermissionItem {
  id: string;
  name: string;
  code: string;
  type: 'menu' | 'button' | 'api';
  description: string;
  status: boolean;
  createTime: string;
}

export default function FrontendPermissionPage() {
  usePageTitle('前台权限');
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const modalFormRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<PermissionItem[]>([]);

  // 模拟数据
  const mockData: PermissionItem[] = [
    {
      id: '1',
      name: '用户管理',
      code: 'user:manage',
      type: 'menu',
      description: '用户模块的菜单权限',
      status: true,
      createTime: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      name: '添加用户',
      code: 'user:add',
      type: 'button',
      description: '添加用户的按钮权限',
      status: true,
      createTime: '2024-01-15 10:35:00',
    },
    {
      id: '3',
      name: '编辑用户',
      code: 'user:edit',
      type: 'button',
      description: '编辑用户的按钮权限',
      status: true,
      createTime: '2024-01-15 10:36:00',
    },
    {
      id: '4',
      name: '删除用户',
      code: 'user:delete',
      type: 'button',
      description: '删除用户的按钮权限',
      status: false,
      createTime: '2024-01-15 10:37:00',
    },
    {
      id: '5',
      name: '数据列表',
      code: 'data:list',
      type: 'api',
      description: '数据列表的 API 访问权限',
      status: true,
      createTime: '2024-01-16 14:20:00',
    },
  ];

  const columns: ColumnsType<PermissionItem> = [
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          menu: 'green',
          button: 'blue',
          api: 'orange',
        };
        const labelMap: Record<string, string> = {
          menu: '菜单',
          button: '按钮',
          api: 'API',
        };
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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

  const handleEdit = (record: PermissionItem) => {
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
          前台权限管理
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
              <Form.Item name="type" label="权限类型">
                <Select placeholder="请选择权限类型" allowClear>
                  <Select.Option value="menu">菜单</Select.Option>
                  <Select.Option value="button">按钮</Select.Option>
                  <Select.Option value="api">API</Select.Option>
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

        <ModalForm ref={modalFormRef} form={form} title="权限配置" onOk={handleOk} width={600}>
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
            <Input placeholder="请输入权限编码，如 user:manage" />
          </Form.Item>
          <Form.Item
            name="type"
            label="权限类型"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select placeholder="请选择权限类型">
              <Select.Option value="menu">菜单</Select.Option>
              <Select.Option value="button">按钮</Select.Option>
              <Select.Option value="api">API</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入权限描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </ModalForm>
      </div>
    </AuthGuard>
  );
}
