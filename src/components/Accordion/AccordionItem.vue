<script setup lang="ts">
import { computed } from 'vue'
import type { AccordionItemSchema, AccordionVariant, AccordionSize, IconVariant } from './types'
import AccordionTrigger from './AccordionTrigger.vue'
import AccordionContent from './AccordionContent.vue'

interface Props {
  item: AccordionItemSchema
  isOpen: boolean
  variant?: AccordionVariant
  size?: AccordionSize
  attached?: boolean
  disabled?: boolean
  index?: number
  showIndex?: boolean
  openIcon?: string
  closeIcon?: string
  iconVariant?: IconVariant
  activeIconVariant?: IconVariant
  triggerClass?: string
  contentClass?: string
  itemClass?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  attached: false,
  disabled: false,
  class: '',
  showIndex: false,
})

const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()

const handleToggle = () => {
  if (props.item.disabled || props.disabled) return
  emit('toggle', props.item.id)
}

const containerClass = computed(() => {
  const { variant, attached } = props

  if (attached) {
    const baseAttached = 'transition-all first:rounded-t-lg last:rounded-b-lg'
    const borderClass = 'border-b last:border-0'
    return `${baseAttached} ${borderClass}`
  }

  if (variant === 'solid')
    return 'mb-2 border rounded-lg overflow-hidden transition-all duration-200'
  if (variant === 'outline') return 'border mb-2 rounded-lg overflow-hidden'
  if (variant === 'separated') return 'border mb-4 rounded-lg overflow-hidden'
  if (variant === 'ghost') return 'border-none bg-transparent mb-1 rounded-lg overflow-hidden'

  return 'border-b'
})

const computedTriggerClass = computed(() => {
  const { variant, size, isOpen } = props
  const base = props.triggerClass || ''
  const transition = 'transition-all duration-200 ease-in-out'

  const paddings: Record<AccordionSize, string> = {
    sm: 'px-3.5 py-2.5 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  }

  const padding = paddings[size]

  if (variant === 'solid') {
    return `${base} ${padding} bg-muted hover:bg-muted/80 ${transition}`
  }

  if (variant === 'ghost') {
    if (isOpen) return `${base} ${padding} bg-muted font-medium ${transition}`
    return `${base} ${padding} hover:bg-muted/20 bg-transparent ${transition}`
  }

  if (variant === 'outline' || variant === 'separated') {
    if (isOpen) return `${base} ${padding} bg-muted/5 border-b border-border ${transition}`
    return `${base} ${padding} hover:bg-muted/5 bg-transparent ${transition}`
  }

  if (!props.attached && variant === 'default') {
    const defaultPaddings: Record<AccordionSize, string> = {
      sm: 'py-2 text-base',
      md: 'py-3 text-base',
      lg: 'py-4 text-lg',
    }
    return `${base} ${defaultPaddings[size]} px-0 hover:no-underline ${transition}`
  }

  return `${base} ${padding} hover:bg-muted/5 ${transition}`
})

const computedContentClass = computed(() => {
  const { variant, size, attached } = props
  const base = props.contentClass || ''

  const paddings: Record<AccordionSize, string> = {
    sm: 'px-3.5 pb-3.5 pt-2.5 text-sm',
    md: 'px-4 pb-4 pt-4 text-sm',
    lg: 'px-5 pb-5 pt-5 text-base',
  }

  if (
    variant === 'solid' ||
    variant === 'outline' ||
    variant === 'separated' ||
    variant === 'ghost' ||
    attached
  ) {
    return `${base} ${paddings[size]}`
  }

  const defaultPaddings: Record<AccordionSize, string> = {
    sm: 'pb-3.5 pt-2.5 text-sm',
    md: 'pb-4 pt-4 text-sm',
    lg: 'pb-5 pt-5 text-base',
  }
  return `${base} ${defaultPaddings[size]} px-0`
})
</script>

<template>
  <div :class="[containerClass, props.class, props.itemClass]">
    <slot
      name="trigger"
      :item="item"
      :open="isOpen"
      :toggle="handleToggle"
      :trigger-class="computedTriggerClass">
      <AccordionTrigger
        :open="isOpen"
        :size="size"
        :disabled="item.disabled || disabled"
        :icon="item.icon"
        :index="index"
        :show-index="showIndex"
        :open-icon="openIcon"
        :close-icon="closeIcon"
        :icon-variant="iconVariant"
        :active-icon-variant="activeIconVariant"
        :class="computedTriggerClass"
        @click="handleToggle">
        <span class="font-medium">
          {{ item.title }}
        </span>

        <span v-if="item.description" class="ml-2 text-sm text-muted-foreground font-normal">
          {{ item.description }}
        </span>
      </AccordionTrigger>
    </slot>

    <AccordionContent v-show="isOpen" :class="computedContentClass">
      <slot name="content" :item="item" :close="handleToggle">
        <component
          v-if="item.bodyComponent"
          :is="item.bodyComponent"
          :item="item"
          :close="handleToggle" />
        <div
          v-else-if="item.content"
          class="text-muted-foreground leading-relaxed"
          v-html="item.content"></div>
      </slot>
    </AccordionContent>
  </div>
</template>
