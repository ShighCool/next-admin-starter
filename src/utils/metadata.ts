import { Metadata } from 'next';

const SITE_NAME = 'NEXT ADMIN';

/**
 * 生成页面 metadata
 * @param title 页面标题（菜单名称）
 * @param description 页面描述
 */
export function generatePageMetadata(title: string, description?: string): Metadata {
  return {
    title: `${title} - ${SITE_NAME}`,
    description: description || `${title} - ${SITE_NAME}`,
  };
}
