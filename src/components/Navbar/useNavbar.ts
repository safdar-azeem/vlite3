import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import type { NavbarProps } from '@/types/navbar.type'

export interface NavbarContext {
  props: NavbarProps
  isMobileMenuOpen: Ref<boolean>
  isScrolled: Ref<boolean>
  breakpointClasses: ComputedRef<{
    mobileTrigger: string
    desktopContent: string
    mobileHeader: string
    desktopSidebar: string
    desktopOnly: string
  }>
  containerClasses: ComputedRef<string>
  centerClasses: ComputedRef<string | undefined>
}

export function useNavbar(props: NavbarProps): NavbarContext {
  const isMobileMenuOpen = ref(false)
  const isScrolled = ref(false)

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
      mobileHeader: mobileHeaderClasses[bp],
      desktopSidebar: desktopSidebarClasses[bp],
      desktopOnly: desktopOnlyClasses[bp],
    }
  })

  // ── Container Classes ───────────────────────────────────────────────────────
  const containerClasses = computed(() => {
    const isSidebar = props.variant === 'sidebar'

    const positionClasses = {
      fixed: 'fixed top-0 left-0 z-40',
      sticky: 'sticky top-0 z-40',
      relative: 'relative z-10',
      absolute: 'absolute top-0 left-0 w-full z-40',
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

    let layout = ''
    if (isSidebar) {
      layout = `flex flex-col h-full w-full max-sm:w-full ${props.compact ? 'w-20' : ''}`
    } else {
      layout = `flex items-center gap-4 w-full px-4 sm:px-6 lg:px-8 ${props.height}`
    }

    return [base, positionClasses[props.position!], ...effects, layout, props.class]
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

  // ── Breakpoint Watching ─────────────────────────────────────────────────────
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isDesktop = breakpoints.greater(props.mobileBreakpoint as any)

  watch(isDesktop, (val) => {
    if (val) {
      isMobileMenuOpen.value = false
    }
  })

  return {
    props,
    isMobileMenuOpen,
    isScrolled,
    breakpointClasses,
    containerClasses,
    centerClasses,
  }
}

