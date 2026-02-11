<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, useSlots, provide } from 'vue'
import Icon from '../Icon.vue'
import NavbarItem from './NavbarItem.vue'
import Button from '../Button.vue'
import SidePanel from '../SidePanel.vue'
import Logo from '../Logo.vue' // Assuming Logo exists or using fallback
import type { NavbarProps } from '@/types/navbar.type'

const props = withDefaults(defineProps<NavbarProps>(), {
  variant: 'header',
  position: 'sticky', // default to sticky for modern feels
  centerPosition: 'center',
  glass: true,
  border: true,
  floating: false,
  height: 'h-16',
  width: 'w-64',
  compact: false,
  class: '',
})

const emit = defineEmits<{
  (e: 'toggle-mobile'): void
}>()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const slots = useSlots()

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

  const base = 'transition-all duration-300 ease-in-out bg-body'

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
    props.floating ? 'm-4 rounded-xl shadow-lg border border-border/50' : '',
    isScrolled.value && !props.floating && !isSidebar && props.position === 'sticky'
      ? 'shadow-sm'
      : '',
  ]

  // Layout
  let layout = ''
  if (isSidebar) {
    // Sidebar logic: Use compact width if compact mode is on
    const sidebarWidth = props.compact ? 'w-20' : props.width
    // Sidebar: Mobile (auto height, full width) -> Desktop (fixed width based on prop, full height constrained to viewport)
    // We use md:max-h-screen to ensure that if the sidebar is sticky/fixed, it never exceeds the viewport height,
    // allowing internal scrolling to work correctly regardless of the main content height.
    layout = `flex flex-col max-md:w-full ${sidebarWidth} h-auto md:h-full md:max-h-screen`
  } else {
    // Header Navbar
    // Flexbox with standard gap. Alignment is handled by child margins.
    layout = `flex items-center gap-4 w-full px-4 sm:px-6 lg:px-8 ${props.height}`
  }

  return [base, positionClasses[props.position], ...effects, layout, props.class].join(' ')
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
      return 'hidden md:flex items-center justify-center mx-auto'
  }
})

provide('navbar-context', {
  compact: computed(() => props.compact),
})
</script>

<template>
  <nav :class="containerClasses" role="navigation">
    <!-- HEADER LAYOUT -->
    <template v-if="variant === 'header'">
      <!-- Left Section -->
      <div class="flex items-center gap-4 shrink-0 z-10">
        <!-- Mobile Toggle -->
        <slot name="mobile-trigger">
          <button
            type="button"
            class="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-md shrink-0"
            @click="isMobileMenuOpen = true">
            <Icon icon="lucide:menu" class="w-5 h-5" />
            <span class="sr-only">Open Menu</span>
          </button>
        </slot>

        <!-- Logo Slot -->
        <div class="shrink-0">
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
        <div class="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient">
          <slot name="left" />
        </div>
      </div>

      <!-- Center Section -->
      <div
        :class="[
          centerClasses,
          // Width constraint to ensure it doesn't crush others, but allows simple resizing
          'max-w-full',
        ]">
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
        :class="{
          // Always push to end unless Center is pushing it.
          // If Center is 'center' (mx-auto) or 'right' (ml-auto), this naturally falls to end.
          // If Center is 'left', we MUST have ml-auto here.
          'ml-auto': centerPosition === 'left' || centerPosition === 'center',
          // If center is 'right', Center has ml-auto. Right just sits next to it.
          // But if we add ml-auto here too, they might split space? No, flexbox parses strictly.
        }">
        <slot name="right" />
      </div>
    </template>

    <!-- SIDEBAR LAYOUT -->
    <template v-else>
      <!-- MOBILE HEADER (Visible only on small screens) -->
      <div class="md:hidden flex items-center justify-between px-4 py-3 shrink-0 bg-background">
        <!-- Logo -->
        <slot name="logo">
          <div class="font-bold text-xl truncate">Brand</div>
        </slot>

        <!-- Mobile Toggle -->
        <button
          type="button"
          class="p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-md"
          @click="isMobileMenuOpen = true">
          <Icon icon="lucide:menu" class="w-5 h-5" />
          <span class="sr-only">Open Menu</span>
        </button>
      </div>

      <!-- DESKTOP SIDEBAR CONTENT -->
      <div class="hidden md:flex flex-col h-full w-full overflow-hidden">
        <!-- Sidebar Header -->
        <div class="h-16 flex items-center px-6 shrink-0 z-10">
          <slot name="logo">
            <div class="font-bold text-xl truncate">Brand</div>
          </slot>
        </div>

        <!-- Sidebar Body -->
        <div class="flex-1 px-4 py-4 overflow-y-auto space-y-4 scrollbar-thin">
          <slot name="left" />
          <slot />
          <slot name="center" />
        </div>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-border shrink-0 bg-background mt-auto">
          <slot name="right" />
        </div>
      </div>
    </template>

    <!-- MOBILE DRAWER (reusing SidePanel) -->
    <SidePanel
      v-model:show="isMobileMenuOpen"
      position="left"
      size="sm"
      triggerClass="sm:hidden"
      class="z-60 sm:hidden">
      <template #header>
        <slot name="logo">Brand</slot>
      </template>

      <div class="flex flex-col space-y-6 pt-4 h-full">
        <!-- Header Variant Menu -->
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
          <div class="flex flex-col space-y-4 flex-1 overflow-y-auto">
            <slot name="left" />
            <slot />
            <slot name="center" />
          </div>
        </template>

        <div class="mt-auto pt-4 border-t border-border">
          <slot name="right" />
        </div>
      </div>
    </SidePanel>
  </nav>
</template>
