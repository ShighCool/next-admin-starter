'use client';

import { useState, useCallback, useRef } from 'react';

export interface HistoryItem<T = any> {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  data: T;
  undoAction?: () => void;
  redoAction?: () => void;
}

const HISTORY_LIMIT = 50;

export const useHistory = <T = any>(initialState?: T) => {
  const [history, setHistory] = useState<HistoryItem<T>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isRedoing = useRef(false);
  const isUndoing = useRef(false);

  const addHistoryItem = useCallback(
    (item: Omit<HistoryItem<T>, 'id' | 'timestamp'>) => {
      const historyItem: HistoryItem<T> = {
        ...item,
        id: Date.now().toString(),
        timestamp: new Date(),
      };

      setHistory((prev) => {
        // 如果在中间位置添加新操作，删除后面的历史
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(historyItem);

        // 限制历史记录数量
        if (newHistory.length > HISTORY_LIMIT) {
          return newHistory.slice(-HISTORY_LIMIT);
        }

        return newHistory;
      });

      setCurrentIndex((prev) => Math.min(prev + 1, HISTORY_LIMIT - 1));
    },
    [currentIndex]
  );

  const undo = useCallback(() => {
    if (isUndoing.current || currentIndex < 0) return;

    isUndoing.current = true;
    const item = history[currentIndex];

    if (item.undoAction) {
      item.undoAction();
    }

    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => {
      isUndoing.current = false;
    }, 100);
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (isRedoing.current || currentIndex >= history.length - 1) return;

    isRedoing.current = true;
    const item = history[currentIndex + 1];

    if (item.redoAction) {
      item.redoAction();
    }

    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => {
      isRedoing.current = false;
    }, 100);
  }, [history, currentIndex]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    history,
    currentIndex,
    addHistoryItem,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  };
};

// 全局操作历史
let globalHistory: HistoryItem[] = [];
let globalIndex = -1;

export const addGlobalHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  const historyItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
    timestamp: new Date(),
  };

  globalHistory = globalHistory.slice(0, globalIndex + 1);
  globalHistory.push(historyItem);

  if (globalHistory.length > HISTORY_LIMIT) {
    globalHistory = globalHistory.slice(-HISTORY_LIMIT);
  }

  globalIndex = globalHistory.length - 1;
};

export const undoGlobal = () => {
  if (globalIndex < 0) return null;

  const item = globalHistory[globalIndex];
  if (item.undoAction) {
    item.undoAction();
  }

  globalIndex--;
  return item;
};

export const redoGlobal = () => {
  if (globalIndex >= globalHistory.length - 1) return null;

  globalIndex++;
  const item = globalHistory[globalIndex];
  if (item.redoAction) {
    item.redoAction();
  }

  return item;
};

export const getGlobalHistory = () => globalHistory;

export const canUndoGlobal = () => globalIndex >= 0;

export const canRedoGlobal = () => globalIndex < globalHistory.length - 1;

export const clearGlobalHistory = () => {
  globalHistory = [];
  globalIndex = -1;
};
