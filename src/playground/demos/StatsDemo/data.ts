import type { StatItemSchema } from '@/components/Stats/types'

/**
 * 4-item SaaS dashboard set WITH trends.
 * Use only in demos where trend indicators are the point (Variants, Attached).
 */
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
  },
  {
    id: 3,
    title: 'Orders Placed',
    value: 12234,
    icon: 'lucide:shopping-cart',
    color: 'warning',
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

/**
 * 4-item clean set — NO trends.
 * Use for layout / icon-style demos where the focus is the layout, not the data.
 */
export const metricsItems: StatItemSchema[] = [
  {
    id: 1,
    title: 'Total Revenue',
    value: 45231.89,
    icon: 'lucide:dollar-sign',
    color: 'success',
    isPrice: true,
  },
  {
    id: 2,
    title: 'New Subscribers',
    value: 2350,
    icon: 'lucide:users',
    color: 'primary',
  },
  {
    id: 3,
    title: 'Orders Placed',
    value: 12234,
    icon: 'lucide:shopping-cart',
    color: 'warning',
  },
  {
    id: 4,
    title: 'Active Sessions',
    value: 573,
    icon: 'lucide:activity',
    color: 'info',
  },
]

/**
 * 3-item web analytics set — NO trends.
 * Use for 3-column icon shape / sizing demos.
 */
export const analyticsItems: StatItemSchema[] = [
  {
    id: 1,
    title: 'Bounce Rate',
    value: '24.5%',
    icon: 'lucide:mouse-pointer-click',
    color: 'danger',
  },
  {
    id: 2,
    title: 'Page Views',
    value: '1.2M',
    icon: 'lucide:eye',
    color: 'primary',
  },
  {
    id: 3,
    title: 'Avg. Session',
    value: '2m 15s',
    icon: 'lucide:clock',
    color: 'secondary',
  },
]

/**
 * 4-item compact inline set — NO trends.
 * Use for inline-label-value layout demos.
 */
export const inlineItems: StatItemSchema[] = [
  {
    id: 1,
    title: 'Revenue',
    value: '$45,231',
    icon: 'lucide:dollar-sign',
    color: 'success',
  },
  {
    id: 2,
    title: 'Subscribers',
    value: '2,350',
    icon: 'lucide:users',
    color: 'primary',
  },
  {
    id: 3,
    title: 'Conversions',
    value: '8.4%',
    icon: 'lucide:percent',
    color: 'warning',
  },
  {
    id: 4,
    title: 'Churn',
    value: '1.2%',
    icon: 'lucide:trending-down',
    color: 'danger',
  },
]
