<script setup lang="ts">
import { computed, onUnmounted, ref, watch, type Component, inject, onMounted, markRaw } from 'vue'
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
let toggleTimeout: ReturnType<typeof setTimeout> | null = null

const dropdownContext = inject('dropdown-context', null) as {
  close: () => void
  onChildToggle?: (isOpen: boolean) => void
} | null

// markRaw prevents Vue from wrapping the component definition in a deep
// reactive Proxy. Without this, every reactive update in the panel body
// (e.g. a form field change) causes Vue to re-traverse the component
// definition object — wasted work on every interaction.
const rawBody = computed(() => (props.body ? markRaw(props.body) : undefined))

watch(
  () => props.show,
  (val) => {
    visible.value = val
    if (val) {
      emit('onOpen')
      dropdownContext?.close()
    }
  }
)

const handleOpen = () => {
  visible.value = true
  dropdownContext?.close()
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
  if (toggleTimeout) clearTimeout(toggleTimeout)

  if (val) {
    dropdownContext?.onChildToggle?.(true)
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    // Performance fix: Wait for the 300ms side panel transition to
    // finish before allowing parent dropdowns to unmount from DOM.
    toggleTimeout = setTimeout(() => {
      dropdownContext?.onChildToggle?.(false)
    }, 300)
  }
})

onMounted(() => {
  if (visible.value) dropdownContext?.onChildToggle?.(true)
})

onUnmounted(() => {
  if (toggleTimeout) clearTimeout(toggleTimeout)
  if (visible.value) dropdownContext?.onChildToggle?.(false)
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
  return props.position === 'left' ? 'left-0 rounded-r-lg' : 'right-0 rounded-l-md'
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
  <span
    @click.stop="handleOpen"
    :class="`${triggerClass}`"
    v-bind="$attrs"
    :data-testid="
      $attrs['data-testid']
        ? `${$attrs['data-testid']}-trigger`
        : displayTitle
          ? `sidepanel-trigger-${displayTitle
              .toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')}`
          : 'sidepanel-trigger'
    ">
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
        class="fixed inset-0 z-50 v-sidepanel-overlay"
        :class="overlayClass"
        @click="handleBackdropClick"></div>
    </Transition>

    <Transition
      :name="transitionName"
      @after-enter="$emit('onAfterOpen')"
      @after-leave="$emit('onAfterClose')">
      <div
        v-if="visible"
        role="dialog"
        aria-modal="true"
        class="sidepanel-body fixed inset-y-0 z-50 flex flex-col bg-body shadow-sm border border-border/80 transition-transform duration-200 ease-in-out w-full"
        :class="[sizeClasses[size], positionClasses, props.class]"
        :data-testid="
          $attrs['data-testid'] ||
          (displayTitle
            ? `sidepanel-${displayTitle
                .toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')}`
            : 'sidepanel')
        ">
        <div
          v-if="displayTitle || $slots.header"
          :class="headerClass"
          class="flex-none flex items-center justify-between px-5 py-2 border-b border-border">
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
            class="-mr-2"
            data-testid="sidepanel-close-btn" />
        </div>

        <div
          class="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-stable"
          :class="bodyClass">
          <template v-if="rawBody">
            <component :is="rawBody" v-bind="{ ...bodyProps, ...$attrs }" :close="close" />
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

<style scoped>
/*
  The overlay uses a plain semi-transparent color instead of
  backdrop-filter: blur(). backdrop-blur forces a full GPU composite pass
  on every frame — including every hover, focus, and transition event
  that occurs on elements inside the panel.

  The v-sidepanel-overlay class centralises the background so the
  :class binding stays clean. When backdrop prop is false, this element
  is still rendered for click-outside handling but is fully transparent.
*/
.v-sidepanel-overlay {
  background-color: rgba(0, 0, 0, 0.2);
}

/*
  Promote the panel body to its own GPU compositor layer.
  This isolates hover and focus repaints on child elements so they
  never trigger a repaint of the overlay or the page behind it.
  contain: layout style prevents internal style recalculations from
  escaping the panel subtree and causing parent layout invalidations.
*/
.sidepanel-body {
  will-change: transform;
  contain: layout style;
}
</style>
