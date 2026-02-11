<script setup lang="ts">
import { computed, onUnmounted, ref, watch, type Component } from 'vue'
import Button from './Button.vue'
import { useKeyStroke } from '../composables/useKeyStroke'
import type { SidePanelPosition, SidePanelSize } from '@/types'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  show?: boolean
  title?: string
  description?: string
  position?: SidePanelPosition
  size?: SidePanelSize
  closeOutside?: boolean
  hideCloseButton?: boolean
  class?: string
  overlayClass?: string
  triggerClass?: string
  backdrop?: boolean
  body?: Component
  bodyProps?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  position: 'right',
  size: 'md',
  closeOutside: true,
  hideCloseButton: false,
  backdrop: true,
  class: '',
  overlayClass: '',
  triggerClass: '',
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:show', value: boolean): void
  (e: 'onOpen'): void
  (e: 'onAfterOpen'): void
  (e: 'onAfterClose'): void
}>()

const visible = ref(props.show)

watch(
  () => props.show,
  (val) => {
    visible.value = val
    if (val) emit('onOpen')
  }
)

const handleOpen = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
  emit('update:show', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOutside) {
    close()
  }
}

// Escape key handling
const { onKeyStroke } = useKeyStroke()
onKeyStroke('Escape', close)

// Prevent body scroll when open
watch(visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Clean up on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})

const sizeClasses: Record<SidePanelSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
}

const positionClasses = computed(() => {
  return props.position === 'left' ? 'left-0' : 'right-0'
})

const transitionName = computed(() => {
  return props.position === 'left' ? 'slide-left' : 'slide-right'
})
</script>

<template>
  <span @click.stop="handleOpen" :class="`${triggerClass}`" v-bind="$attrs">
    <slot name="trigger">
      <template v-if="body">
        <slot />
      </template>
    </slot>
  </span>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 bg-[#00000033]"
        :class="[overlayClass, { 'backdrop-blur-[2px]': backdrop }]"
        @click="handleBackdropClick"></div>
    </Transition>

    <Transition
      :name="transitionName"
      @after-enter="$emit('onAfterOpen')"
      @after-leave="$emit('onAfterClose')">
      <div
        v-if="visible"
        class="sidepanel-body fixed inset-y-0 z-50 flex flex-col bg-body shadow-sm border transition-transform duration-300 ease-in-out w-full"
        :class="[sizeClasses[size], positionClasses, props.class]">
        <div
          v-if="title || $slots.header"
          class="flex-none flex items-center justify-between px-6 py-2 border-b border-border">
          <slot name="header">
            <div>
              <h3 class="text-lg font-bold text-foreground">
                {{ title }}
              </h3>
              <p v-if="description" class="mt-1 text-sm text-muted-foreground">
                {{ description }}
              </p>
            </div>
          </slot>
          <Button
            v-if="!hideCloseButton"
            rounded="full"
            size="sm"
            variant="ghost"
            icon="lucide:x"
            @click="close"
            class="-mr-2" />
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-4">
          <template v-if="body">
            <component :is="body" v-bind="{ ...bodyProps, ...$attrs }" :close="close" />
          </template>
          <template v-else>
            <slot :close="close" />
          </template>
        </div>

        <div v-if="$slots.footer" class="flex-none px-6 py-4 border-t border-border bg-muted-light">
          <slot name="footer" :close="close" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
