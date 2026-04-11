<script setup lang="ts">
import { computed } from 'vue'
import type { AppShellProps } from '@/types/appshell.type'
import { useAppShell } from './useAppShell'

// ── Layout sub-components ─────────────────────────────────────────────────────
import AppShellLayoutSidebarFirst from './AppShellLayoutSidebarFirst.vue'
import AppShellLayoutDashboard from './AppShellLayoutDashboard.vue'
import AppShellLayoutDock from './AppShellLayoutDock.vue'
import AppShellLayoutClassic from './AppShellLayoutClassic.vue'

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
  layoutMode: 'sidebar-first',
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
    case 'sidebar-first':
      return AppShellLayoutSidebarFirst
    case 'dashboard':
      return AppShellLayoutDashboard
    case 'dock':
      return AppShellLayoutDock
    case 'classic':
      return AppShellLayoutClassic
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
    <!-- Forward every slot from the consumer to the resolved layout component -->
    <template v-for="(_, name) in $slots" :key="name" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </component>
</template>
