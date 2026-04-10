<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { NavbarProps } from '@/types/navbar.type'
import { useNavbar } from './useNavbar'

// ── Layout sub-components ─────────────────────────────────────────────────────
import NavbarLayoutSidebarFirst from './NavbarLayoutSidebarFirst.vue'
import NavbarLayoutDashboard from './NavbarLayoutDashboard.vue'
import NavbarLayoutDock from './NavbarLayoutDock.vue'
import NavbarLayoutClassic from './NavbarLayoutClassic.vue'
import NavbarStandalone from './NavbarStandalone.vue'

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
  layoutMode: 'sidebar-first',
})

defineEmits<{
  (e: 'toggle-mobile'): void
}>()

const slots = useSlots()
const isLayoutMode = !!(slots.header || slots.main)

// Initialise shared state and provide it to sub-components
useNavbar(props, isLayoutMode)

// ── Layout resolution ─────────────────────────────────────────────────────────
const layoutComponent = computed(() => {
  if (!isLayoutMode) return NavbarStandalone

  if (props.variant === 'sidebar') {
    switch (props.layoutMode) {
      case 'sidebar-first':
        return NavbarLayoutSidebarFirst
      case 'dashboard':
        return NavbarLayoutDashboard
      case 'dock':
        return NavbarLayoutDock
      default:
        return NavbarLayoutClassic
    }
  }

  return NavbarLayoutClassic
})
</script>

<template>
  <component :is="layoutComponent">
    <!-- Forward every slot from the consumer to the resolved layout component -->
    <template v-for="(_, name) in $slots" :key="name" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </component>
</template>
