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
  position: 'sticky', // default to sticky for modern feels
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

  const positionClasses = {
    fixed: 'fixed top-0 left-0 z-40',
    sticky: 'sticky top-0 z-40',
    relative: 'relative z-10',
    absolute: 'absolute top-0 left-0 w-full z-40',
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
    // Sidebar logic: Use dynamic breakpoint classes
    // Sidebar: Mobile (auto height, full width) -> Desktop (fixed width based on prop, full height constrained to viewport)
    // We use max-h-screen to ensure that if the sidebar is sticky/fixed, it never exceeds the viewport height,
    // allowing internal scrolling to work correctly regardless of the main content height.
    layout = breakpointClasses.value.sidebarLayout
  } else {
    // Header Navbar
    // Flexbox with standard gap. Alignment is handled by child margins.
    layout = `flex items-center gap-4 w-full px-4 sm:px-6 lg:px-8 ${props.height}`
  }

  return [base, positionClasses[props.position], ...effects, layout, props.class].join(' ')
})

const breakpointClasses = computed(() => {
  const bp = props.mobileBreakpoint || 'md'

  // We use static lookups so Tailwind scanner picks up the full class names.
  // Dynamic string interpolation (e.g. `${bp}:hidden`) is NOT detected by Tailwind.

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

  // Header logic
  switch (props.centerPosition) {
    case 'left':
      // Sits next to Left section. No special margin needed other than global gap.
      return 'flex items-center justify-start'
    case 'right':
      // Pushed to the right (ml-auto), sitting next to Right section.
      return 'flex items-center justify-end ml-auto'
    case 'center':
    default:
      // Tried to center in available space. mx-auto in a flex container pushes against siblings.
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
  <nav :class="containerClasses" role="navigation">
    <!-- HEADER LAYOUT -->
    <template v-if="variant === 'header'">
      <!-- Left Section -->
      <div class="flex items-center gap-4 shrink-0 z-10">
        <!-- Mobile Toggle -->
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

        <!-- Logo Slot -->
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

        <!-- Left Slot Content -->
        <div
          v-if="$slots?.left"
          class="items-center gap-1 overflow-x-auto no-scrollbar mask-gradient"
          :class="breakpointClasses.desktopContent">
          <slot name="left" />
        </div>
      </div>

      <!-- Center Section -->
      <div
        :class="[
          centerClasses,
          // Width constraint to ensure it doesn't crush others, but allows simple resizing
          'max-w-full',
          props.contentClass,
        ]"
        v-if="$slots?.center">
        <slot name="center" />
      </div>

      <!-- Right Section -->
      <!-- 
                ml-auto ensures this section is ALWAYS pushed to the end.
                Even if centerPosition is 'right', the Center section has ml-auto, so they will stack at the end.
                This logic relies on Flexbox behavior: multiple auto-margins split the available space.
                
                Scenario 1: Center='left'. Left -> Center -> (space) -> Right (ml-auto). Correct.
                Scenario 2: Center='center'. Left -> (space/2) -> Center (mx-auto) -> (space/2) -> Right. Correct-ish (Right might need its own push if Center isn't perfect).
                            Actually if Center is mx-auto, it consumes equal space on both sides. Right naturally sits at end? 
                            No, if Center is mx-auto, it tries to centers itself between Left and Right.
                            BUT to guarantee Right is at EDGE:
                            If we put ml-auto on Right, it consumes all right-side space.
                            If Center ALSO has mx-auto (ml-auto + mr-auto), space is shared.
                            
                            To strictly enforce Right at End:
                            We should rely on `ml-auto` on the Right section primarily. 
                            AND modify Center logic:
                             - If Right has `ml-auto`, it pins to right.
                             - If Center is 'center', it should assume `mx-auto`.
                             - If Center is 'right', it also needs `ml-auto` but `mr-4` (gap).
                             
                             Let's keep it simple: Right always gets `ml-0` by default, but if layout gap handles it...
                             Wait, `justify-between` on parent was safer for 'center'.
                             Let's try:
                             Left (natural)
                             Center (flex-1 flex justify-center, IF center='center') -> This centers it in remaining space.
                             Right (shrink-0)
            -->
      <div
        class="flex items-center gap-2 shrink-0 max-w-[40%] z-10"
        :class="[
          {
            // Always push to end unless Center is pushing it.
            // If Center is 'center' (mx-auto) or 'right' (ml-auto), this naturally falls to end.
            // If Center is 'left', we MUST have ml-auto here.
            'ml-auto': centerPosition === 'left' || centerPosition === 'center',
            // If center is 'right', Center has ml-auto. Right just sits next to it.
            // But if we add ml-auto here too, they might split space? No, flexbox parses strictly.
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
              <!-- Fallback to using left+center content if no mobile-specific menu provided -->
              <slot name="left" />
              <div class="h-px bg-border my-2"></div>
              <slot name="center" />
            </slot>
          </div>
        </template>

        <!-- Sidebar Variant Menu (Just replicate sidebar content) -->
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
