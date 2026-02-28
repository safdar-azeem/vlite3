<script setup lang="ts">
import { computed, onUnmounted, ref, watch, type Component } from 'vue'
import Button from './Button.vue'
import { useKeyStroke } from '../composables/useKeyStroke'
import type { SidePanelPosition, SidePanelSize } from '@/types'
import { $t } from '@/utils/i18n'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  show?: boolean
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  position?: SidePanelPosition
  size?: SidePanelSize
  closeOutside?: boolean
  hideCloseButton?: boolean
  class?: string
  overlayClass?: string
  bodyClass?: string
  headerClass?: string
  triggerClass?: string
  footerClass?: string
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
  footerClass: '',
  bodyClass: '',
  headerClass: '',
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

const { onKeyStroke } = useKeyStroke()
onKeyStroke('Escape', close)

watch(visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

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

const displayTitle = computed(() => (props.titleI18n ? $t(props.titleI18n) : props.title))
const displayDescription = computed(() =>
  props.descriptionI18n ? $t(props.descriptionI18n) : props.description
)
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
          v-if="displayTitle || $slots.header"
          :class="headerClass"
          class="flex-none flex items-center justify-between px-6 py-2 border-b border-border">
          <slot name="header">
            <div>
              <h3 class="text-lg font-bold text-foreground">
                {{ displayTitle }}
              </h3>
              <p v-if="displayDescription" class="mt-1 text-sm text-muted-foreground">
                {{ displayDescription }}
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

        <div class="flex-1 overflow-y-auto px-6 py-4" :class="bodyClass">
          <template v-if="body">
            <component :is="body" v-bind="{ ...bodyProps, ...$attrs }" :close="close" />
          </template>
          <template v-else>
            <slot :close="close" />
          </template>
        </div>

        <div
          v-if="$slots.footer"
          class="flex-none px-6 py-3 border-t border-border"
          :class="footerClass">
          <slot name="footer" :close="close" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
