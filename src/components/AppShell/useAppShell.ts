import {
  computed,
  ref,
  shallowRef,
  onMounted,
  onUnmounted,
  provide,
  watch,
  nextTick,
  type Ref,
  type ComputedRef,
  type ShallowRef,
  type InjectionKey,
} from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoints, breakpointsTailwind, useLocalStorage } from '@vueuse/core'
import type { NavbarTabItem } from '@/types/navbar.type'
import type { AppShellProps } from '@/types/appshell.type'
import { useBreadcrumb } from '@/composables/useBreadcrumb'

// ─── Context Interface ────────────────────────────────────────────────────────

export interface AppShellLayoutContext {
  /** Original reactive props object */
  props: AppShellProps
  /** Whether layout mode is active (header/main slots provided) */
  isLayoutMode: boolean

  // State
  isMobileMenuOpen: Ref<boolean>
  isSidebarVisible: Ref<boolean>
  sidebarHidden: ComputedRef<boolean>
  pageTitle: ComputedRef<string>
  isScrolled: Ref<boolean>

  // Template refs — layout sub-components bind these via destructure
  mainScrollRef: Ref<HTMLElement | null>
  layoutMainRef: Ref<HTMLElement | null>

  // Functions
  toggleSidebar: () => void
  handleNestedTabClick: (val: string | number) => void

  // Breakpoint-driven CSS class maps
  breakpointClasses: ComputedRef<{
    mobileTrigger: string
    desktopContent: string
    sidebarLayout: string
    mobileHeader: string
    desktopSidebar: string
    desktopOnly: string
  }>

  /** Container classes — used by classic / standalone layouts */
  containerClasses: ComputedRef<string>
  /** Center slot alignment classes */
  centerClasses: ComputedRef<string | undefined>

  // Data
  breadcrumbData: { items: ComputedRef<any[]> }
  nestedTabsItems: ShallowRef<NavbarTabItem[]>
  activeNestedTab: Ref<string | number>
}

export const APPSHELL_LAYOUT_KEY: InjectionKey<AppShellLayoutContext> = Symbol('appshell-layout-ctx')

// ─── Composable ───────────────────────────────────────────────────────────────

