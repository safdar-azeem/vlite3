<script setup lang="ts">
import { computed } from 'vue'
import type { AppShellProps } from '@/types/appshell.type'
import { useAppShell } from './useAppShell'

// ── Layout sub-components ─────────────────────────────────────────────────────
import AppShellLayoutSidebarFirst from './AppShellLayoutSidebarFirst.vue'
import AppShellLayoutDashboard from './AppShellLayoutDashboard.vue'
import AppShellLayoutDock from './AppShellLayoutDock.vue'
import AppShellLayoutClassic from './AppShellLayoutClassic.vue'
import AppShellLayoutHeaderShell from './AppShellLayoutHeaderShell.vue'

const props = withDefaults(defineProps<AppShellProps>(), {
  variant: 'sidebar',
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
  layoutMode: 'variant1',
})

defineEmits<{
  (e: 'toggle-mobile'): void
}>()

// Initialise shared state and provide it to sub-components
// AppShell is always in layout mode, so we pass true.
useAppShell(props, true)

// ── Layout resolution ─────────────────────────────────────────────────────────
const layoutComponent = computed(() => {
  switch (props.layoutMode) {
    case 'variant1':
      return AppShellLayoutSidebarFirst
    case 'variant2':
      return AppShellLayoutDashboard
    case 'variant3':
      return AppShellLayoutDock
    case 'variant4':
      return AppShellLayoutClassic
    case 'variant5':
      return AppShellLayoutHeaderShell
    default:
      return AppShellLayoutSidebarFirst
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <component :is="layoutComponent">
    <template v-for="(_, name) in $slots" :key="name" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </component>
</template>
