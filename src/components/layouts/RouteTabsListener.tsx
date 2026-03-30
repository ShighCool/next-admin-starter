'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouteTabs } from './RouteTabsContext';

const RouteTabsListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addTab, tabs, setActiveTab } = useRouteTabs();

  useEffect(() => {
    const fullPath = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');

    const getTitleFromPath = (path: string): string => {
      const pathMap: Record<string, string> = {
        '/': '首页',
        '/dashboard': '仪表板',
        '/workspace': '工作区',
        '/hook-market': 'Hook 市场',
        '/analytics': '数据分析',
        '/permission/frontend': '前台权限',
        '/permission/backend': '后台权限',
        '/profile': '个人中心',
        '/settings': '系统设置',
        '/examples/users': '用户管理',
        '/examples/forms': '表单示例',
        '/examples/charts': '图表示例',
      };

      if (pathMap[path]) {
        return pathMap[path];
      }

      const segments = path.split('/').filter(Boolean);
      if (segments.length === 0) return '首页';

      const lastSegment = segments[segments.length - 1];
      const titleMap: Record<string, string> = {
        'hook-market': 'Hook 市场',
        analytics: '数据分析',
        dashboard: '仪表板',
        workspace: '工作区',
        permission: '权限管理',
        frontend: '前台权限',
        backend: '后台权限',
        profile: '个人中心',
        settings: '系统设置',
        examples: '示例',
        users: '用户管理',
        forms: '表单',
        charts: '图表',
        stats: '统计',
        game: '游戏',
        forums: '论坛',
        soa: 'SOA服务',
        common: '通用',
      };

      return titleMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    const title = getTitleFromPath(pathname);

    addTab({
      key: fullPath,
      path: fullPath,
      title,
    });

    // 同时设置当前激活的标签
    setActiveTab(fullPath);
  }, [pathname, searchParams, addTab, setActiveTab]);

  return <>{children}</>;
};

export default RouteTabsListener;