export function useAppShell(props: AppShellProps, isLayoutMode: boolean): AppShellLayoutContext {
  // ── Breadcrumb ──────────────────────────────────────────────────────────────
  const breadcrumbData = props.breadcrumb
    ? useBreadcrumb({
        homeIcon: props.breadcrumbHomeIcon,
        labelMap: props.breadcrumbLabels || {},
      })
    : { items: computed(() => []) }

  // ── Nested Tabs (provide for SidebarMenu) ───────────────────────────────────
  const nestedTabsItems = shallowRef<NavbarTabItem[]>([])
  const activeNestedTab = ref<string | number>('')

  provide('navbar-context', {
    compact: computed(() => props.compact),
    renderNestedTabs: computed(() => props.renderNestedTabs),
    setNestedTabs: (tabs: NavbarTabItem[], activeTab: string | number) => {
      nestedTabsItems.value = tabs
      activeNestedTab.value = activeTab
    },
  })

  // ── Core State ──────────────────────────────────────────────────────────────
  const isMobileMenuOpen = ref(false)
  const isScrolled = ref(false)
  const mainScrollRef = ref<HTMLElement | null>(null)
  const layoutMainRef = ref<HTMLElement | null>(null)

  // Sidebar visibility — persisted in localStorage
  const isSidebarVisible = useLocalStorage<boolean>('vlite-appshell-sidebar-visible', true)
  const isSidebarToggleEnabled = computed(() => props.sidebarToggle && isLayoutMode)

  const toggleSidebar = () => {
    isSidebarVisible.value = !isSidebarVisible.value
  }

  const sidebarHidden = computed(() => {
    return isSidebarToggleEnabled.value && !isSidebarVisible.value
  })

  // ── Nested Tab Click ────────────────────────────────────────────────────────
  const handleNestedTabClick = (val: string | number) => {
    const targetTab = nestedTabsItems.value.find((t) => t.value === val)
    if (!targetTab) return
    if (typeof val === 'string' && val.startsWith('/')) {
      import('vue-router').then(({ useRouter }) => {
        const router = useRouter()
        router.push(val).catch(() => {})
      })
    } else {
      activeNestedTab.value = val
    }
  }

  // ── Scroll Detection ────────────────────────────────────────────────────────
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  // ── Breakpoint Classes ──────────────────────────────────────────────────────
  const breakpointClasses = computed(() => {
    const bp = props.mobileBreakpoint || 'md'

    const mobileTriggerClasses: Record<string, string> = {
      sm: 'sm:hidden',
      md: 'md:hidden',
      lg: 'lg:hidden',
      xl: 'xl:hidden',
    }

    const desktopContentClasses: Record<string, string> = {
      sm: 'hidden sm:flex',
      md: 'hidden md:flex',
      lg: 'hidden lg:flex',
      xl: 'hidden xl:flex',
    }

    const sidebarLayoutClasses: Record<string, string> = {
      sm: `flex flex-col max-sm:w-full ${props.compact ? 'w-20' : ''} h-auto sm:h-full sm:max-h-screen shrink-0`,
      md: `flex flex-col max-md:w-full ${props.compact ? 'w-20' : ''} h-auto md:h-full md:max-h-screen shrink-0`,
      lg: `flex flex-col max-lg:w-full ${props.compact ? 'w-20' : ''} h-auto lg:h-full lg:max-h-screen shrink-0`,
      xl: `flex flex-col max-xl:w-full ${props.compact ? 'w-20' : ''} h-auto xl:h-full xl:max-h-screen shrink-0`,
    }

    const mobileHeaderClasses: Record<string, string> = {
      sm: 'sm:hidden flex items-center justify-between px-4 py-3 shrink-0 bg-background',
      md: 'md:hidden flex items-center justify-between px-4 py-3 shrink-0 bg-background',
      lg: 'lg:hidden flex items-center justify-between px-4 py-3 shrink-0 bg-background',
      xl: 'xl:hidden flex items-center justify-between px-4 py-3 shrink-0 bg-background',
    }

    const desktopSidebarClasses: Record<string, string> = {
      sm: 'hidden sm:flex flex-col h-full w-full overflow-hidden',
      md: 'hidden md:flex flex-col h-full w-full overflow-hidden',
      lg: 'hidden lg:flex flex-col h-full w-full overflow-hidden',
      xl: 'hidden xl:flex flex-col h-full w-full overflow-hidden',
    }

    const desktopOnlyClasses: Record<string, string> = {
      sm: 'hidden sm:flex',
      md: 'hidden md:flex',
      lg: 'hidden lg:flex',
      xl: 'hidden xl:flex',
    }

    return {
      mobileTrigger: mobileTriggerClasses[bp],
      desktopContent: desktopContentClasses[bp],
      sidebarLayout: sidebarLayoutClasses[bp],
      mobileHeader: mobileHeaderClasses[bp],
      desktopSidebar: desktopSidebarClasses[bp],
      desktopOnly: desktopOnlyClasses[bp],
    }
  })

  // ── Container Classes (classic / standalone) ────────────────────────────────
  const containerClasses = computed(() => {
    const isSidebar = props.variant === 'sidebar'

    const positionClasses = {
      fixed: isLayoutMode ? 'relative z-40' : 'fixed top-0 left-0 z-40',
      sticky: isLayoutMode ? 'relative z-40' : 'sticky top-0 z-40',
      relative: 'relative z-10',
      absolute: isLayoutMode ? 'relative z-40' : 'absolute top-0 left-0 w-full z-40',
    }

    const base = 'bg-body'

    const effects = [
      props.glass && (isScrolled.value || isSidebar || props.floating)
        ? 'bg-background/95'
        : 'bg-background',
      props.border && !props.floating
        ? isSidebar
          ? 'border-r border-border'
          : 'border-b border-border'
        : '',
      props.floating ? 'm-4 rounded shadow-lg border border-border/50' : '',
      isScrolled.value && !props.floating && !isSidebar && props.position === 'sticky'
        ? 'shadow-sm'
        : '',
    ]

    const bp = props.mobileBreakpoint || 'md'
    const hideNavClasses: Record<string, string> = {
      sm: 'max-sm:hidden',
      md: 'max-md:hidden',
      lg: 'max-lg:hidden',
      xl: 'max-xl:hidden',
    }

    const hideOnMobile = isLayoutMode && isSidebar ? hideNavClasses[bp] : ''

    let layout = ''
    if (isSidebar) {
      layout = breakpointClasses.value.sidebarLayout
    } else {
      layout = `flex items-center gap-4 w-full px-4 sm:px-6 lg:px-8 ${props.height}`
    }

    return [base, positionClasses[props.position!], ...effects, layout, hideOnMobile, props.class]
      .filter(Boolean)
      .join(' ')
  })

  // ── Center Classes ──────────────────────────────────────────────────────────
  const centerClasses = computed(() => {
    if (props.variant === 'sidebar')
      return 'flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-stable'
    switch (props.centerPosition) {
      case 'left':
        return 'flex items-center justify-start'
    }
  })

  // ── Route Watching ──────────────────────────────────────────────────────────
  const route = useRoute()

  watch(
    () => route.path,
    () => {
      isMobileMenuOpen.value = false
      nextTick(() => {
        if (mainScrollRef.value) {
          mainScrollRef.value.scrollTop = 0
          if (mainScrollRef.value.firstElementChild) {
            ;(mainScrollRef.value.firstElementChild as HTMLElement).scrollTop = 0
          }
        }
        if (layoutMainRef.value) {
          layoutMainRef.value.scrollTop = 0
        }
      })
    }
  )

  // ── Breakpoint Watching ─────────────────────────────────────────────────────
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isDesktop = breakpoints.greater(props.mobileBreakpoint as any)

  watch(isDesktop, (val) => {
    if (val) {
      isMobileMenuOpen.value = false
    }
  })

  // ── Page Title ──────────────────────────────────────────────────────────────
  const pageTitle = computed(() => {
    return (route.meta?.title as string) || (route.name as string) || ''
  })

  // ── Build & Provide Context ─────────────────────────────────────────────────
  const ctx: AppShellLayoutContext = {
    props,
    isLayoutMode,
    isMobileMenuOpen,
    isSidebarVisible,
    sidebarHidden,
    pageTitle,
    isScrolled,
    mainScrollRef,
    layoutMainRef,
    toggleSidebar,
    handleNestedTabClick,
    breakpointClasses,
    containerClasses,
    centerClasses,
    breadcrumbData,
    nestedTabsItems,
    activeNestedTab,
  }

  provide(APPSHELL_LAYOUT_KEY, ctx)

  return ctx
}
