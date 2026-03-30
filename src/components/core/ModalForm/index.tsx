'use client';

import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Form, Button } from 'antd';
import type { FormInstance, ModalProps } from 'antd';

export interface ModalFormRef {
  open: () => void;
  close: () => void;
}

export interface ModalFormProps extends Omit<
  ModalProps,
  'visible' | 'onCancel' | 'destroyOnClose'
> {
  form: FormInstance;
  title: string;
  onOk: (values: any) => Promise<void> | void;
  onCancel?: () => void;
  children: React.ReactNode;
  okText?: string;
  cancelText?: string;
  width?: number | string;
  destroyOnHidden?: boolean;
}

const ModalForm = forwardRef<ModalFormRef, ModalFormProps>(
  (
    {
      form,
      title,
      onOk,
      onCancel,
      children,
      okText = '确定',
      cancelText = '取消',
      width = 600,
      destroyOnHidden = true,
      ...modalProps
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

    const handleCancel = () => {
      onCancel?.();
      setOpen(false);
    };

    useEffect(() => {
      if (!open) {
        form.resetFields();
      }
    }, [open, form]);

    return (
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
        okButtonProps={{ loading }}
        width={width}
        destroyOnHidden={destroyOnHidden}
        afterOpenChange={(visible) => {
          if (!visible) {
            form.resetFields();
          }
        }}
        {...modalProps}
      >
        <Form form={form} layout="vertical">
          {children}
        </Form>
      </Modal>
    );
  }
);

ModalForm.displayName = 'ModalForm';

export default ModalForm;
