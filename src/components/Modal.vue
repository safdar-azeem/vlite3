<script setup lang="ts">
import {
  ref,
  watch,
  onUnmounted,
  provide,
  inject,
  type Component,
  computed,
  nextTick,
  onMounted,
  markRaw,
} from 'vue'
import Button from './Button.vue'
import { useKeyStroke } from '../composables/useKeyStroke'
import { $t } from '@/utils/i18n'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  show?: boolean
  title?: string
  titleI18n?: string
  maxWidth?: string
  closeOutside?: boolean
  backdrop?: boolean
  description?: string
  descriptionI18n?: string
  triggerClass?: string
  bodyClass?: string
  headerClass?: string
  footerClass?: string
  body?: Component
  bodyProps?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  backdrop: true,
  maxWidth: 'sm:max-w-lg',
  closeOutside: true,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:show', value: boolean): void
  (e: 'onOpen'): void
}>()

const visible = ref(props.show)
const isChildSubmitting = ref(false)
const showBlink = ref(false)
const modalRef = ref<HTMLElement | null>(null)
let blinkTimeout: ReturnType<typeof setTimeout> | null = null

// Whether a child Form has registered its sticky footer inside this modal.
// When true, the modal body removes its own bottom padding so the Form footer
// sits flush against the bottom of the modal with no gap.
const hasFormWithFooter = ref(false)

const dropdownContext = inject<{
  close: () => void
  onChildToggle?: (isOpen: boolean) => void
  registerChildId?: (id: string) => void
  unregisterChildId?: (id: string) => void
} | null>('dropdown-context', null)

// markRaw prevents Vue from wrapping the component definition in a deep
// reactive proxy, which would otherwise cause re-evaluation on every form
// field change and add unnecessary overhead to every render cycle.
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

const setSubmitting = (val: boolean) => {
  isChildSubmitting.value = val
}

// Called by child Form (via modal-context) to inform the modal that a Form
// with a visible footer is mounted inside it. The modal then zeroes its own
// bottom padding so there is no double-spacing between form content and footer.
const registerFormFooter = (active: boolean) => {
  hasFormWithFooter.value = active
}

const close = () => {
  if (isChildSubmitting.value) {
    showBlink.value = true
    if (blinkTimeout) clearTimeout(blinkTimeout)
    blinkTimeout = setTimeout(() => {
      showBlink.value = false
    }, 1000)
    return
  }

  visible.value = false
  emit('update:show', false)
  emit('close')
}

const handleClose = () => {
  visible.value = false
  emit('update:show', false)
  emit('close')
}

provide('modal-context', { close, setSubmitting, registerFormFooter })

const handleBackdropClick = () => {
  if (props.closeOutside) {
    close()
  }
}

const { onKeyStroke } = useKeyStroke()
onKeyStroke('Escape', close)

watch(visible, async (val) => {
  if (val) {
    dropdownContext?.onChildToggle?.(true)
    document.body.style.overflow = 'hidden'
    await nextTick()
    modalRef.value?.focus()
  } else {
    document.body.style.overflow = ''
    dropdownContext?.onChildToggle?.(false)
    // Reset the footer registration when modal closes so re-opens are clean
    hasFormWithFooter.value = false
  }
})

onMounted(() => {
  if (visible.value) dropdownContext?.onChildToggle?.(true)
})

onUnmounted(() => {
  if (visible.value) dropdownContext?.onChildToggle?.(false)
  document.body.style.overflow = ''
  if (blinkTimeout) clearTimeout(blinkTimeout)
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
    :data-testid="$attrs['data-testid'] ? `${$attrs['data-testid']}-trigger` : (displayTitle ? `modal-trigger-${displayTitle.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : 'modal-trigger')"
    v-if="$slots?.trigger || $slots?.default">
    <slot name="trigger">
      <template v-if="body">
        <slot />
      </template>
    </slot>
  </span>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 v-modal-overlay"
      :class="backdrop ? 'v-modal-backdrop' : ''"
      @click="handleBackdropClick">
      <Transition name="modal-dialog">
      <div
        v-if="visible"
        ref="modalRef"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        class="modal-body relative w-full rounded border border-border/60 bg-body shadow-lg text-foreground flex flex-col max-h-[85vh] sm:max-h-[90vh] focus:outline-none"
        :class="[maxWidth]"
        :data-testid="$attrs['data-testid'] || (displayTitle ? `modal-${displayTitle.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : 'modal')"
        @click.stop>
        <div
          v-if="displayTitle"
          class="flex-none flex flex-col space-y-1.5 pb-0 border-b border-border/90">
          <div
            class="flex items-center justify-between py-2 px-4 rounded-t-md"
            :class="headerClass">
            <h3 class="text-lg font-semibold leading-none tracking-tight">
              {{ displayTitle }}
            </h3>
            <Button
              rounded="full"
              size="sm"
              icon="lucide:x"
              variant="ghost"
              class="hover:bg-gray-250/25!"
              :class="{ 'blink-bg': showBlink }"
              data-testid="modal-close-btn"
              @click="close" />
          </div>
        </div>

        <div
          class="flex-1 overflow-y-auto px-4 pt-4 min-h-0 scrollbar-thin scrollbar-stable"
          :class="[hasFormWithFooter ? 'pb-0' : 'pb-3.5', bodyClass]">
          <p v-if="displayDescription" class="text-sm text-muted-foreground mb-3.5">
            {{ displayDescription }}
          </p>
          <template v-if="rawBody">
            <component :is="rawBody" v-bind="{ ...bodyProps, ...$attrs }" :close="handleClose" />
          </template>
          <template v-else>
            <slot :close="handleClose" />
          </template>
        </div>

        <div
          v-if="$slots.footer"
          :class="footerClass"
          class="flex-none flex items-center px-4 py-3 border-t border-border/75 rounded-b-xl bg-body">
          <slot name="footer" :close="handleClose" />
        </div>
      </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.v-modal-overlay {
  background-color: rgba(0, 0, 0, 0.32);
}

.v-modal-backdrop {
  transform: translateZ(0);
}

/* ── Dialog open/close — opacity only, no movement ───────────────────────
   80 ms in (feels instant) / 120 ms out (soft disappear).
*/
.modal-dialog-enter-active {
  transition: opacity 80ms ease-out;
}
.modal-dialog-leave-active {
  transition: opacity 120ms ease-in;
}
.modal-dialog-enter-from,
.modal-dialog-leave-to {
  opacity: 0;
}

.modal-body {
  will-change: opacity;
  contain: layout style;
}

.blink-bg {
  animation: blink-animation 1s infinite;
}

@keyframes blink-animation {
  0% {
    background-color: inherit;
  }
  15% {
    background-color: var(--color-gray-250);
  }
  35% {
    background-color: inherit;
  }
  75% {
    background-color: var(--color-gray-250);
  }
  100% {
    background-color: inherit;
  }
}
</style>
