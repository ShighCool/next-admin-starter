'use client';

import React, { useState, useCallback } from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export interface ProTableProps<T = any> extends Omit<TableProps<T>, 'pagination'> {
  // 搜索表单区域
  searchForm?: React.ReactNode;
  // 表格头部操作按钮
  headerActions?: React.ReactNode;
  // 是否显示刷新按钮
  showRefresh?: boolean;
  // 刷新回调
  onRefresh?: () => void;
  // 批量操作区域
  batchActions?: React.ReactNode;
  // 选中行
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  // 分页配置
  pagination?:
    | false
    | {
        current: number;
        pageSize: number;
        total: number;
        showSizeChanger?: boolean;
        showQuickJumper?: boolean;
        showTotal?: (total: number, range: [number, number]) => string;
      };
  // 自定义表格容器
  cardStyle?: React.CSSProperties;
}

function ProTable<T = any>({
  searchForm,
  headerActions,
  showRefresh = true,
  onRefresh,
  batchActions,
  selectedRowKeys,
  onSelectionChange,
  pagination,
  cardStyle,
  ...tableProps
}: ProTableProps<T>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<React.Key[]>([]);

  const handleSelectionChange = useCallback(
    (keys: React.Key[], rows: T[]) => {
      setInternalSelectedKeys(keys);
      onSelectionChange?.(keys, rows);
    },
    [onSelectionChange]
  );

  const currentSelectedKeys = selectedRowKeys ?? internalSelectedKeys;

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  const defaultPagination = pagination
    ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: pagination.showSizeChanger ?? true,
        showQuickJumper: pagination.showQuickJumper ?? true,
        showTotal:
          pagination.showTotal ??
          ((total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`),
      }
    : false;

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        borderTop: '3px solid var(--theme-primary)',
        boxShadow: '0 1px 8px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
        background: '#ffffff',
      }}
    >
      {/* 搜索表单区域 */}
      {searchForm && <div style={{ padding: '20px 24px 16px' }}>{searchForm}</div>}

      {/* 分隔线 */}
      {searchForm && <div style={{ height: 1, background: '#f0f0f0', margin: '0 24px' }} />}

      {/* 表格头部操作栏 */}
      {(headerActions || showRefresh || batchActions) && (
        <div
          style={{
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fafbfc',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Space size={8}>
            {headerActions}
            {showRefresh && (
              <Button type="default" size="small" icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
            )}
          </Space>
          {batchActions && currentSelectedKeys.length > 0 && <Space size={8}>{batchActions}</Space>}
        </div>
      )}

      {/* 表格区域 */}
      <Table<T>
        {...tableProps}
        rowSelection={
          onSelectionChange
            ? {
                selectedRowKeys: currentSelectedKeys,
                onChange: handleSelectionChange,
              }
            : undefined
        }
        pagination={defaultPagination}
        style={{
          ...tableProps.style,
        }}
      />
    </div>
  );
}

export default ProTable;
