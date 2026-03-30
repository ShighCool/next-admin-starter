'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';

export interface InfoModalRef {
  open: () => void;
  close: () => void;
}

export interface InfoModalProps extends Omit<ModalProps, 'visible'> {
  title: string;
  children: React.ReactNode;
  width?: number | string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const InfoModal = forwardRef<InfoModalRef, InfoModalProps>(
  (
    {
      title,
      children,
      width = 600,
      okText = '确定',
      cancelText = '取消',
      onOk,
      onCancel,
      ...modalProps
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    const handleOk = () => {
      onOk?.();
      setOpen(false);
    };

    const handleCancel = () => {
      onCancel?.();
      setOpen(false);
    };

    return (
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
        width={width}
        destroyOnHidden
        {...modalProps}
      >
        {children}
      </Modal>
    );
  }
);

InfoModal.displayName = 'InfoModal';

export default InfoModal;
