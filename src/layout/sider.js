export default [
  {
    key: '1',
    icon: 'DashboardOutlined',
    title: 'Dashboard',
    path: '/dashboard',
    children: [
      {
        key: '1-1',
        title: 'Live Dashboard',
        path: '/dashboard',
      },
      {
        key: '1-2',
        title: 'Heatmap',
        path: '/heatmap',
      },
    ],
  },
  {
    key: '2',
    icon: 'FileOutlined',
    title: 'Report',
    path: '/report',
  },
  {
    key: '3',
    icon: 'DatabaseOutlined',
    title: 'Master Data',
    path: '/master-data',
  },
]
