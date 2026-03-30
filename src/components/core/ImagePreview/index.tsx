'use client';

import React from 'react';
import { Image } from 'antd';

export interface ImagePreviewProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  preview?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = '图片',
  width = 120,
  height = 120,
  style,
  preview = true,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        objectFit: 'cover',
        borderRadius: 8,
        cursor: preview ? 'pointer' : 'default',
        ...style,
      }}
      preview={
        preview
          ? {
              mask: '点击预览',
            }
          : false
      }
    />
  );
};

export default ImagePreview;
