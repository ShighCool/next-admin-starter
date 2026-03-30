import { useState, useCallback } from 'react';

interface TableDataOptions {
  fetchData: (params: any) => Promise<{ list: any[]; total: number }>;
  defaultPageSize?: number;
}

export const useTableData = ({ fetchData, defaultPageSize = 20 }: TableDataOptions) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetch = useCallback(
    async (params?: any) => {
      setLoading(true);
      try {
        const res = await fetchData({
          ...filters,
          page: pagination.current,
          size: pagination.pageSize,
          ...params,
        });
        setDataSource(res.list);
        setPagination({
          ...pagination,
          total: res.total,
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchData, filters, pagination]
  );

  const handleTableChange = (pagination: any, filters: any) => {
    setPagination(pagination);
    setFilters(filters);
  };

  const handleSearch = (searchValues: any) => {
    setFilters(searchValues);
    setPagination({ ...pagination, current: 1 });
  };

  return {
    dataSource,
    loading,
    pagination,
    filters,
    selectedRowKeys,
    setSelectedRowKeys,
    fetch,
    handleTableChange,
    handleSearch,
  };
};
