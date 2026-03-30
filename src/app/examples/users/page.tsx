'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, App, Space } from 'antd';
import type { FormInstance } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable from '@/components/core/ProTable';
import SearchForm from '@/components/core/SearchForm';
import ModalForm from '@/components/core/ModalForm';
import AuthGuard from '@/components/auth/AuthGuard';
import { usePageTitle } from '@/hooks/usePageTitle';

// 导入 API 接口（取消注释以使用真实 API）
// import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
  createdAt: string;
}

export default function UsersExamplePage() {
  usePageTitle('用户管理');
  const { message } = App.useApp();
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const modalFormRef = React.useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      status: 'active',
      role: 'admin',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      status: 'inactive',
      role: 'user',
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      status: 'active',
      role: 'user',
      createdAt: '2024-01-03',
    },
  ]);
  const [total, setTotal] = useState(3);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // 获取用户列表
  const fetchUsers = async (params: any = {}) => {
    setLoading(true);
    try {
      // 真实 API 调用（取消注释以使用）
      // const data = await getUserList({
      //   page: pagination.current,
      //   pageSize: pagination.pageSize,
      //   ...params
      // })
      // setUsers(data.list)
      // setTotal(data.total)

      // 模拟 API 调用（用于演示）
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (values: any) => {
    console.log('搜索参数:', values);
    // 真实 API 调用
    // fetchUsers(values)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('搜索成功');
    }, 1000);
  };

  const handleReset = () => {
    searchForm.resetFields();
    // 重新加载列表
    fetchUsers();
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleAdd = () => {
    modalForm.resetFields();
    modalFormRef.current?.open();
  };

  const handleEdit = (record: User) => {
    modalForm.setFieldsValue(record);
    modalFormRef.current?.open();
  };

  const handleDelete = async (id: number) => {
    try {
      // 真实 API 调用（取消注释以使用）
      // await deleteUser(id)

      // 模拟删除（用于演示）
      setUsers(users.filter((user) => user.id !== id));
      setTotal(total - 1);
      message.success('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async (values: any) => {
    try {
      console.log('表单提交:', values);

      // 真实 API 调用（取消注释以使用）
      // if (values.id) {
      //   await updateUser(values.id, values)
      // } else {
      //   await createUser(values)
      // }

      // 模拟提交（用于演示）
      setTimeout(() => {
        const newUser = {
          id: values.id || Date.now(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
        };
        if (values.id) {
          setUsers(users.map((user) => (user.id === values.id ? newUser : user)));
        } else {
          setUsers([...users, newUser]);
          setTotal(total + 1);
        }
        message.success('保存成功');
      }, 500);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#f5222d' }}>
          {status === 'active' ? '激活' : '禁用'}
        </span>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => <span>{role === 'admin' ? '管理员' : '用户'}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: User) => (
        <Space size={8}>
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

  return (
    <AuthGuard>
      <div style={{ padding: '2px' }}>
        <ProTable
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          searchForm={
            <SearchForm
              form={searchForm}
              onSearch={handleSearch}
              onReset={handleReset}
              loading={loading}
            >
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入姓名" allowClear />
              </Form.Item>
              <Form.Item name="email" label="邮箱">
                <Input placeholder="请输入邮箱" allowClear />
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择状态" allowClear>
                  <Select.Option value="active">激活</Select.Option>
                  <Select.Option value="inactive">禁用</Select.Option>
                </Select>
              </Form.Item>
            </SearchForm>
          }
          headerActions={
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
              新增用户
            </Button>
          }
          onRefresh={handleRefresh}
          pagination={
            {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total,
              onChange: (page: number, pageSize: number) =>
                setPagination({ current: page, pageSize }),
            } as any
          }
        />
      </div>

      <ModalForm
        ref={modalFormRef}
        form={modalForm}
        title="用户信息"
        onOk={handleModalOk}
        width={600}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
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
        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
          <Select placeholder="请选择状态">
            <Select.Option value="active">激活</Select.Option>
            <Select.Option value="inactive">禁用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select placeholder="请选择角色">
            <Select.Option value="admin">管理员</Select.Option>
            <Select.Option value="user">用户</Select.Option>
          </Select>
        </Form.Item>
      </ModalForm>
    </AuthGuard>
  );
}
