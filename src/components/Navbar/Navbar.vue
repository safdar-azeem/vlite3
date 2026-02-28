<script setup lang="ts" name="Navbar">
import { computed, ref, onMounted, onUnmounted, useSlots, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoints, breakpointsTailwind, onClickOutside } from '@vueuse/core'
import Icon from '../Icon.vue'
import SidePanel from '../SidePanel.vue'
import Logo from '../Logo.vue' // Assuming Logo exists or using fallback
import type { NavbarProps } from '@/types/navbar.type'

const props = withDefaults(defineProps<NavbarProps>(), {
  variant: 'header',
  position: 'sticky',
  centerPosition: 'center',
  glass: false,
  border: true,
  floating: false,
  height: 'h-16',
  width: 'w-64',
  compact: false,
  class: '',
  mobileBreakpoint: 'md',
  logoClass: '',
  contentClass: '',
  menuClass: '',
  rightClass: '',
  mobileTriggerClass: '',
  mobileMenuVariant: 'sidepanel',
})

const emit = defineEmits<{
  (e: 'toggle-mobile'): void
}>()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const slots = useSlots()
const mobileMenuRef = ref<HTMLElement | null>(null)
const mobileTriggerRef = ref<HTMLElement | null>(null)

// If the user provides a header or main slot, we switch to Layout Mode
const isLayoutMode = computed(() => !!(slots.header || slots.main))

// Close on click outside
onClickOutside(
  mobileMenuRef,
  () => {
    isMobileMenuOpen.value = false
  },
  { ignore: [mobileTriggerRef] }
)

// Scroll detection for styling effects
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// CSS Classes Construction
const containerClasses = computed(() => {
  const isSidebar = props.variant === 'sidebar'

  // When inside a layout wrapper, the navbar becomes strictly a flex child sidebar.
  const positionClasses = {
    fixed: isLayoutMode.value ? 'relative z-40' : 'fixed top-0 left-0 z-40',
    sticky: isLayoutMode.value ? 'relative z-40' : 'sticky top-0 z-40',
    relative: 'relative z-10',
    absolute: isLayoutMode.value ? 'relative z-40' : 'absolute top-0 left-0 w-full z-40',
  }

  const base = 'bg-body'

  // Effects
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

  // Layout
  let layout = ''
  if (isSidebar) {
    layout = breakpointClasses.value.sidebarLayout
  } else {
    layout = `flex items-center gap-4 w-full px-4 sm:px-6 lg:px-8 ${props.height}`
  }

  return [base, positionClasses[props.position], ...effects, layout, props.class].join(' ')
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
    sm: `flex flex-col max-sm:w-full ${props.compact ? 'w-20' : props.width} h-auto sm:h-full sm:max-h-screen`,
    md: `flex flex-col max-md:w-full ${props.compact ? 'w-20' : props.width} h-auto md:h-full md:max-h-screen`,
    lg: `flex flex-col max-lg:w-full ${props.compact ? 'w-20' : props.width} h-auto lg:h-full lg:max-h-screen`,
    xl: `flex flex-col max-xl:w-full ${props.compact ? 'w-20' : props.width} h-auto xl:h-full xl:max-h-screen`,
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

  return {
    mobileTrigger: mobileTriggerClasses[bp],
    desktopContent: desktopContentClasses[bp],
    sidebarLayout: sidebarLayoutClasses[bp],
    mobileHeader: mobileHeaderClasses[bp],
    desktopSidebar: desktopSidebarClasses[bp],
  }
})

const centerClasses = computed(() => {
  if (props.variant === 'sidebar') return 'flex-1 py-4 overflow-y-auto'

  switch (props.centerPosition) {
    case 'left':
      return 'flex items-center justify-start'
    case 'right':
      return 'flex items-center justify-end ml-auto'
    case 'center':
    default:
      return `${breakpointClasses.value.desktopContent} items-center justify-center mx-auto`
  }
})

provide('navbar-context', {
  compact: computed(() => props.compact),
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
</script>

<template>
  <div v-if="isLayoutMode" class="vlite-app-layout flex flex-col w-full h-full bg-body overflow-hidden">
    <header v-if="$slots.header" class="w-full shrink-0 z-50 flex flex-col relative">
      <slot
        name="header"
        :is-open="isMobileMenuOpen"
        :toggle="() => (isMobileMenuOpen = !isMobileMenuOpen)">
      </slot>
    </header>

    <div class="flex flex-1 w-full overflow-hidden relative">
      <nav :class="containerClasses" role="navigation">
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

          <div
            :class="[
              centerClasses,
              'max-w-full',
              props.contentClass,
            ]"
            v-if="$slots?.center">
            <slot name="center" />
          </div>

          <div
            class="flex items-center gap-2 shrink-0 max-w-[40%] z-10"
            :class="[
              {
                'ml-auto': centerPosition === 'left' || centerPosition === 'center',
              },
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

      <main v-if="$slots.main" class="flex-1 overflow-y-auto w-full relative h-full">
        <slot name="main" />
      </main>
    </div>
  </div>

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

      <div
        :class="[
          centerClasses,
          'max-w-full',
          props.contentClass,
        ]"
        v-if="$slots?.center">
        <slot name="center" />
      </div>

      <div
        class="flex items-center gap-2 shrink-0 max-w-[40%] z-10"
        :class="[
          {
            'ml-auto': centerPosition === 'left' || centerPosition === 'center',
          },
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
