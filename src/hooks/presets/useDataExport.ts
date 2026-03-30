import { useState, useCallback } from 'react';
import type { MessageInstance } from 'antd/es/message/interface';

export const useDataExport = (message: MessageInstance) => {
  const [loading, setLoading] = useState(false);

  const exportCSV = useCallback(async (data: any[], filename: string = 'export.csv') => {
    setLoading(true);
    try {
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map((row) => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportJSON = useCallback(async (data: any[], filename: string = 'export.json') => {
    setLoading(true);
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    exportCSV,
    exportJSON,
  };
};
