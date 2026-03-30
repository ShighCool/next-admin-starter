'use client';

import { App, ConfigProvider, FloatButton, Tooltip } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useState } from 'react';

// ── 主题配置 ────────────────────────────────────────────────────
type ThemeKey = 'blue' | 'purple' | 'orange';

const THEMES: Record<
  ThemeKey,
  {
    label: string;
    colorPrimary: string;
    headerColor: string;
    headerBg: string;
    headerSplitColor: string;
    rowHoverBg: string;
    menuSelected: string;
    menuTextSelected: string;
    menuHover: string;
    avatarBg: string;
  }
> = {
  blue: {
    label: '蓝猫',
    colorPrimary: '#4f9bfa',
    headerColor: '#4f9bfa',
    headerBg: '#f0f7ff',
    headerSplitColor: '#daeeff',
    rowHoverBg: '#f0f7ff',
    menuSelected: '#e0f0ff',
    menuTextSelected: '#4f9bfa',
    menuHover: '#f0f7ff',
    avatarBg: '#1e4976',
  },
  purple: {
    label: '紫薯',
    colorPrimary: '#9B59B6',
    headerColor: '#9B59B6',
    headerBg: '#f9f4fc',
    headerSplitColor: '#e8d5f0',
    rowHoverBg: '#f9f4fc',
    menuSelected: '#f0e0f7',
    menuTextSelected: '#9B59B6',
    menuHover: '#f9f4fc',
    avatarBg: '#4a235a',
  },
  orange: {
    label: '橙子',
    colorPrimary: '#F39C12',
    headerColor: '#F39C12',
    headerBg: '#fffaf0',
    headerSplitColor: '#fde8b0',
    rowHoverBg: '#fffaf0',
    menuSelected: '#fef0cc',
    menuTextSelected: '#F39C12',
    menuHover: '#fffaf0',
    avatarBg: '#8b5a00',
  },
};

const THEME_ORDER: ThemeKey[] = ['blue', 'purple', 'orange'];

const STORAGE_KEY = 'admin-theme';

// ── 主题图标（彩色圆点）─────────────────────────────────────────
// function ThemeDot({ color }: { color: string }) {
//   return (
//     <span style={{
//       display: 'inline-block', width: 14, height: 14,
//       borderRadius: '50%', background: color,
//       boxShadow: `0 0 0 2px rgba(255,255,255,0.8), 0 0 0 3px ${color}40`,
//     }} />
//   )
// }

function GlobalCopyToast() {
  const { message } = App.useApp();
  useEffect(() => {
    const handleCopy = () => message.success('已复制');
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);
  return null;
}

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>('blue');
  const [mounted, setMounted] = useState(false);

  // 确保组件只在客户端挂载
  useEffect(() => {
    setMounted(true);
    // 创建 portal 容器
    const container = document.createElement('div');
    container.id = 'root-portal';
    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  // 读取持久化主题
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    if (saved && THEMES[saved]) apply(saved);
  }, []);

  const apply = (key: ThemeKey) => {
    setThemeKey(key);
    const theme = THEMES[key];
    document.documentElement.style.setProperty('--theme-primary', theme.colorPrimary);
    document.documentElement.style.setProperty('--theme-avatar-bg', theme.avatarBg);
    localStorage.setItem(STORAGE_KEY, key);
  };

  const toggleTheme = () => {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(themeKey) + 1) % THEME_ORDER.length];
    apply(next);
  };

  const t = THEMES[themeKey];
  const next = THEMES[THEME_ORDER[(THEME_ORDER.indexOf(themeKey) + 1) % THEME_ORDER.length]];

  return (
    <ConfigProvider
      locale={zhCN}
      getPopupContainer={(triggerNode) => {
        // 如果是 Modal，返回 root-portal 或 body
        // 如果是其他弹出组件，尝试找到最近的容器
        const portal = document.getElementById('root-portal');
        if (portal) return portal;
        return document.body;
      }}
      theme={{
        token: {
          // 品牌色（跟随主题）
          colorPrimary: t.colorPrimary,
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#f5222d',

          // 圆角
          borderRadius: 6,
          borderRadiusLG: 8,

          // 间距
          padding: 16,
          paddingLG: 24,
          margin: 16,
          marginLG: 24,

          // 文字层级
          colorText: 'rgba(0,0,0,0.88)',
          colorTextSecondary: 'rgba(0,0,0,0.65)',
          colorTextTertiary: 'rgba(0,0,0,0.45)',

          // 背景
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f5f5f5',
          colorBorderSecondary: '#f0f0f0',

          // 控件高度
          controlHeight: 36,

          // 字体
          fontSize: 14,
          lineHeight: 1.75,
          fontWeightStrong: 700,
          fontFamily:
            'var(--font-sans), "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Card: {
            borderRadiusLG: 12,
          },
          Table: {
            headerBg: t.headerBg,
            headerColor: t.headerColor,
            headerBorderRadius: 8,
            headerSplitColor: t.headerSplitColor,
            borderColor: '#f0f0f0',
            rowHoverBg: t.rowHoverBg,
            cellPaddingBlock: 16,
            cellPaddingInline: 20,
          },
          Input: {
            borderRadius: 6,
          },
          Select: {
            borderRadius: 6,
          },
          Button: {
            controlHeightLG: 40,
            fontWeight: 500,
            primaryShadow: '0 2px 0 rgba(0,0,0,0.02)',
          },
          Menu: {
            itemSelectedBg: t.menuSelected,
            itemSelectedColor: t.menuTextSelected,
            itemHoverBg: t.menuHover,
            borderRadius: 6,
          },
          Modal: {
            borderRadiusLG: 10,
          },
          Drawer: {
            borderRadiusLG: 10,
          },
          Tag: {
            borderRadiusSM: 4,
            fontSizeSM: 12,
          },
          Pagination: {
            borderRadius: 6,
          },
        },
      }}
    >
      <App>
        <GlobalCopyToast />
        {children}

        {/* 全局主题切换按钮 - 已移除，使用顶部导航栏的主题编辑器 */}
        {/* <Tooltip title={`切换到${next.label}主题`} placement="left">
          <FloatButton
            icon={<ThemeDot color={t.colorPrimary} />}
            onClick={toggleTheme}
            style={{ insetInlineEnd: 24, bottom: 80 }}
          />
        </Tooltip> */}
      </App>
    </ConfigProvider>
  );
}
