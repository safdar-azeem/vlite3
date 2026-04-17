import type { StatItemSchema } from '@/components/Stats/types'

/** Full 4-item SaaS dashboard set — used for most variant / layout demos */
export const dashboardItems: StatItemSchema[] = [
  {
    id: 1,
    title: 'Total Revenue',
    value: 45231.89,
    icon: 'lucide:dollar-sign',
    color: 'success',
    isPrice: true,
    trend: { value: '+20.1%', isPositive: true, label: 'vs last month' },
  },
  {
    id: 2,
    title: 'New Subscribers',
    value: 2350,
    icon: 'lucide:users',
    color: 'primary',
    trend: { value: '+180.1%', isPositive: true, label: 'vs last month' },
  },
  {
    id: 3,
    title: 'Orders Placed',
    value: 12234,
    icon: 'lucide:shopping-cart',
    color: 'warning',
    trend: { value: '+19%', isPositive: true, label: 'vs last month' },
  },
  {
    id: 4,
    title: 'Active Sessions',
    value: 573,
    icon: 'lucide:activity',
    color: 'info',
    trend: { value: '-201', isPositive: false, label: 'since last hour' },
  },
]

/** 3-item web analytics set — used for icon-shape / compact demos */
export const analyticsItems: StatItemSchema[] = [
  {
    id: 1,
    title: 'Bounce Rate',
    value: '24.5%',
    icon: 'lucide:mouse-pointer-click',
    color: 'danger',
    trend: { value: '-3.2%', isPositive: true, label: 'improvement' },
  },
  {
    id: 2,
    title: 'Page Views',
    value: '1.2M',
    icon: 'lucide:eye',
    color: 'primary',
    trend: { value: '+12%', isPositive: true, label: 'vs last week' },
  },
  {
    id: 3,
    title: 'Avg. Duration',
    value: '2m 15s',
    icon: 'lucide:clock',
    color: 'secondary',
    trend: { value: '+0m 22s', isPositive: true, label: 'vs last week' },
  },
]

/** 4-item inline-friendly set with concise values */
export const inlineItems: StatItemSchema[] = [
  {
    id: 1,
    title: 'Revenue',
    value: '$45,231',
    icon: 'lucide:dollar-sign',
    color: 'success',
    trend: { value: '+20%', isPositive: true },
  },
  {
    id: 2,
    title: 'Subscribers',
    value: '2,350',
    icon: 'lucide:users',
    color: 'primary',
    trend: { value: '+180%', isPositive: true },
  },
  {
    id: 3,
    title: 'Conversions',
    value: '8.4%',
    icon: 'lucide:percent',
    color: 'warning',
    trend: { value: '+2.1%', isPositive: true },
  },
  {
    id: 4,
    title: 'Churn',
    value: '1.2%',
    icon: 'lucide:trending-down',
    color: 'danger',
    trend: { value: '+0.3%', isPositive: false },
  },
]
