import {
  AppstoreOutlined,
  FireOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

export interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表板',
    path: '/dashboard',
    icon: <DashboardOutlined />,
  },
  {
    key: 'workspace',
    label: '工作区',
    path: '/workspace',
    icon: <ThunderboltOutlined />,
  },
  {
    key: 'hook-market',
    label: 'Hook 市场',
    path: '/hook-market',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'analytics',
    label: '数据分析',
    path: '/analytics',
    icon: <FireOutlined />,
  },
  {
    key: 'permission',
    label: '权限管理',
    path: '',
    icon: <SafetyOutlined />,
    children: [
      {
        key: 'permission-frontend',
        label: '前台权限',
        path: '/permission/frontend',
        icon: <UserSwitchOutlined />,
      },
      {
        key: 'permission-backend',
        label: '后台权限',
        path: '/permission/backend',
        icon: <SafetyOutlined />,
      },
    ],
  },
  {
    key: 'examples',
    label: '示例页面',
    path: '',
    icon: <FileTextOutlined />,
    children: [
      {
        key: 'examples-users',
        label: '用户管理',
        path: '/examples/users',
        icon: <TeamOutlined />,
      },
      {
        key: 'examples-forms',
        label: '表单示例',
        path: '/examples/forms',
        icon: <FileTextOutlined />,
      },
      {
        key: 'examples-charts',
        label: '图表示例',
        path: '/examples/charts',
        icon: <BarChartOutlined />,
      },
    ],
  },
];
