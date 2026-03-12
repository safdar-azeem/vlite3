<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, useSlots, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoints, breakpointsTailwind, onClickOutside, useLocalStorage } from '@vueuse/core'
import Icon from '../Icon.vue'
import SidePanel from '../SidePanel.vue'
import Logo from '../Logo.vue'
import type { NavbarProps, NavbarTabItem } from '@/types/navbar.type'
import NavbarTabs from './NavbarTabs.vue'
import { Breadcrumb } from '../Breadcrumb'
import { useBreadcrumb } from '@/composables/useBreadcrumb'

const props = withDefaults(defineProps<NavbarProps>(), {
  variant: 'header',
  position: 'sticky',
  centerPosition: 'center',
  glass: false,
  border: true,
  floating: false,
  height: 'h-16',
  compact: false,
  class: '',
  mobileBreakpoint: 'md',
  logoClass: '',
  contentClass: '',
  menuClass: '',
  rightClass: '',
  mobileTriggerClass: '',
  mobileMenuVariant: 'sidepanel',
  renderNestedTabs: false,
  sidebarToggle: false,
  breadcrumb: false,
  breadcrumbVariant: 'default',
  breadcrumbSeparator: 'chevron',
  breadcrumbSize: 'sm',
  breadcrumbHomeIcon: 'lucide:home',
  breadcrumbPosition: 'header',
  breadcrumbClass: '',
  // New: controls layout mode style
  // 'classic' = old behavior (header full width top, sidebar+main below)
  // 'sidebar-first' = sidebar full height left, header+main on right
  layoutMode: 'sidebar-first',
})

// Auto-breadcrumb: generates items from the current route path
const breadcrumbData = props.breadcrumb
  ? useBreadcrumb({
      homeIcon: props.breadcrumbHomeIcon,
      labelMap: props.breadcrumbLabels || {},
    })
  : { items: computed(() => []) }

const nestedTabsItems = ref<NavbarTabItem[]>([])
const activeNestedTab = ref<string | number>('')

provide('navbar-context', {
  compact: computed(() => props.compact),
  renderNestedTabs: computed(() => props.renderNestedTabs),
  setNestedTabs: (tabs: NavbarTabItem[], activeTab: string | number) => {
    nestedTabsItems.value = tabs
    activeNestedTab.value = activeTab
  },
})

const emit = defineEmits<{
  (e: 'toggle-mobile'): void
}>()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const slots = useSlots()
const mobileMenuRef = ref<HTMLElement | null>(null)
const mobileTriggerRef = ref<HTMLElement | null>(null)

// Sidebar visibility state — persisted in localStorage
const isSidebarVisible = useLocalStorage<boolean>('vlite-navbar-sidebar-visible', true)

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

const isLayoutMode = computed(() => !!(slots.header || slots.main))

// Whether the sidebar toggle feature is active (only in layout mode with the prop enabled)
const isSidebarToggleEnabled = computed(() => props.sidebarToggle && isLayoutMode.value)

// Toggle sidebar visibility and persist preference
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

onClickOutside(
  mobileMenuRef,
  () => {
    isMobileMenuOpen.value = false
  },
  { ignore: [mobileTriggerRef] }
)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Nav container classes — used for standalone (non-layout) mode only
const containerClasses = computed(() => {
  const isSidebar = props.variant === 'sidebar'

  const positionClasses = {
    fixed: isLayoutMode.value ? 'relative z-40' : 'fixed top-0 left-0 z-40',
    sticky: isLayoutMode.value ? 'relative z-40' : 'sticky top-0 z-40',
    relative: 'relative z-10',
    absolute: isLayoutMode.value ? 'relative z-40' : 'absolute top-0 left-0 w-full z-40',
  }

  const base = 'bg-body'

  const effects = [
    props.glass && (isScrolled.value || isSidebar || props.floating)
      ? 'backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60'
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

  const hideOnMobile = isLayoutMode.value && isSidebar ? hideNavClasses[bp] : ''

  let layout = ''
  if (isSidebar) {
    layout = breakpointClasses.value.sidebarLayout
  } else {
    layout = `flex items-center gap-4 w-full px-4 sm:px-6 lg:px-8 ${props.height}`
  }

  return [base, positionClasses[props.position], ...effects, layout, hideOnMobile, props.class]
    .filter(Boolean)
    .join(' ')
})

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

const centerClasses = computed(() => {
  if (props.variant === 'sidebar') return 'flex-1 py-4 overflow-y-auto'
  switch (props.centerPosition) {
    case 'left':
      return 'flex items-center justify-start'
  }
})

const route = useRoute()
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false
  }
)

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greater(props.mobileBreakpoint as any)

