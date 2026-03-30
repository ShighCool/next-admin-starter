'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface RouteTab {
  key: string;
  path: string;
  title: string;
}

interface RouteTabsContextValue {
  tabs: RouteTab[];
  activeTab: string | null;
  isCollapsed: boolean;
  showLayout: boolean;
  isSwitching: boolean;
  menuOpenKeys: string[];
  addTab: (tab: RouteTab) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  toggleCollapse: () => void;
  toggleLayout: () => void;
  setSwitching: (switching: boolean) => void;
  clearTabs: () => void;
  setMenuOpenKeys: (keys: string[]) => void;
}

const RouteTabsContext = createContext<RouteTabsContextValue | undefined>(undefined);

export const useRouteTabs = () => {
  const context = useContext(RouteTabsContext);
  if (!context) {
    throw new Error('useRouteTabs must be used within RouteTabsProvider');
  }
  return context;
};

export const RouteTabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<RouteTab[]>([]);
  const [activeTab, setActiveTabState] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLayout, setShowLayout] = useState(() => {
    const envValue = process.env.NEXT_PUBLIC_SHOW_MENU_AND_TABS;
    if (envValue === undefined || envValue === 'true' || envValue === '1') {
      return true;
    }
    return false;
  });
  const [isSwitching, setIsSwitching] = useState(false);
  const [menuOpenKeys, setMenuOpenKeysState] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 客户端 hydration 后从 localStorage 读取状态
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('route-tabs-collapsed');
    if (savedCollapsed === 'true') {
      setIsCollapsed(true);
    }

    const savedOpenKeys = localStorage.getItem('route-tabs-menu-open-keys');
    if (savedOpenKeys) {
      try {
        const parsed = JSON.parse(savedOpenKeys);
        if (Array.isArray(parsed)) {
          setMenuOpenKeysState(parsed);
        }
      } catch {
        // ignore
      }
    }

    setIsHydrated(true);
  }, []);

  const addTab = useCallback((tab: RouteTab) => {
    setTabs((prev) => {
      const exists = prev.find((t) => t.key === tab.key);
      if (exists) {
        return prev;
      }
      return [...prev, tab];
    });
    setActiveTabState(tab.key);
  }, []);

  const removeTab = useCallback(
    (key: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((t) => t.key !== key);
        if (activeTab === key && newTabs.length > 0) {
          setActiveTabState(newTabs[newTabs.length - 1].key);
        } else if (newTabs.length === 0) {
          setActiveTabState(null);
        }
        return newTabs;
      });
    },
    [activeTab]
  );

  const setActiveTab = useCallback((key: string) => {
    setIsSwitching(true);
    setActiveTabState(key);
    setTimeout(() => setIsSwitching(false), 300);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem('route-tabs-collapsed', String(newValue));
      return newValue;
    });
  }, []);

  const toggleLayout = useCallback(() => {
    setShowLayout((prev) => !prev);
  }, []);

  const setSwitching = useCallback((switching: boolean) => {
    setIsSwitching(switching);
  }, []);

  const clearTabs = useCallback(() => {
    setTabs([]);
    setActiveTabState(null);
  }, []);

  const setMenuOpenKeys = useCallback((keys: string[]) => {
    setMenuOpenKeysState(keys);
    localStorage.setItem('route-tabs-menu-open-keys', JSON.stringify(keys));
  }, []);

  return (
    <RouteTabsContext.Provider
      value={{
        tabs,
        activeTab,
        isCollapsed,
        showLayout,
        isSwitching,
        menuOpenKeys,
        addTab,
        removeTab,
        setActiveTab,
        toggleCollapse,
        toggleLayout,
        setSwitching,
        clearTabs,
        setMenuOpenKeys,
      }}
    >
      {children}
    </RouteTabsContext.Provider>
  );
};
