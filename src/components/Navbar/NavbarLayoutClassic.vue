<script setup lang="ts">
import { inject, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Icon from '../Icon.vue'
import SidePanel from '../SidePanel.vue'
import NavbarTabs from './NavbarTabs.vue'
import { Breadcrumb } from '../Breadcrumb'
import { NAVBAR_LAYOUT_KEY } from './useNavbar'

const ctx = inject(NAVBAR_LAYOUT_KEY)!
const {
  props,
  sidebarHidden,
  isMobileMenuOpen,
  isSidebarVisible,
  toggleSidebar,
  pageTitle,
  breadcrumbData,
  breakpointClasses,
  containerClasses,
  centerClasses,
  nestedTabsItems,
  activeNestedTab,
  handleNestedTabClick,
  mainScrollRef,
  layoutMainRef,
} = ctx

// ── Dropdown-specific refs ────────────────────────────────────────────────────
const mobileMenuRef = ref<HTMLElement | null>(null)
const mobileTriggerRef = ref<HTMLElement | null>(null)

onClickOutside(
  mobileMenuRef,
  () => {
    isMobileMenuOpen.value = false
  },
  { ignore: [mobileTriggerRef] }
)
</script>

<template>
  <div class="vlite-app-layout flex flex-col w-full h-full bg-body overflow-hidden">
    <header v-if="$slots.header" class="w-full shrink-0 z-50 flex flex-col relative">
      <slot
        name="header"
        :is-open="isMobileMenuOpen"
        :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)"
        :sidebar-visible="isSidebarVisible"
        :toggle-sidebar="toggleSidebar"
        :breadcrumb-items="breadcrumbData.items.value"
        :page-title="pageTitle">
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
          :style="
            props.sidebarToggle ? 'transition: width 0.3s ease, opacity 0.3s ease;' : ''
          ">
          <template v-if="props.variant === 'header'">
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
                {
                  'ml-auto':
                    props.centerPosition === 'left' || props.centerPosition === 'center',
                },
                props.rightClass,
              ]">
              <slot name="right" />
            </div>
          </template>

          <template v-else>
            <div v-if="!$slots.header" :class="breakpointClasses.mobileHeader">
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
                class="flex-1 px-2.5 pt-0 pb-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-stable"
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

      <main
        v-if="$slots.main"
        ref="layoutMainRef"
        class="flex-1 overflow-y-auto w-full relative h-full flex flex-col scrollbar-thin scrollbar-stable">
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
        <div
          ref="mainScrollRef"
          style="will-change: transform; contain: layout style"
          class="flex-1 overflow-y-auto w-full relative h-full scrollbar-thin scrollbar-stable">
          <slot name="main" />
        </div>
      </main>

      <template v-if="props.mobileMenuVariant === 'dropdown'">
        <div
          v-if="isMobileMenuOpen"
          ref="mobileMenuRef"
          class="absolute top-[calc(100%_+_1px)] left-0 w-full bg-body border border-border/50 shadow-xl z-50 flex flex-col transition-all duration-300 origin-top overflow-hidden will-change-transform"
          :class="props.menuClass">
          <div
            class="flex flex-col max-h-[80vh] overflow-y-auto scrollbar-thin"
            style="will-change: transform; contain: layout style">
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
          <template v-if="props.variant === 'header'">
            <div class="flex flex-col space-y-1">
              <slot name="mobile-menu">
                <slot name="left" />
                <div class="h-px bg-border my-2"></div>
                <slot name="center" />
              </slot>
            </div>
          </template>
          <template v-else>
            <div
              class="flex flex-col space-y-4 flex-1 overflow-y-auto px-3.5! scrollbar-thin scrollbar-stable">
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
</template>
