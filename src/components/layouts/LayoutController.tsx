'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useRouteTabs } from './RouteTabsContext';
import RouteTabs from './RouteTabs';
import SideMenu from './SideMenu';
import HeaderBar from './HeaderBar';
import CommandPalette from '@/components/features/CommandPalette';
import { CommandPaletteProvider } from '@/components/features/CommandPalette/CommandPaletteContext';
import AIAssistant from '@/components/features/AIAssistant';
import ShortcutList from '@/components/features/ShortcutList';
import { useGlobalKeyboard } from '@/hooks/useShortcut';

// 是否显示路由标签栏
const SHOW_ROUTE_TABS = true;

// 不显示布局的页面路径
const NO_LAYOUT_PATHS = ['/login'];

const LayoutController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { showLayout } = useRouteTabs();

  // 判断是否应该显示布局
  const shouldShowLayout = showLayout && !NO_LAYOUT_PATHS.includes(pathname);

  // 启用全局键盘监听
  useGlobalKeyboard();

  return (
    <CommandPaletteProvider>
      <div style={{ height: '100vh', display: 'flex' }}>
        {shouldShowLayout && <SideMenu />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {shouldShowLayout && <HeaderBar />}
          {shouldShowLayout && SHOW_ROUTE_TABS && <RouteTabs />}
          <div style={{ flex: 1, overflow: 'auto', padding: shouldShowLayout ? '2px' : 0 }}>
            {children}
          </div>
        </div>
        {shouldShowLayout && <CommandPalette />}
        {shouldShowLayout && <AIAssistant />}
        {shouldShowLayout && <ShortcutList />}
      </div>
    </CommandPaletteProvider>
  );
};

export default LayoutController;
