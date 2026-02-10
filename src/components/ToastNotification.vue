<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from './Icon.vue'
import {
  useNotifications,
  type ToastPosition,
  type Notification,
} from '@/composables/useNotifications'
import Button from './Button.vue'

const props = defineProps<{
  position?: ToastPosition
  expand?: boolean
}>()

const { notifications, removeToast, globalConfig, pauseTimers, resumeTimers } = useNotifications()

// Configuration
const VISIBLE_TOASTS = 3
const TOAST_HEIGHT = 60 // Estimate or dynamic
const OFFSET = 16
const GAP = 14

const isExpanded = ref(false)

const positions: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

// Get notifications for a specific position, consistent sort (Newest at the END of array usually in useNotifications,
// but for stacking we often want to process from Newest -> Oldest)
const getNotificationsByPosition = (pos: ToastPosition) => {
  // Filter by position
  const filtered = notifications.value.filter((n) => n.position === pos)
  // Reverse so index 0 is the newest (Top of stack)
  return filtered.slice().reverse()
}

// Styling & Positioning Logic
const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-0 left-0  py-4',
  'top-center': 'top-0 left-1/2 -translate-x-1/2  py-4',
  'top-right': 'top-0 right-0  py-4',
  'bottom-left': 'bottom-2.5 left-0',
  'bottom-center': 'bottom-2.5 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-2.5 right-0',
}

import { type StyleValue } from 'vue'

const getToastStyle = (index: number, total: number, pos: ToastPosition): StyleValue => {
  const isBottom = pos.includes('bottom')
  const hovering = isExpanded.value || globalConfig.value.expand // Global expand or local hover

  // We only show top N visually, others are hidden or stacked
  const isVisible = index < VISIBLE_TOASTS

  // If not visible and not expanding, hide
  if (!isVisible && !hovering) {
    return {
      opacity: 0,
      pointerEvents: 'none',
      transform: isBottom ? 'translateY(20px) scale(0.9)' : 'translateY(-20px) scale(0.9)',
      zIndex: -1,
    }
  }

  // Expanded State
  if (hovering) {
    const yDir = isBottom ? -1 : 1
    return {
      transform: `translate3d(0, ${index * (yDir * (100 + GAP))}%, 0) scale(1)`,
      opacity: 1,
      zIndex: total - index,
    }
  }

  // Stacked State
  const scale = 1 - index * 0.05
  const yDir = isBottom ? -1 : 1
  const yOffset = index * GAP * yDir

  return {
    transform: `translate3d(0, ${yOffset}px, -${index}px) scale(${scale})`,
    opacity: 1,
    zIndex: total - index,
  }
}

// Handler
const handleActionClick = (notification: Notification) => {
  if (notification.action) {
    notification.action.onClick()
    removeToast(notification.id)
  }
}

// Visuals
const icons = {
  error: 'lucide:octagon-x',
  success: 'lucide:circle-check',
  info: 'lucide:info',
  warning: 'lucide:triangle-alert',
  default: 'lucide:bell',
}

// Color mapping for toast variants
const variantClasses: Record<string, string> = {
  // Default/Primary
  default: 'bg-white border-border text-foreground', // Fallback to standard

  // Theme Variants (matching Alert.vue style)
  success: 'bg-success text-success-fg border-success-fg/30 dark:border-success-fg/10',
  error: 'bg-danger text-danger-fg border-danger-fg/30 dark:border-danger-fg/10',
  warning: 'bg-warning-light text-warning-fg border-warning-fg/30',
  info: 'bg-white text-gray-900 border/50',
}

const getVariantClass = (type: string) => {
  return variantClasses[type] || variantClasses.default
}

// Interaction Handlers with Debounce
let hoverTimeout: ReturnType<typeof setTimeout> | null = null

const handleMouseEnter = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  isExpanded.value = true
  pauseTimers()
}

const handleMouseLeave = () => {
  hoverTimeout = setTimeout(() => {
    isExpanded.value = false
    resumeTimers()
  }, 400) // 400ms delay to allow crossing gaps
}

const getTransformOrigin = (pos: ToastPosition) => {
  if (pos.includes('center')) return 'bottom center' // or top center depending on side?
  // Actually, simple logic:
  const y = pos.includes('bottom') ? 'bottom' : 'top'
  const x = pos.includes('right') ? 'right' : pos.includes('left') ? 'left' : 'center'
  return `${y} ${x}`
}
</script>

<template>
  <div
    class="toast-provider pointer-events-none fixed inset-0 z-9999 overflow-hidden"
    aria-live="polite">
    <template v-for="pos in positions" :key="pos">
      <!-- Position Container -->
      <div
        class="fixed px-4 flex flex-col gap-2 transition-all duration-300 max-w-full sm:max-w-120"
        :class="[
          positionClasses[pos],
          // Align outer container
          pos.includes('center')
            ? 'items-center'
            : pos.includes('right')
              ? 'items-end'
              : 'items-start',
        ]"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- The List Group -->
        <div
          class="relative w-full transition-all pointer-events-auto"
          :class="[
            { 'flex-col-reverse': pos.includes('top') },
            // We use grid, so flex-col-reverse on wrapper doesn't matter for stack order,
            // but logic is handled by z-index and transform in getToastStyle.
          ]">
          <TransitionGroup
            enter-active-class="transition-all duration-300 ease-out-spring"
            leave-active-class="transition-all ease-in"
            enter-from-class="opacity-0 scale-90 translate-y-2"
            leave-to-class="opacity-0 translate-y-2"
            move-class="transition-all ease-spring"
            tag="div"
            class="w-full grid grid-cols-1 grid-rows-1"
            :class="[
              pos.includes('center')
                ? 'justify-items-center'
                : pos.includes('right')
                  ? 'justify-items-end'
                  : 'justify-items-start',
            ]"
            style="min-height: 20px">
            <div
              v-for="(notification, index) in getNotificationsByPosition(pos)"
              :key="notification.id"
              :data-index="index"
              :data-pos="pos"
              class="col-start-1 h-max row-start-1 mb-1 w-auto border pl-4 pr-6 py-3 flex gap-2.5 items-start transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform object-cover"
              :class="[
                getVariantClass(notification.type),
                notification.description || notification.action ? 'rounded-xl' : 'rounded-full',
              ]"
              :style="[
                getToastStyle(index, getNotificationsByPosition(pos).length, pos),
                {
                  '--hover-offset': pos.includes('bottom') ? '-5px' : '5px',
                  'transform-origin': getTransformOrigin(pos),
                },
              ]">
              <!-- Icon -->
              <Icon
                :icon="icons[notification.type] || icons.default"
                class="w-5 h-5 shrink-0 mt-0.5" />

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium leading-tight mt-0.5">
                  {{ notification.message }}
                </p>
                <p v-if="notification.description" class="text-sm mt-1 leading-relaxed opacity-90">
                  {{ notification.description }}
                </p>
              </div>

              <!-- Action / Close -->
              <Button
                v-if="notification.action"
                type="button"
                size="xs"
                variant="outline"
                class="ml-2 shrink-0 h-8 px-3 text-xs bg-transparent border-current/20 hover:bg-black/5 dark:hover:bg-white/10"
                @click="handleActionClick(notification)">
                {{ notification.action.label }}
              </Button>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Spring Easing for that 'Sonner' feel */
.ease-out-spring {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.ease-spring {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
