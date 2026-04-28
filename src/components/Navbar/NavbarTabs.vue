<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Icon from '../Icon.vue'
import type { NavbarTabItem } from '@/types/navbar.type'
import { $t } from '@/utils/i18n'

export type NavbarTabsVariant = 'line' | 'pill' | 'solid' | 'ghost'
export type NavbarTabsSize = 'sm' | 'md' | 'lg'

interface Props {
  items: NavbarTabItem[]
  variant?: NavbarTabsVariant
  size?: NavbarTabsSize
  activeClass?: string
  inactiveClass?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  activeClass: '',
  inactiveClass: '',
  class: '',
})

const scrollRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const updateScrollState = () => {
  const el = scrollRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 2
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2
}

const scrollBy = (direction: 'left' | 'right') => {
  const el = scrollRef.value
  if (!el) return
  const amount = el.clientWidth * 0.6
  el.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(() => {
    updateScrollState()
    scrollRef.value?.addEventListener('scroll', updateScrollState, { passive: true })
  })
})

onUnmounted(() => {
  // PERFORMANCE: memory leak prevention
  scrollRef.value?.removeEventListener('scroll', updateScrollState)
})

const route = useRoute()

watch(
  () => route.path,
  () => nextTick(updateScrollState)
)

const itemRefs = ref<Map<number, HTMLElement>>(new Map())

const setItemRef = (el: any, index: number) => {
  const element = el?.$el ?? el
  if (element instanceof HTMLElement) {
    itemRefs.value.set(index, element)
  } else {
    itemRefs.value.delete(index)
  }
}

watch(
  () => route.path,
  (path) => {
    nextTick(() => {
      const activeIndex = props.items.findIndex((item) => isActive(item))
      if (activeIndex === -1) return
      const el = itemRefs.value.get(activeIndex)
      el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    })
  },
  { immediate: true }
)

const containerVariantClasses: Record<NavbarTabsVariant, string> = {
  line: 'flex border-b border-border gap-0',
  pill: 'flex gap-1 p-1 bg-secondary/80 rounded-lg',
  solid: 'flex gap-0',
  ghost: 'flex gap-1',
}

const sizeClasses: Record<NavbarTabsSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const variantItemActive: Record<NavbarTabsVariant, string> = {
  line: 'text-primary border-b-2 border-primary -mb-px',
  pill: 'bg-background text-foreground shadow-sm',
  solid: 'bg-primary-light text-primary-dark',
  ghost: 'bg-accent text-accent-foreground',
}

const variantItemInactive: Record<NavbarTabsVariant, string> = {
  line: 'text-muted-foreground border-b-2 border-transparent hover:text-foreground hover:border-border',
  pill: 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
  solid: 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
}

const isActive = (item: NavbarTabItem): boolean => {
  const current = route.path
  if (!item.to) return false
  const target = typeof item.to === 'string' ? item.to : item.to.path

  if (!target) return false

  if (item.exact || target === '/') {
    return current === target
  }

  if (current === target) return true

  // startsWith with a boundary check so /button does not match /buttongroup
  if (current.startsWith(target)) {
    const next = current[target.length]
    return next === '/' || next === '?' || next === '#' || next === undefined
  }

  return false
}

const getItemClasses = (item: NavbarTabItem): string => {
  const base =
    'group relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0 select-none cursor-pointer outline-none   focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1'

  const disabled = item.disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''

  const active = isActive(item)
  const stateClass = active
    ? props.activeClass || variantItemActive[props.variant]
    : props.inactiveClass || variantItemInactive[props.variant]

  return [base, sizeClasses[props.size], stateClass, disabled].filter(Boolean).join(' ')
}
</script>

<template>
  <div :class="['relative flex items-center w-full min-w-0 border-b', props.class]">
    <Transition name="fade-x">
      <div
        v-if="canScrollLeft"
        class="absolute left-0 top-0 bottom-0 z-10 flex items-center pointer-events-none">
        <div class="w-8 h-full bg-gradient-to-r from-background to-transparent" />
        <button
          type="button"
          class="pointer-events-auto absolute left-0 bg-body h-full px-1 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll tabs left"
          tabindex="-1"
          @click="scrollBy('left')">
          <Icon icon="lucide:chevron-left" class="w-4 h-4" />
        </button>
      </div>
    </Transition>

    <nav
      ref="scrollRef"
      role="tablist"
      :class="[
        'flex-1 overflow-x-auto scroll-smooth navbar-tabs-no-scrollbar',
        containerVariantClasses[variant],
      ]"
      style="will-change: transform; contain: layout style"
      aria-label="Page tabs">
      <RouterLink
        v-for="(item, index) in items"
        :key="index"
        v-memo="[item, isActive(item), item.disabled]"
        :ref="(el) => setItemRef(el, index)"
        :to="item.to || ''"
        role="tab"
        :aria-selected="isActive(item)"
        :aria-disabled="item.disabled || undefined"
        :tabindex="item.disabled ? -1 : 0"
        :class="getItemClasses(item)"
        @click.prevent="!item.disabled && item.to && $router.push(item.to)">
        <Icon
          v-if="item.icon"
          :icon="item.icon"
          class="shrink-0"
          :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
        <span class="truncate">{{ item.labelI18n ? $t(item.labelI18n) : item.label }}</span>
        <Icon
          v-if="item.iconRight"
          :icon="item.iconRight"
          class="shrink-0 opacity-70"
          :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
      </RouterLink>
    </nav>

    <Transition name="fade-x">
      <div
        v-if="canScrollRight"
        class="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pointer-events-none">
        <div class="w-8 h-full bg-gradient-to-l from-background to-transparent" />
        <button
          type="button"
          class="pointer-events-auto absolute right-0 h-full px-1 flex items-center text-muted-foreground hover:text-foreground transition-colors bg-body"
          aria-label="Scroll tabs right"
          tabindex="-1"
          @click="scrollBy('right')">
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style>
.fade-x-enter-active,
.fade-x-leave-active {
  transition: opacity 0.15s ease;
}
.fade-x-enter-from,
.fade-x-leave-to {
  opacity: 0;
}
</style>
