<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { AccordionProps } from './types'
import AccordionItem from './AccordionItem.vue'

const props = withDefaults(defineProps<AccordionProps>(), {
  allowMultiple: false,
  variant: 'default',
  attached: false,
  items: () => [],
  disabled: false,
  showIndex: false,
  iconVariant: 'simple',
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'change', value: string | string[]): void
}>()

// Internal state
const internalValue = ref<string[]>([])

const normalizeValue = (val: string | string[] | undefined): string[] => {
  if (Array.isArray(val)) return val
  if (typeof val === 'string' && val) return [val]
  return []
}

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = normalizeValue(newVal)
  },
  { immediate: true }
)

watch(
  () => props.defaultValue,
  (newVal) => {
    if (!props.modelValue && newVal) {
      internalValue.value = normalizeValue(newVal)
    }
  },
  { immediate: true }
)

const toggleItem = (id: string) => {
  if (props.disabled) return

  const isOpen = internalValue.value.includes(id)

  if (props.allowMultiple) {
    if (isOpen) {
      internalValue.value = internalValue.value.filter((v) => v !== id)
    } else {
      internalValue.value = [...internalValue.value, id]
    }
  } else {
    // Single mode
    if (isOpen) {
      internalValue.value = [] // Toggle off if clicking same
    } else {
      internalValue.value = [id]
    }
  }

  emitChange()
}

const emitChange = () => {
  const val = props.allowMultiple ? internalValue.value : internalValue.value[0] || ''
  emit('update:modelValue', val)
  emit('change', val)
}

const rootClasses = computed(() => {
  const classes = ['w-full', props.class]

  if (props.attached) {
    classes.push('rounded-lg overflow-hidden')

    // Add border to container if it's outline or default attached
    if (props.variant === 'outline' || props.variant === 'default') {
      classes.push('border')
    }
    // Solid attached usually keeps items contained
    if (props.variant === 'solid') {
      classes.push('border')
    }
  }

  return classes.join(' ')
})
</script>

<template>
  <div :class="rootClasses">
    <slot>
      <template v-for="(item, index) in items" :key="item.id">
        <AccordionItem
          :item="item"
          :isOpen="internalValue.includes(item.id)"
          :variant="variant"
          :attached="attached"
          :disabled="disabled"
          :index="index + 1"
          :showIndex="showIndex"
          :openIcon="openIcon"
          :closeIcon="closeIcon"
          :iconVariant="iconVariant"
          :activeIconVariant="activeIconVariant"
          :triggerClass="triggerClass"
          :contentClass="contentClass"
          :itemClass="itemClass"
          @toggle="toggleItem">
          <template v-if="$slots.trigger" #trigger="{ item, open, toggle, triggerClass }">
            <slot
              name="trigger"
              :item="item"
              :open="open"
              :toggle="toggle"
              :triggerClass="triggerClass" />
          </template>

          <template v-if="$slots.content" #content="{ item }">
            <slot name="content" :close="toggleItem" :item="item" />
          </template>
        </AccordionItem>
      </template>
    </slot>
  </div>
</template>
