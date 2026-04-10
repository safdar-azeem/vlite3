<script setup lang="ts">
import { inject, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Icon from '../Icon.vue'
import SidePanel from '../SidePanel.vue'
import { NAVBAR_LAYOUT_KEY } from './useNavbar'

const ctx = inject(NAVBAR_LAYOUT_KEY)!
const {
  props,
  isMobileMenuOpen,
  isScrolled,
  breakpointClasses,
  containerClasses,
  centerClasses,
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
  <nav :class="containerClasses" role="navigation">
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
      <div :class="breakpointClasses.mobileHeader">
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
  </nav>
</template>
