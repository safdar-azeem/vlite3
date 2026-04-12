import type { SidebarMenuItemSchema } from '@/components/SidebarMenu'

export const statItems = [
  { id: 1, title: 'Total Revenue', value: '$45,231', icon: 'lucide:dollar-sign', trend: { value: '12%', isPositive: true }, color: 'primary' },
  { id: 2, title: 'Active Users', value: '+2350', icon: 'lucide:users', trend: { value: '5%', isPositive: true }, color: 'success' },
  { id: 3, title: 'Sales', value: '+12,234', icon: 'lucide:credit-card', trend: { value: '1%', isPositive: false }, color: 'warning' },
  { id: 4, title: 'Bounce Rate', value: '14.5%', icon: 'lucide:activity', trend: { value: '2%', isPositive: false }, color: 'danger' },
]

export const menuItems: SidebarMenuItemSchema[] = [
  {
    label: 'Dashboard',
    icon: 'lucide:layout-dashboard',
    to: '/dashboard',
    badge: 'New',
    badgeClass: 'bg-primary/10 text-primary',
  },
  {
    label: 'Analytics',
    icon: 'lucide:bar-chart-3',
    children: [
      { label: 'Overview', to: '/analytics/overview' },
      { label: 'Performance', to: '/analytics/performance' },
      {
        label: 'Real-time',
        to: '/analytics/realtime',
        badge: 'Live',
        badgeClass: 'bg-green-100 text-green-700',
      },
    ],
  },
  {
    label: 'Projects',
    icon: 'lucide:folder',
    children: [
      {
        label: 'Active Projects',
        children: [{ label: 'Mobile App', to: '/projects/app' }],
      },
    ],
  },
  {
    label: 'Settings',
    icon: 'lucide:settings',
    children: [
      { label: 'Account', to: '/settings/account' },
      { label: 'Billing', to: '/settings/billing' },
    ],
  },
]
