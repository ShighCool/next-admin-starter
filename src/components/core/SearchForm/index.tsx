'use client';

import React from 'react';
import { Form, FormInstance, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

export interface SearchFormProps {
  form: FormInstance;
  onSearch: (values: any) => void;
  onReset: () => void;
  children: React.ReactNode;
  loading?: boolean;
  searchBtnText?: string;
  resetBtnText?: string;
  showReset?: boolean;
  colSpan?: number;
}

function SearchForm({
  form,
  onSearch,
  onReset,
  children,
  loading = false,
  searchBtnText = '搜索',
  resetBtnText = '重置',
  showReset = true,
  colSpan = 6,
}: SearchFormProps) {
  const handleSearch = () => {
    form.validateFields().then((values) => {
      onSearch(values);
    });
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return (
              <Col span={colSpan} key={child.key}>
                {child}
              </Col>
            );
          }
          return null;
        })}
        <Col span={colSpan} style={{ textAlign: 'left' }}>
          <Space size={8}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
              size="small"
            >
              {searchBtnText}
            </Button>
            {showReset && (
              <Button icon={<ReloadOutlined />} onClick={handleReset} size="small">
                {resetBtnText}
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchForm;
