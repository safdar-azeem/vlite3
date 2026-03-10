<script setup lang="ts">
import { ref, watch, onUnmounted, provide, inject, type Component, computed, nextTick, onMounted } from 'vue'
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

const dropdownContext = inject('dropdown-context', null) as { close: () => void, onChildToggle?: (isOpen: boolean) => void } | null

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

provide('modal-context', { close, setSubmitting })

const handleBackdropClick = () => {
  if (props.closeOutside) {
    close()
  }
}

const { onKeyStroke } = useKeyStroke()
onKeyStroke('Escape', close)

watch(visible, async (val) => {
  dropdownContext?.onChildToggle?.(val)
  if (val) {
    document.body.style.overflow = 'hidden'
    await nextTick()
    modalRef.value?.focus()
  } else {
    document.body.style.overflow = ''
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
  <span @click.stop="handleOpen" :class="`${triggerClass}`" v-bind="$attrs">
    <slot name="trigger">
      <template v-if="body">
        <slot />
      </template>
    </slot>
  </span>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#00000051] p-4 v-modal-overlay"
        :class="backdrop && 'backdrop-blur-[2px]'"
        @click="handleBackdropClick">
        <div
          ref="modalRef"
          tabindex="-1"
          class="modal-body relative w-full rounded border border-border/60 bg-body shadow-lg text-foreground flex flex-col max-h-[85vh] sm:max-h-[90vh] focus:outline-none"
          :class="[maxWidth]"
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
                class="hover:bg-gray-250/25! transition-all"
                :class="{ 'blink-bg': showBlink }"
                @click="close" />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 pt-4 pb-3.5 min-h-0" :class="bodyClass">
            <p v-if="displayDescription" class="text-sm text-muted-foreground mb-6.5">
              {{ displayDescription }}
            </p>
            <template v-if="body">
              <component :is="body" v-bind="{ ...bodyProps, ...$attrs }" :close="close" />
            </template>
            <template v-else>
              <slot :close="close" />
            </template>
          </div>

          <div
            v-if="$slots.footer"
            :class="footerClass"
            class="flex-none flex items-center px-4 py-3 border-t border-border/75 rounded-b-xl bg-body">
            <slot name="footer" :close="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
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
