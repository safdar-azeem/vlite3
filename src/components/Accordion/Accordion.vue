<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { AccordionProps } from './types'
import AccordionItem from './AccordionItem.vue'

const props = withDefaults(defineProps<AccordionProps>(), {
  allowMultiple: false,
  variant: 'default',
  size: 'md',
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
    if (isOpen) {
      internalValue.value = []
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
    if (props.variant === 'outline' || props.variant === 'default' || props.variant === 'solid') {
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
          :is-open="internalValue.includes(item.id)"
          :variant="variant"
          :size="size"
          :attached="attached"
          :disabled="disabled"
          :index="index + 1"
          :show-index="showIndex"
          :open-icon="openIcon"
          :close-icon="closeIcon"
          :icon-variant="iconVariant"
          :active-icon-variant="activeIconVariant"
          :trigger-class="triggerClass"
          :content-class="contentClass"
          :item-class="itemClass"
          @toggle="toggleItem">
          <template v-if="$slots.trigger" #trigger="slotProps">
            <slot name="trigger" v-bind="slotProps" />
          </template>

          <template v-if="$slots.content" #content="slotProps">
            <slot name="content" v-bind="slotProps" :close="toggleItem" />
          </template>
        </AccordionItem>
      </template>
    </slot>
  </div>
</template>
