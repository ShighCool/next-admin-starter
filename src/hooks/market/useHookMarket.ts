import { useState, useCallback } from 'react';
import { HookMetadata, InstalledHook } from '@/types/hook-market';
import { hookRegistry } from '../market/registry';

const INSTALLED_HOOKS_KEY = 'installed_hooks';

export const useHookMarket = () => {
  const [installedHooks, setInstalledHooks] = useState<InstalledHook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadInstalledHooks = useCallback(() => {
    try {
      const stored = localStorage.getItem(INSTALLED_HOOKS_KEY);
      if (stored) {
        setInstalledHooks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load installed hooks:', error);
    }
  }, []);

  const saveInstalledHooks = useCallback((hooks: InstalledHook[]) => {
    try {
      localStorage.setItem(INSTALLED_HOOKS_KEY, JSON.stringify(hooks));
    } catch (error) {
      console.error('Failed to save installed hooks:', error);
    }
  }, []);

  const installHook = useCallback(
    (hook: HookMetadata) => {
      const installedHook: InstalledHook = {
        metadata: hook,
        installedAt: Date.now(),
        enabled: true,
      };
      const newHooks = [...installedHooks, installedHook];
      setInstalledHooks(newHooks);
      saveInstalledHooks(newHooks);
      return true;
    },
    [installedHooks, saveInstalledHooks]
  );

  const uninstallHook = useCallback(
    (hookId: string) => {
      const newHooks = installedHooks.filter((h) => h.metadata.id !== hookId);
      setInstalledHooks(newHooks);
      saveInstalledHooks(newHooks);
      return true;
    },
    [installedHooks, saveInstalledHooks]
  );

  const isInstalled = useCallback(
    (hookId: string): boolean => {
      return installedHooks.some((h) => h.metadata.id === hookId);
    },
    [installedHooks]
  );

  const getAvailableHooks = useCallback((): HookMetadata[] => {
    return hookRegistry.filter((hook) => !isInstalled(hook.id));
  }, [isInstalled]);

  const getHooksByCategory = useCallback((category: string): HookMetadata[] => {
    if (category === 'all') {
      return hookRegistry;
    }
    return hookRegistry.filter((hook) => hook.category === category);
  }, []);

  const searchHooks = useCallback((keyword: string): HookMetadata[] => {
    const lowerKeyword = keyword.toLowerCase();
    return hookRegistry.filter(
      (hook) =>
        hook.name.toLowerCase().includes(lowerKeyword) ||
        hook.description.toLowerCase().includes(lowerKeyword) ||
        hook.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
    );
  }, []);

  return {
    installedHooks,
    selectedCategory,
    setSelectedCategory,
    loadInstalledHooks,
    installHook,
    uninstallHook,
    isInstalled,
    getAvailableHooks,
    getHooksByCategory,
    searchHooks,
  };
};
