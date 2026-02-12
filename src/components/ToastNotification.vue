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

const getNotificationsByPosition = (pos: ToastPosition) => {
  const filtered = notifications.value.filter((n) => n.position === pos)
  return filtered.slice().reverse()
}

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-0 left-0 py-4',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 py-4',
  'top-right': 'top-0 right-0 py-4',
  'bottom-left': 'bottom-2.5 left-0',
  'bottom-center': 'bottom-2.5 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-2.5 right-0',
}

import { type StyleValue } from 'vue'

const getToastStyle = (index: number, total: number, pos: ToastPosition): StyleValue => {
  const isBottom = pos.includes('bottom')
  const hovering = isExpanded.value || globalConfig.value.expand

  const isVisible = index < VISIBLE_TOASTS

  if (!isVisible && !hovering) {
    return {
      opacity: 0,
      pointerEvents: 'none',
      transform: isBottom ? 'translateY(20px) scale(0.95)' : 'translateY(-20px) scale(0.95)',
      zIndex: -1,
    }
  }

  if (hovering) {
    const yDir = isBottom ? -1 : 1
    return {
      transform: `translate3d(0, ${index * (yDir * (100 + GAP))}%, 0) scale(1)`,
      opacity: 1,
      zIndex: total - index,
    }
  }

  const scale = 1 - index * 0.05
  const yDir = isBottom ? -1 : 1
  const yOffset = index * GAP * yDir

  return {
    transform: `translate3d(0, ${yOffset}px, -${index}px) scale(${scale})`,
    opacity: 1,
    zIndex: total - index,
  }
}

const getTransitionStyles = (pos: ToastPosition, index: number) => {
  if (index !== 0) return {}
  const isBottom = pos.includes('bottom')
  return {
    '--entrance-offset': isBottom ? '25px' : '-25px',
    '--entrance-opacity': '0.6',
  }
}

const handleActionClick = (notification: Notification) => {
  if (notification.action) {
    notification.action.onClick()
    removeToast(notification.id)
  }
}

const icons = {
  error: 'lucide:octagon-x',
  success: 'lucide:circle-check',
  info: 'lucide:info',
  warning: 'lucide:triangle-alert',
  default: 'lucide:bell',
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 border-border text-foreground shadow-lg',
  success: 'bg-success text-success-fg border-success-fg/30 dark:border-success-fg/10 shadow-lg',
  error: 'bg-danger text-danger-fg border-danger-fg/30 dark:border-danger-fg/10 shadow-lg',
  warning: 'bg-warning-light text-warning-fg border-warning-fg/30 shadow-lg',
  info: 'bg-gray-100 text-gray-900 border/50 shadow-lg',
}

const getVariantClass = (type: string) => {
  return variantClasses[type] || variantClasses.default
}

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
  }, 400)
}

const getTransformOrigin = (pos: ToastPosition) => {
  const y = pos.includes('bottom') ? 'bottom' : 'top'
  const x = pos.includes('right') ? 'right' : pos.includes('left') ? 'left' : 'center'
  return `${y} ${x}`
}
</script>

<template>
  <div
    class="toast-provider pointer-events-none fixed inset-0 z-[9999999999] overflow-hidden"
    aria-live="polite">
    <Teleport to="body">
      <template v-for="pos in positions" :key="pos">
        <div
          class="fixed z-[9999999999]! px-4 flex flex-col gap-2 transition-all duration-300 max-w-full sm:max-w-120"
          :class="[
            positionClasses[pos],
            pos.includes('center')
              ? 'items-center'
              : pos.includes('right')
                ? 'items-end'
                : 'items-start',
          ]"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave">
          <div
            class="relative w-full transition-all pointer-events-auto"
            :class="[{ 'flex-col-reverse': pos.includes('top') }]">
            <TransitionGroup
              :name="getNotificationsByPosition(pos).length <= 1 ? 'first-toast' : 'stack-toast'"
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
                class="toast-item col-start-1 h-max row-start-1 mb-1 w-auto border pl-4 pr-6 py-3 flex gap-2.5 items-start transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform"
                :class="[
                  getVariantClass(notification.type),
                  notification.description || notification.action ? 'rounded-xl' : 'rounded-full',
                ]"
                :style="[
                  getToastStyle(index, getNotificationsByPosition(pos).length, pos),
                  getTransitionStyles(pos, index),
                  {
                    '--hover-offset': pos.includes('bottom') ? '-5px' : '5px',
                    'transform-origin': getTransformOrigin(pos),
                  },
                ]">
                <Icon
                  :icon="icons[notification.type] || icons.default"
                  class="w-5 h-5 shrink-0 mt-0.5" />

                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium leading-tight mt-0.5">
                    {{ notification.message }}
                  </p>
                  <p
                    v-if="notification.description"
                    class="text-sm mt-1 leading-relaxed opacity-90">
                    {{ notification.description }}
                  </p>
                </div>

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
    </Teleport>
  </div>
</template>

<style scoped>
.first-toast-enter-active {
  animation: first-toast-in 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.first-toast-leave-active {
  transition: all 0.25s ease-in;
}

.first-toast-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@keyframes first-toast-in {
  0% {
    opacity: var(--entrance-opacity, 0.6);
    transform: translateY(var(--entrance-offset, 25px)) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stack-toast-enter-active,
.stack-toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.stack-toast-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.stack-toast-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.stack-toast-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
