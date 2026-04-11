<script setup lang="ts">
/**
 * NavbarLayoutDock
 * ────────────────
 * A minimal "dock" layout where the sidebar is a compact floating card
 * that sizes itself to its content (not full height). The sidebar is
 * vertically centered on the left, while the main content fills a
 * full-height rounded container on the right.
 *
 * On mobile the sidebar is hidden and a SidePanel drawer handles navigation.
 */
import { inject } from 'vue'
import SidePanel from '../SidePanel.vue'
import NavbarTabs from '../Navbar/NavbarTabs.vue'
import { Breadcrumb } from '../Breadcrumb'
import { APPSHELL_LAYOUT_KEY } from './useAppShell'

const ctx = inject(APPSHELL_LAYOUT_KEY)!
const {
  props,
  sidebarHidden,
  isMobileMenuOpen,
  isSidebarVisible,
  toggleSidebar,
  pageTitle,
  breadcrumbData,
  breakpointClasses,
  nestedTabsItems,
  activeNestedTab,
  handleNestedTabClick,
  mainScrollRef,
  layoutMainRef,
} = ctx
</script>

<template>
  <div
    class="vlite-app-layout flex flex-row w-full h-full bg-muted/20 p-0 sm:p-2 gap-0 sm:gap-2 overflow-hidden items-stretch">
    <!-- ── Floating Dock Sidebar ──────────────────────────────────────────── -->
    <Transition
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-x-2 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 -translate-x-2 scale-95">
      <nav
        v-show="!sidebarHidden"
        :class="[
          'shrink-0 self-center flex flex-col items-center bg-background rounded-2xl max-sm:rounded-none border border-border/70 max-sm:border-0 shadow-sm overflow-hidden z-30 py-3 px-2 gap-0.5',
          breakpointClasses.mobileTrigger === 'md:hidden' ? 'max-md:hidden' : '',
          props.class,
        ]"
        role="navigation"
        aria-label="Sidebar dock">
        <!-- Logo -->
        <div
          v-if="$slots.logo"
          class="flex items-center justify-center mb-1.5 pb-2 border-b border-border/40 w-full">
          <slot name="logo" />
        </div>

        <!-- Navigation items (icons) -->
        <div
          class="flex flex-col items-center gap-0.5 w-full"
          :class="props.contentClass">
          <slot />
        </div>

        <!-- Bottom actions -->
        <div
          v-if="$slots.right"
          class="flex flex-col items-center mt-1.5 pt-2 border-t border-border/40 w-full"
          :class="props.rightClass">
          <slot name="right" />
        </div>
      </nav>
    </Transition>

    <!-- ── Main Content Container ─────────────────────────────────────────── -->
    <div
      class="flex flex-col flex-1 min-w-0 h-full overflow-hidden bg-background rounded-xl max-sm:rounded-none border border-border/70 max-sm:border-0 shadow-sm">
      <header
        v-if="$slots.header"
        class="w-full shrink-0 z-20 bg-background border-b border-border/50">
        <slot
          name="header"
          :is-open="isMobileMenuOpen"
          :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)"
          :sidebar-visible="isSidebarVisible"
          :toggle-sidebar="toggleSidebar"
          :breadcrumb-items="breadcrumbData.items.value"
          :page-title="pageTitle" />
      </header>

      <main
        v-if="$slots.main"
        ref="layoutMainRef"
        class="flex-1 overflow-y-auto w-full relative h-full flex flex-col min-h-0 scrollbar-thin scrollbar-stable">
        <div
          v-if="props.renderNestedTabs && nestedTabsItems.length > 0"
          class="shrink-0 w-full border-b border-border/50">
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
          class="shrink-0 w-full px-6 py-2 border-b border-border/50"
          :class="props.breadcrumbClass">
          <Breadcrumb
            :items="breadcrumbData.items.value"
            :variant="props.breadcrumbVariant"
            :separator="props.breadcrumbSeparator"
            :size="props.breadcrumbSize" />
        </div>
        <div
          ref="mainScrollRef"
          style="will-change: transform; contain: layout style"
          class="flex-1 overflow-y-auto w-full relative h-full scrollbar-thin scrollbar-stable">
          <slot name="main" />
        </div>
      </main>
    </div>

    <!-- ── Mobile SidePanel ───────────────────────────────────────────────── -->
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
        <div class="flex-1 overflow-y-auto px-3.5 pt-4 scrollbar-thin scrollbar-stable">
          <slot />
        </div>
        <div class="mt-auto pt-2 border-t border-border px-3 py-2" v-if="$slots.right">
          <slot name="right" />
        </div>
      </div>
    </SidePanel>
  </div>
</template>
