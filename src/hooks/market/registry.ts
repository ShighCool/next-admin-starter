import { HookMetadata } from '@/types/hook-market';

export const hookRegistry: HookMetadata[] = [
  {
    id: 'use-table-data',
    name: 'useTableData',
    description: '表格数据管理 Hook，提供数据获取、分页、筛选、批量选择等功能',
    category: 'table',
    version: '1.0.0',
    author: 'Next Admin Team',
    rating: 4.8,
    downloads: 234,
    tags: ['表格', '分页', '筛选', '数据'],
    features: ['自动数据获取', '分页控制', '筛选条件管理', '批量选择', '加载状态管理'],
    codePreview: `const { 
  dataSource, 
  loading, 
  pagination, 
  fetch, 
  handleSearch 
} = useTableData({
  fetchData: userApi.list,
  defaultPageSize: 20,
})`,
    usage: '用于管理表格数据，自动处理分页和筛选逻辑',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'use-form-submit',
    name: 'useFormSubmit',
    description: '表单提交 Hook，提供表单校验、提交、成功/失败处理等功能',
    category: 'form',
    version: '1.0.0',
    author: 'Next Admin Team',
    rating: 4.6,
    downloads: 189,
    tags: ['表单', '提交', '校验'],
    features: ['自动表单校验', '提交状态管理', '成功/失败回调', '错误处理'],
    codePreview: `const { loading, submit } = useFormSubmit({
  submitApi: userApi.create,
  onSuccess: () => router.back(),
})

<Form onFinish={submit}>
  {/* 表单字段 */}
</Form>`,
    usage: '用于管理表单提交，自动处理校验和提交逻辑',
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'use-confirm',
    name: 'useConfirm',
    description: '确认对话框 Hook，提供二次确认功能',
    category: 'ui',
    version: '1.0.0',
    author: 'Next Admin Team',
    rating: 4.5,
    downloads: 156,
    tags: ['对话框', '确认', 'UI'],
    features: ['二次确认', '自定义标题和内容', '确认/取消回调'],
    codePreview: `const { confirm } = useConfirm()

const handleDelete = () => {
  confirm({
    title: '确认删除',
    content: '确定要删除这条数据吗？',
    onOk: () => deleteItem(),
  })
}`,
    usage: '用于危险操作的二次确认',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'use-data-export',
    name: 'useDataExport',
    description: '数据导出 Hook，支持 CSV 和 JSON 格式导出',
    category: 'data',
    version: '1.0.0',
    author: 'Next Admin Team',
    rating: 4.4,
    downloads: 132,
    tags: ['导出', 'CSV', 'JSON', '数据'],
    features: ['CSV 格式导出', 'JSON 格式导出', '自动下载', '导出状态管理'],
    codePreview: `const { exportCSV, exportJSON } = useDataExport()

<Button onClick={() => exportCSV(data, 'users.csv')}>
  导出 CSV
</Button>

<Button onClick={() => exportJSON(data, 'users.json')}>
  导出 JSON
</Button>`,
    usage: '用于导出数据到 CSV 或 JSON 文件',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

export const getHookById = (id: string): HookMetadata | undefined => {
  return hookRegistry.find((hook) => hook.id === id);
};

export const getHooksByCategory = (category: string): HookMetadata[] => {
  return hookRegistry.filter((hook) => hook.category === category);
};

export const searchHooks = (keyword: string): HookMetadata[] => {
  const lowerKeyword = keyword.toLowerCase();
  return hookRegistry.filter(
    (hook) =>
      hook.name.toLowerCase().includes(lowerKeyword) ||
      hook.description.toLowerCase().includes(lowerKeyword) ||
      hook.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
  );
};
