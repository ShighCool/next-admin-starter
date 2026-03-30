'use client';

import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Drawer, Form } from 'antd';
import type { FormInstance, DrawerProps } from 'antd';

export interface DrawerFormRef {
  open: () => void;
  close: () => void;
}

export interface DrawerFormProps extends Omit<
  DrawerProps,
  'visible' | 'onClose' | 'width' | 'destroyOnClose'
> {
  form: FormInstance;
  title: string;
  onOk: (values: any) => Promise<void> | void;
  onClose?: () => void;
  children: React.ReactNode;
  okText?: string;
  cancelText?: string;
  width?: number | string;
  destroyOnHidden?: boolean;
}

const DrawerForm = forwardRef<DrawerFormRef, DrawerFormProps>(
  (
    {
      form,
      title,
      onOk,
      onClose,
      children,
      okText = '确定',
      cancelText = '取消',
      width = 600,
      destroyOnHidden = true,
      ...drawerProps
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const handleOk = async () => {
      try {
        const values = await form.validateFields();
        setLoading(true);
        await onOk(values);
        setOpen(false);
        form.resetFields();
      } catch (error) {
        console.error('表单验证失败:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      onClose?.();
      setOpen(false);
    };

    useEffect(() => {
      if (!open) {
        form.resetFields();
      }
    }, [open, form]);

    return (
      <Drawer
        title={title}
        open={open}
        onClose={handleClose}
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleClose}
              style={{
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                background: '#fff',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleOk}
              disabled={loading}
              style={{
                padding: '4px 12px',
                border: 'none',
                background: loading ? '#d9d9d9' : 'var(--theme-primary)',
                color: '#fff',
                borderRadius: 4,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
              }}
            >
              {loading ? '提交中...' : okText}
            </button>
          </div>
        }
        size={typeof width === 'number' ? width : 600}
        destroyOnHidden={destroyOnHidden}
        afterOpenChange={(visible) => {
          if (!visible) {
            form.resetFields();
          }
        }}
        {...drawerProps}
      >
        <Form form={form} layout="vertical">
          {children}
        </Form>
      </Drawer>
    );
  }
);

DrawerForm.displayName = 'DrawerForm';

export default DrawerForm;
