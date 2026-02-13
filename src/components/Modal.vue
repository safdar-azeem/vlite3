<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, provide, type Component } from 'vue'
import Button from './Button.vue'
import { useKeyStroke } from '../composables/useKeyStroke'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  show?: boolean
  title?: string
  maxWidth?: string
  closeOutside?: boolean
  backdrop?: boolean
  description?: string
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

// Provide the close method to descendants (e.g., Form.vue)
provide('modal-context', { close })

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
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#00000051] p-4"
        :class="backdrop && 'backdrop-blur-[2px]'"
        @click="handleBackdropClick">
        <div
          class="modal-body relative w-full rounded border border-border bg-body shadow-lg text-foreground flex flex-col max-h-[85vh] sm:max-h-[90vh]"
          :class="[maxWidth]"
          @click.stop>
          <div
            v-if="title"
            class="flex-none flex flex-col space-y-1.5 pb-0 border-b border-border/60">
            <div
              class="flex items-center justify-between bg-muted-light py-1 px-4 rounded-t-md"
              :class="headerClass">
              <h3 class="text-lg font-semibold leading-none tracking-tight">
                {{ title }}
              </h3>
              <Button
                rounded="full"
                size="sm"
                icon="lucide:x"
                variant="ghost"
                class="hover:bg-gray-250/25!"
                @click="close" />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 pt-4 pb-3.5 min-h-0" :class="bodyClass">
            <p v-if="description" class="text-sm text-muted-foreground mb-2">
              {{ description }}
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
            class="flex-none flex items-center px-4 py-3 border-t border-border/60 rounded-b-xl bg">
            <slot name="footer" :close="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
