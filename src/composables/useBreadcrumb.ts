import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItemSchema } from '@/components/Breadcrumb/types'

export interface UseBreadcrumbOptions {
  /** Icon for the home item (default: 'lucide:home') */
  homeIcon?: string
  /** Label for the home item (default: 'Home') */
  homeLabel?: string
  /** Path for the home item (default: '/') */
  homePath?: string
  /** Override labels for specific route paths, e.g. { '/settings': 'Preferences' } */
  labelMap?: Record<string, string>
}

/**
 * Converts a URL segment to a human-readable label.
 * e.g. "avatar-uploader" → "Avatar Uploader", "datatable" → "Datatable"
 */
function humanize(segment: string): string {
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Composable that generates reactive breadcrumb items from the current route path.
 */
export function useBreadcrumb(options: UseBreadcrumbOptions = {}) {
  const route = useRoute()

  const { homeIcon = 'lucide:home', homeLabel = 'Home', homePath = '/', labelMap = {} } = options

  const items = computed<BreadcrumbItemSchema[]>(() => {
    const path = route.path

    // If we're at the home path, just show a single Home item
    if (path === homePath || path === `${homePath}/`) {
      return [{ label: homeLabel, icon: homeIcon }]
    }

    // Split path into segments, filtering out empty strings
    const segments = path.split('/').filter(Boolean)

    // Home item always first
    const breadcrumbs: BreadcrumbItemSchema[] = [{ label: homeLabel, to: homePath, icon: homeIcon }]

    // Build cumulative path for each segment
    let cumulative = ''
    segments.forEach((segment, index) => {
      cumulative += `/${segment}`
      const isLast = index === segments.length - 1

      // Check labelMap for a custom label, otherwise humanize the segment
      const label = labelMap[cumulative] || humanize(segment)

      breadcrumbs.push({
        label,
        to: isLast ? undefined : cumulative,
        active: isLast,
      })
    })

    return breadcrumbs
  })

  return { items }
}
