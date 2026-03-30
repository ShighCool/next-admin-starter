'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ClickEvent, HeatmapData, HeatmapConfig, ElementClickStats } from '@/types/heatmap';

const STORAGE_KEY = 'heatmap_click_events';
const MAX_EVENTS = 10000;

const defaultConfig: HeatmapConfig = {
  enabled: true,
  showClicks: false,
  showHeatmap: false,
  intensity: 0.5,
  radius: 30,
};

export const useHeatmap = () => {
  const pathname = usePathname();
  const [config, setConfig] = useState<HeatmapConfig>(defaultConfig);
  const [events, setEvents] = useState<ClickEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const loadEvents = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as { events: ClickEvent[] };
        return data.events || [];
      }
    } catch (error) {
      console.error('Failed to load heatmap events:', error);
    }
    return [];
  }, []);

  const saveEvents = useCallback((newEvents: ClickEvent[]) => {
    try {
      const eventsToSave = newEvents.slice(-MAX_EVENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ events: eventsToSave }));
    } catch (error) {
      console.error('Failed to save heatmap events:', error);
    }
  }, []);

  const generateSelector = useCallback((element: HTMLElement): string => {
    if (element.id) {
      return '#' + element.id;
    }

    if (element.className) {
      // 确保 className 是字符串（SVG 元素的 className 是对象）
      const className =
        typeof element.className === 'string'
          ? element.className
          : element.getAttribute('class') || '';

      if (className) {
        const classes = className.split(' ').filter((c) => c.trim());
        if (classes.length > 0) {
          return '.' + classes.join('.');
        }
      }
    }

    return element.tagName.toLowerCase();
  }, []);

  const detectElementType = useCallback(
    (element: HTMLElement): 'link' | 'button' | 'menu' | 'form' | 'other' => {
      if (element.tagName === 'BUTTON' || element.tagName === 'A') {
        return element.tagName.toLowerCase() as 'button' | 'link';
      }
      if (element.closest('.ant-menu')) {
        return 'menu';
      }
      if (element.closest('form')) {
        return 'form';
      }
      return 'other';
    },
    []
  );

  const extractLabel = useCallback((element: HTMLElement): string | undefined => {
    const text = element.textContent?.trim();
    if (text && text.length < 50) {
      return text;
    }
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }
    const title = element.getAttribute('title');
    if (title) {
      return title;
    }
    return undefined;
  }, []);

  const recordClick = useCallback(
    (event: MouseEvent) => {
      if (!config.enabled) return;

      const target = event.target as HTMLElement;
      if (!target) return;

      const clickEvent: ClickEvent = {
        id: 'click_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        path: pathname,
        element: {
          tag: target.tagName.toLowerCase(),
          id: target.id || undefined,
          className:
            typeof target.className === 'string'
              ? target.className
              : target.getAttribute('class') || undefined,
          text: target.textContent?.trim().slice(0, 100) || undefined,
          selector: generateSelector(target),
        },
        position: {
          x: event.pageX,
          y: event.pageY,
          viewportX: event.clientX,
          viewportY: event.clientY,
        },
        metadata: {
          type: detectElementType(target),
          label: extractLabel(target),
        },
      };

      setEvents((prev) => {
        const newEvents = [...prev, clickEvent];
        saveEvents(newEvents);
        return newEvents;
      });
    },
    [config.enabled, pathname, generateSelector, detectElementType, extractLabel, saveEvents]
  );

  const getHeatmapData = useCallback(
    (path?: string): HeatmapData => {
      const targetPath = path || pathname;
      const pathEvents = events.filter((e) => e.path === targetPath);

      const uniqueSelectors = new Set(pathEvents.map((e) => e.element.selector));
      const timestamps = pathEvents.map((e) => e.timestamp);

      return {
        path: targetPath,
        events: pathEvents,
        stats: {
          totalClicks: pathEvents.length,
          uniqueElements: uniqueSelectors.size,
          dateRange: {
            start: timestamps.length > 0 ? Math.min(...timestamps) : Date.now(),
            end: timestamps.length > 0 ? Math.max(...timestamps) : Date.now(),
          },
        },
      };
    },
    [events, pathname]
  );

  const getElementStats = useCallback(
    (path?: string): ElementClickStats[] => {
      const data = getHeatmapData(path);
      const elementMap = new Map<string, ElementClickStats>();

      data.events.forEach((event) => {
        const selector = event.element.selector || 'unknown';
        const existing = elementMap.get(selector);

        if (existing) {
          existing.count++;
          existing.lastClicked = Math.max(existing.lastClicked, event.timestamp);
        } else {
          elementMap.set(selector, {
            selector,
            label: event.metadata?.label || selector,
            count: 1,
            percentage: 0,
            firstClicked: event.timestamp,
            lastClicked: event.timestamp,
            type: event.metadata?.type || 'other',
          });
        }
      });

      const total = data.stats.totalClicks;
      const stats = Array.from(elementMap.values())
        .map((s) => ({
          ...s,
          percentage: total > 0 ? (s.count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

      return stats;
    },
    [getHeatmapData]
  );

  const clearEvents = useCallback(() => {
    setEvents([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    const loadedEvents = loadEvents();
    setEvents(loadedEvents);
  }, [loadEvents]);

  useEffect(() => {
    if (isRecording) {
      const handleGlobalClick = (e: MouseEvent) => {
        recordClick(e);
      };

      document.addEventListener('click', handleGlobalClick, true);

      return () => {
        document.removeEventListener('click', handleGlobalClick, true);
      };
    }
  }, [isRecording, recordClick]);

  return {
    config,
    setConfig,
    events,
    isRecording,
    setIsRecording,
    getHeatmapData,
    getElementStats,
    clearEvents,
    loadEvents,
    saveEvents,
  };
};
