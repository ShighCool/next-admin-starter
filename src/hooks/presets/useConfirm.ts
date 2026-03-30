import { useState, useCallback } from 'react';
import { Modal } from 'antd';

export const useConfirm = () => {
  const confirm = useCallback(
    (options: {
      title: string;
      content: string;
      onOk: () => void | Promise<void>;
      onCancel?: () => void;
    }) => {
      Modal.confirm({
        title: options.title,
        content: options.content,
        onOk: options.onOk,
        onCancel: options.onCancel,
        okText: '确认',
        cancelText: '取消',
      });
    },
    []
  );

  return { confirm };
};
