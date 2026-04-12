<script setup lang="ts">
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
    class="vlite-app-layout flex flex-row w-full h-full bg-muted/20 p-0 sm:p-2.5 gap-0 sm:gap-2.5 overflow-hidden">
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
          'shrink-0 h-full flex flex-col bg-background rounded-xl max-sm:rounded-none border border-border max-sm:border-0 shadow-sm overflow-hidden z-30',
          breakpointClasses.mobileTrigger === 'md:hidden' ? 'max-md:hidden' : '',
          props.class,
        ]"
        role="navigation"
        aria-label="Sidebar">
        <div class="flex items-center" v-if="$slots['sidebar-header']">
          <slot name="sidebar-header"></slot>
        </div>
        <div
          class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-stable"
          style="will-change: transform; contain: layout style"
          :class="props.contentClass">
          <slot name="sidebar" />
        </div>

        <div
          v-if="$slots['sidebar-footer']"
          class="shrink-0 bg-transparent"
          :class="props.rightClass">
          <slot name="sidebar-footer" />
        </div>
      </nav>
    </Transition>

    <div
      class="flex flex-col flex-1 min-w-0 h-full overflow-hidden bg-background rounded-xl max-sm:rounded-none border border-border max-sm:border-0 shadow-sm">
      <header
        v-if="$slots.header"
        class="w-full shrink-0 z-20 bg-background border-b border-border">
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
          class="shrink-0 w-full px-6 py-2 border-b border-border"
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
          class="flex-1 overflow-y-auto pt-2 w-full relative h-full scrollbar-thin scrollbar-stable">
          <slot name="main" />
        </div>
      </main>
    </div>

    <SidePanel
      v-model:show="isMobileMenuOpen"
      position="left"
      size="sm"
      :triggerClass="breakpointClasses.mobileTrigger"
      class="z-60"
      headerClass="pl-3! pr-4.5! py-3!"
      bodyClass="p-0!"
      :class="breakpointClasses.mobileTrigger">
      <template #header v-if="$slots['mobile-sidebar-header'] || $slots['sidebar-header']">
        <slot name="mobile-sidebar-header"><slot name="sidebar-header">Brand</slot></slot>
      </template>
      <div class="flex flex-col h-full">
        <div
          class="flex-1 overflow-y-auto px-3.5 pt-4 scrollbar-thin scrollbar-stable"
          style="will-change: transform; contain: layout style">
          <slot name="mobile-sidebar"><slot name="sidebar"></slot></slot>
        </div>
        <div class="mt-auto" v-if="$slots['mobile-sidebar-footer'] || $slots['sidebar-footer']">
          <slot name="mobile-sidebar-footer"><slot name="sidebar-footer" /></slot>
        </div>
      </div>
    </SidePanel>
  </div>
</template>
