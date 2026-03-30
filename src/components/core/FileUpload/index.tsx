'use client';

import React from 'react';
import { Upload, Button, App } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export interface FileUploadProps extends Omit<UploadProps, 'onChange' | 'value'> {
  uploadType?: 'button' | 'dragger';
  uploadText?: string;
  hint?: string;
  onFileChange?: (fileList: UploadFile[]) => void;
  maxCount?: number;
  fileList?: UploadFile[];
  value?: UploadFile[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  uploadType = 'button',
  uploadText = '点击上传',
  hint = '支持单个或批量上传',
  onFileChange,
  maxCount = 5,
  fileList,
  value,
  ...uploadProps
}) => {
  const { message } = App.useApp();

  const handleChange: UploadProps['onChange'] = (info) => {
    const { fileList: newFileList } = info;
    onFileChange?.(newFileList);

    if (info.file.status === 'done') {
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    }
  };

  const uploadButtonProps: UploadProps = {
    name: 'file',
    multiple: true,
    onChange: handleChange,
    maxCount,
    showUploadList: true,
    fileList: fileList || value,
    ...uploadProps,
  };

  if (uploadType === 'dragger') {
    return (
      <Dragger {...uploadButtonProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: 'var(--theme-primary)' }} />
        </p>
        <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 500 }}>
          {uploadText}
        </p>
        <p className="ant-upload-hint" style={{ fontSize: 14, color: '#9ca3af' }}>
          {hint}
        </p>
      </Dragger>
    );
  }

  return (
    <Upload {...uploadButtonProps}>
      <Button icon={<UploadOutlined />}>{uploadText}</Button>
    </Upload>
  );
};

export default FileUpload;
