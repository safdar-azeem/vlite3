<script setup lang="ts">
import { computed } from 'vue'
import type { AccordionItemSchema, AccordionVariant } from './types'
import AccordionTrigger from './AccordionTrigger.vue'
import AccordionContent from './AccordionContent.vue'

interface Props {
  item: AccordionItemSchema
  isOpen: boolean
  variant?: AccordionVariant
  attached?: boolean
  disabled?: boolean
  index?: number
  showIndex?: boolean
  openIcon?: string
  closeIcon?: string
  iconVariant?: 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'
  activeIconVariant?: 'simple' | 'solid' | 'outline' | 'primary' | 'ghost'

  // Classes
  triggerClass?: string
  contentClass?: string
  itemClass?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
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

// Styling based on variant
const containerClass = computed(() => {
  const { variant, attached } = props

  if (attached) {
    // ATTACHED MODE (List Group)
    const baseAttached = 'transition-all first:rounded-t-lg last:rounded-b-lg'
    let borderClass = 'border-b last:border-0'

    if (variant === 'default' || variant === 'outline') {
      return `${baseAttached} ${borderClass}`
    }
    if (variant === 'solid') {
      return `border-b last:border-0 bg-transparent`
    }
    if (variant === 'ghost') {
      return 'bg-transparent border-b last:border-0'
    }
    return `${baseAttached} ${borderClass}`
  }

  // DETACHED MODE (Cards)
  // 'solid': Container has border (outline) but no background
  if (variant === 'solid') {
    return 'mb-2 border rounded-lg overflow-hidden transition-all duration-200'
  }

  // 'outline': Item has border.
  if (variant === 'outline') return 'border mb-2 rounded-lg overflow-hidden'

  // 'separated': distinct cards style
  if (variant === 'separated') return 'border mb-4 rounded-lg overflow-hidden'

  if (variant === 'ghost') return 'border-none bg-transparent mb-1 rounded-lg overflow-hidden'

  // Default Detached (Underline style usually)
  return 'border-b'
})

// Specific Trigger Styling Logic
const computedTriggerClass = computed(() => {
  const { variant, attached, isOpen } = props
  const base = props.triggerClass || ''
  
  // Transition base for smooth background swaps
  const transition = 'transition-all duration-200 ease-in-out'
  const padding = 'px-4'

  // --- SOLID VARIANT ---
  if (variant === 'solid') {
    return `${base} ${padding} bg-muted hover:bg-muted/80 ${transition}`
  }

  // --- GHOST VARIANT ---
  if (variant === 'ghost') {
    // Requirement: Feel solid when open. 
    // We enforce padding to ensure the "solid" state looks like a block.
    if (isOpen) {
      return `${base} ${padding} bg-muted font-medium ${transition}`
    }
    return `${base} ${padding} hover:bg-muted/20 bg-transparent ${transition}`
  }

  // --- OUTLINE / SEPARATED ---
  if (variant === 'outline' || variant === 'separated') {
    // Requirement: Better UX handling.
    // When open, add a border-b to separate header from content and subtle bg.
    if (isOpen) {
      return `${base} ${padding} bg-muted/5 border-b border-border ${transition}`
    }
    return `${base} ${padding} hover:bg-muted/5 bg-transparent ${transition}`
  }

  // --- DEFAULT (Detached) ---
  if (!attached && variant === 'default') {
    // Classic minimal style (no padding usually)
    return `${base} px-0 hover:no-underline ${transition}`
  }

  // --- DEFAULT (Attached) ---
  return `${base} ${padding} hover:bg-muted/5 ${transition}`
})

const computedContentClass = computed(() => {
  const { variant, attached } = props
  const base = props.contentClass || ''

  // Standardize padding for content to match triggers with padding
  if (variant === 'solid' || variant === 'outline' || variant === 'separated' || variant === 'ghost' || attached) {
    return `${base} px-4 pt-4`
  }

  // Default detached minimal
  return `${base} px-0 pt-4`
})
</script>

<template>
  <div :class="[containerClass, props.class, props.itemClass]">
    <slot
      name="trigger"
      :item="item"
      :open="isOpen"
      :toggle="handleToggle"
      :triggerClass="computedTriggerClass">
      <AccordionTrigger
        :open="isOpen"
        :disabled="item.disabled || disabled"
        :icon="item.icon"
        :index="index"
        :showIndex="showIndex"
        :open-icon="openIcon"
        :close-icon="closeIcon"
        :icon-variant="iconVariant"
        :active-icon-variant="activeIconVariant"
        :class="computedTriggerClass"
        @click="handleToggle">
        <span>
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