watch(isDesktop, (val) => {
  if (val) {
    isMobileMenuOpen.value = false
  }
})

// Computed sidebar visibility: only hides on desktop when toggle is enabled
const sidebarHidden = computed(() => {
  return isSidebarToggleEnabled.value && !isSidebarVisible.value
})

// Whether to use the new sidebar-first layout
const isSidebarFirst = computed(() => {
  return isLayoutMode.value && props.variant === 'sidebar' && props.layoutMode === 'sidebar-first'
})
</script>

<template>
  <!--
    ============================================================
    LAYOUT MODE — SIDEBAR FIRST
    Sidebar spans full height on the left.
    Header + Main are stacked on the right.
    ============================================================
  -->
  <div
    v-if="isSidebarFirst"
    class="vlite-app-layout flex flex-row w-full h-full bg-body overflow-hidden">

    <!--
      SIDEBAR — full height, left edge
      Hidden on mobile (SidePanel handles mobile nav)
      Collapses via sidebarToggle
    -->
    <Transition
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-2">
      <nav
        v-show="!sidebarHidden"
        :class="[
          'shrink-0 h-full flex flex-col bg-background border-r border-border overflow-hidden z-30',
          breakpointClasses.mobileTrigger === 'md:hidden' ? 'max-md:hidden' : '',
          props.class,
        ]"
        role="navigation"
        aria-label="Sidebar">

        <!-- Sidebar scrollable content (default slot) -->
        <div
          class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin"
          :class="props.contentClass">
          <slot />
        </div>

        <!-- Sidebar bottom pinned footer (right slot) -->
        <div
          v-if="$slots.right"
          class="shrink-0 border-t border-border bg-background"
          :class="props.rightClass">
          <slot name="right" />
        </div>
      </nav>
    </Transition>

    <!--
      RIGHT COLUMN — header on top, main content below
    -->
    <div class="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

      <!-- HEADER — spans only the right column -->
      <header
        v-if="$slots.header"
        class="w-full shrink-0 z-20 bg-background">
        <slot
          name="header"
          :is-open="isMobileMenuOpen"
          :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)"
          :sidebar-visible="isSidebarVisible"
          :toggle-sidebar="toggleSidebar"
          :breadcrumb-items="breadcrumbData.items.value" />
      </header>

      <!-- MAIN CONTENT -->
      <main
        v-if="$slots.main"
        class="flex-1 overflow-y-auto w-full relative h-full flex flex-col min-h-0">
        <div v-if="props.renderNestedTabs && nestedTabsItems.length > 0" class="shrink-0 w-full">
          <NavbarTabs
            v-model="activeNestedTab"
            @change="handleNestedTabClick"
            :items="nestedTabsItems" />
        </div>
        <div
          v-if="
            props.breadcrumb &&
            props.breadcrumbPosition === 'main' &&
            breadcrumbData.items.value.length > 1
          "
          class="shrink-0 w-full border-b border-border px-6 py-2"
          :class="props.breadcrumbClass">
          <Breadcrumb
            :items="breadcrumbData.items.value"
            :variant="props.breadcrumbVariant"
            :separator="props.breadcrumbSeparator"
            :size="props.breadcrumbSize" />
        </div>
        <div class="flex-1 overflow-y-auto w-full relative h-full">
          <slot name="main" />
        </div>
      </main>
    </div>

    <!-- Mobile SidePanel drawer (below breakpoint) -->
    <SidePanel
      v-model:show="isMobileMenuOpen"
      position="left"
      size="sm"
      :triggerClass="breakpointClasses.mobileTrigger"
      class="z-60"
      headerClass="pl-3! pr-4.5! py-3!"
      bodyClass="p-0!"
      :class="breakpointClasses.mobileTrigger">
      <template #header>
        <slot name="logo">Brand</slot>
      </template>
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto px-3.5 pt-4">
          <slot />
        </div>
        <div class="mt-auto pt-2 border-t border-border px-3 py-2" v-if="$slots.right">
          <slot name="right" />
        </div>
      </div>
    </SidePanel>
  </div>

  <!--
    ============================================================
    LAYOUT MODE — CLASSIC (original behavior)
    Header full width on top, sidebar + main below.
    ============================================================
  -->
  <div
    v-else-if="isLayoutMode"
    class="vlite-app-layout flex flex-col w-full h-full bg-body overflow-hidden">

    <header v-if="$slots.header" class="w-full shrink-0 z-50 flex flex-col relative">
      <slot
        name="header"
        :is-open="isMobileMenuOpen"
        :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)"
        :sidebar-visible="isSidebarVisible"
        :toggle-sidebar="toggleSidebar"
        :breadcrumb-items="breadcrumbData.items.value">
      </slot>
    </header>

    <div class="flex flex-1 w-full overflow-hidden relative">
      <Transition
        enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
        leave-active-class="transition-all duration-300 ease-in-out overflow-hidden"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <nav
          v-show="!sidebarHidden"
          :class="containerClasses"
          role="navigation"
          :style="isSidebarToggleEnabled ? 'transition: width 0.3s ease, opacity 0.3s ease;' : ''">
          <template v-if="variant === 'header'">
            <div class="flex items-center gap-4 shrink-0 z-10">
              <slot
                name="mobile-trigger"
                :is-open="isMobileMenuOpen"
                :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)">
                <button
                  type="button"
                  ref="mobileTriggerRef"
                  class="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-md shrink-0"
                  :class="[breakpointClasses.mobileTrigger, props.mobileTriggerClass]"
                  @click="isMobileMenuOpen = !isMobileMenuOpen">
                  <Icon icon="lucide:menu" class="w-5 h-5" />
                  <span class="sr-only">Open Menu</span>
                </button>
              </slot>
              <div class="shrink-0" :class="props.logoClass" v-if="$slots?.logo">
                <slot name="logo">
                  <component
                    :is="props.logo ? 'img' : 'div'"
                    :src="props.logo"
                    class="h-8 w-auto font-bold text-xl flex items-center gap-2">
                    <Logo v-if="!props.logo" class="h-6 w-6" />
                    <span v-if="!props.logo && props.logoAlt">{{ props.logoAlt }}</span>
                    <span v-else-if="!props.logo">Brand</span>
                  </component>
                </slot>
              </div>
              <div
                v-if="$slots?.left"
                class="items-center gap-1 overflow-x-auto no-scrollbar mask-gradient"
                :class="breakpointClasses.desktopContent">
                <slot name="left" />
              </div>
            </div>
            <div :class="[centerClasses, 'max-w-full', props.contentClass]" v-if="$slots?.center">
              <slot name="center" />
            </div>
            <div
              class="flex items-center gap-2 shrink-0 max-w-[40%] z-10"
              :class="[
                { 'ml-auto': centerPosition === 'left' || centerPosition === 'center' },
                props.rightClass,
              ]">
              <slot name="right" />
            </div>
          </template>

          <template v-else>
            <div v-if="!$slots.header" :class="breakpointClasses.mobileHeader">
              <slot name="logo" v-if="$slots?.logo">
                <div class="font-bold text-xl truncate">Brand</div>
              </slot>
              <slot
                name="mobile-trigger"
                :is-open="isMobileMenuOpen"
                :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)">
                <button
                  type="button"
                  ref="mobileTriggerRef"
                  class="p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-md"
                  :class="props.mobileTriggerClass"
                  @click="isMobileMenuOpen = !isMobileMenuOpen">
                  <Icon icon="lucide:menu" class="w-5 h-5" />
                  <span class="sr-only">Open Menu</span>
                </button>
              </slot>
            </div>
            <div :class="breakpointClasses.desktopSidebar">
              <div
                class="py-4.5 flex items-center px-4.5 z-10"
                :class="props.logoClass"
                v-if="$slots?.logo">
                <slot name="logo">
                  <div class="font-bold text-xl truncate">Brand</div>
                </slot>
              </div>
              <div
                class="flex-1 px-2.5 pt-0 pb-4 overflow-y-auto space-y-4 scrollbar-thin"
                :class="props.contentClass">
                <slot name="left" />
                <slot />
                <slot name="center" />
              </div>
              <div
                class="p-2 border-t border-border shrink-0 bg-background mt-auto"
                :class="props.rightClass"
                v-if="$slots?.right">
                <slot name="right" />
              </div>
            </div>
          </template>
        </nav>
      </Transition>

      <main v-if="$slots.main" class="flex-1 overflow-y-auto w-full relative h-full flex flex-col">
        <div v-if="props.renderNestedTabs && nestedTabsItems.length > 0" class="shrink-0 w-full">
          <NavbarTabs
            v-model="activeNestedTab"
            @change="handleNestedTabClick"
            :items="nestedTabsItems" />
        </div>
        <div
          v-if="
            props.breadcrumb &&
            props.breadcrumbPosition === 'main' &&
            breadcrumbData.items.value.length > 1
          "
          class="shrink-0 w-full border-b border-border px-6 py-2"
          :class="props.breadcrumbClass">
          <Breadcrumb
            :items="breadcrumbData.items.value"
            :variant="props.breadcrumbVariant"
            :separator="props.breadcrumbSeparator"
            :size="props.breadcrumbSize" />
        </div>
        <div class="flex-1 overflow-y-auto w-full relative h-full">
          <slot name="main" />
        </div>
      </main>

      <template v-if="props.mobileMenuVariant === 'dropdown'">
        <div
          v-if="isMobileMenuOpen"
          ref="mobileMenuRef"
          class="absolute top-[calc(100%_+_1px)] left-0 w-full bg-body border border-border/50 shadow-xl z-50 flex flex-col transition-all duration-300 origin-top overflow-hidden will-change-transform"
          :class="props.menuClass">
          <div class="flex flex-col max-h-[80vh] overflow-y-auto">
            <slot name="mobile-menu">
              <div class="space-y-1 p-2">
                <slot name="left" />
              </div>
              <div class="h-px bg-border/50 my-1 mx-2"></div>
              <div class="space-y-1 p-2">
                <slot name="center" />
              </div>
            </slot>
          </div>
        </div>
      </template>

      <SidePanel
        v-else
        v-model:show="isMobileMenuOpen"
        position="left"
        size="sm"
        :triggerClass="breakpointClasses.mobileTrigger"
        class="z-60"
        headerClass="pl-3! pr-4.5! py-3!"
        bodyClass="p-0!"
        :class="breakpointClasses.mobileTrigger">
        <template #header>
          <slot name="logo">Brand</slot>
        </template>
        <div class="flex flex-col space-y-6 pt-4 h-full">
          <template v-if="variant === 'header'">
            <div class="flex flex-col space-y-1">
              <slot name="mobile-menu">
                <slot name="left" />
                <div class="h-px bg-border my-2"></div>
                <slot name="center" />
              </slot>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col space-y-4 flex-1 overflow-y-auto px-3.5!">
              <slot name="left" />
              <slot />
              <slot name="center" />
            </div>
          </template>
          <div class="mt-auto pt-2 border-t border-border px-3! py-2!" v-if="$slots?.right">
            <slot name="right" />
          </div>
        </div>
      </SidePanel>
    </div>
  </div>

  <!--
    ============================================================
    STANDALONE NAV (no layout mode)
    ============================================================
  -->
  <nav v-else :class="containerClasses" role="navigation">
    <template v-if="variant === 'header'">
      <div class="flex items-center gap-4 shrink-0 z-10">
        <slot
          name="mobile-trigger"
          :is-open="isMobileMenuOpen"
          :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)">
          <button
            type="button"
            ref="mobileTriggerRef"
            class="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-md shrink-0"
            :class="[breakpointClasses.mobileTrigger, props.mobileTriggerClass]"
            @click="isMobileMenuOpen = !isMobileMenuOpen">
            <Icon icon="lucide:menu" class="w-5 h-5" />
            <span class="sr-only">Open Menu</span>
          </button>
        </slot>
        <div class="shrink-0" :class="props.logoClass" v-if="$slots?.logo">
          <slot name="logo">
            <component
              :is="props.logo ? 'img' : 'div'"
              :src="props.logo"
              class="h-8 w-auto font-bold text-xl flex items-center gap-2">
              <Logo v-if="!props.logo" class="h-6 w-6" />
              <span v-if="!props.logo && props.logoAlt">{{ props.logoAlt }}</span>
              <span v-else-if="!props.logo">Brand</span>
            </component>
          </slot>
        </div>
        <div
          v-if="$slots?.left"
          class="items-center gap-1 overflow-x-auto no-scrollbar mask-gradient"
          :class="breakpointClasses.desktopContent">
          <slot name="left" />
        </div>
      </div>
      <div :class="[centerClasses, 'max-w-full', props.contentClass]" v-if="$slots?.center">
        <slot name="center" />
      </div>
      <div
        class="flex items-center gap-2 shrink-0 max-w-[40%] z-10"
        :class="[
          { 'ml-auto': centerPosition === 'left' || centerPosition === 'center' },
          props.rightClass,
        ]">
        <slot name="right" />
      </div>
    </template>

    <template v-else>
      <div :class="breakpointClasses.mobileHeader">
        <slot name="logo" v-if="$slots?.logo">
          <div class="font-bold text-xl truncate">Brand</div>
        </slot>
        <slot
          name="mobile-trigger"
          :is-open="isMobileMenuOpen"
          :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)">
          <button
            type="button"
            ref="mobileTriggerRef"
            class="p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-md"
            :class="props.mobileTriggerClass"
            @click="isMobileMenuOpen = !isMobileMenuOpen">
            <Icon icon="lucide:menu" class="w-5 h-5" />
            <span class="sr-only">Open Menu</span>
          </button>
        </slot>
      </div>
      <div :class="breakpointClasses.desktopSidebar">
        <div
          class="py-4.5 flex items-center px-4.5 z-10"
          :class="props.logoClass"
          v-if="$slots?.logo">
          <slot name="logo">
            <div class="font-bold text-xl truncate">Brand</div>
          </slot>
        </div>
        <div
          class="flex-1 px-2.5 pt-0 pb-4 overflow-y-auto space-y-4 scrollbar-thin"
          :class="props.contentClass">
          <slot name="left" />
          <slot />
          <slot name="center" />
        </div>
        <div
          class="p-2 border-t border-border shrink-0 bg-background mt-auto"
          :class="props.rightClass"
          v-if="$slots?.right">
          <slot name="right" />
        </div>
      </div>
    </template>

    <template v-if="props.mobileMenuVariant === 'dropdown'">
      <div
        v-if="isMobileMenuOpen"
        ref="mobileMenuRef"
        class="absolute top-[calc(100%_+_1px)] left-0 w-full bg-body border border-border/50 shadow-xl z-50 flex flex-col transition-all duration-300 origin-top overflow-hidden will-change-transform"
        :class="props.menuClass">
        <div class="flex flex-col max-h-[80vh] overflow-y-auto">
          <slot name="mobile-menu">
            <div class="space-y-1 p-2">
              <slot name="left" />
            </div>
            <div class="h-px bg-border/50 my-1 mx-2"></div>
            <div class="space-y-1 p-2">
              <slot name="center" />
            </div>
          </slot>
        </div>
      </div>
    </template>

    <SidePanel
      v-else
      v-model:show="isMobileMenuOpen"
      position="left"
      size="sm"
      :triggerClass="breakpointClasses.mobileTrigger"
      class="z-60"
      headerClass="pl-3! pr-4.5! py-3!"
      bodyClass="p-0!"
      :class="breakpointClasses.mobileTrigger">
      <template #header>
        <slot name="logo">Brand</slot>
      </template>
      <div class="flex flex-col space-y-6 pt-4 h-full">
        <template v-if="variant === 'header'">
          <div class="flex flex-col space-y-1">
            <slot name="mobile-menu">
              <slot name="left" />
              <div class="h-px bg-border my-2"></div>
              <slot name="center" />
            </slot>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col space-y-4 flex-1 overflow-y-auto px-3.5!">
            <slot name="left" />
            <slot />
            <slot name="center" />
          </div>
        </template>
        <div class="mt-auto pt-2 border-t border-border px-3! py-2!" v-if="$slots?.right">
          <slot name="right" />
        </div>
      </div>
    </SidePanel>
  </nav>
</template>
