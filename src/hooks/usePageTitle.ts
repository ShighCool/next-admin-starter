'use client';

import { useEffect } from 'react';

const SITE_NAME = 'NEXT ADMIN';

/**
 * 动态设置页面标题
 * @param title 页面标题（菜单名称）
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} - ${SITE_NAME}`;
  }, [title]);
}
