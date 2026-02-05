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
      // Outline in attached usually means the Container (Accordion) has the border, items just have separators.
      return `${baseAttached} ${borderClass}`
    }
    if (variant === 'solid') {
      // Solid attached: items might alternate or just be list.
      return `border-b last:border-0 bg-transparent`
    }
    if (variant === 'ghost') {
      return 'bg-transparent border-b last:border-0'
    }
    return `${baseAttached} ${borderClass}`
  }

  // DETACHED MODE (Cards)
  // 'solid': Container has border (outline) but no background, content needs to be inside.
  if (variant === 'solid') {
    return 'mb-2 border rounded-lg overflow-hidden transition-all duration-200'
  }

  // 'outline': Item has border.
  if (variant === 'outline') return 'border mb-2 rounded-lg overflow-hidden'

  // 'separated': distinct cards style
  if (variant === 'separated') return 'border mb-4 rounded-lg  overflow-hidden'

  if (variant === 'ghost') return 'border-none bg-transparent mb-1'

  // Default Detached (Underline style usually)
  return 'border-b'
})

// Specific Trigger Styling Logic
const computedTriggerClass = computed(() => {
  const { variant, attached, isOpen } = props
  const base = props.triggerClass || ''

  // Solid Variant: Trigger gets the background
  if (variant === 'solid') {
    return `${base} px-4 bg-muted transition-colors`
  }

  // Default/Ghost in detached: no padding usually?
  if (!attached && (variant === 'ghost' || variant === 'default')) {
    return `${base} px-0 hover:no-underline` // ensure no unwanted hover bg
  }

  // Outline/Separated/Attached: usually need padding styling inside the border
  return `${base} px-4 hover:bg-accent`
})

const computedContentClass = computed(() => {
  const { variant, attached } = props
  const base = props.contentClass || ''

  if (variant === 'solid') {
    return `${base} px-4 pt-4`
  }

  if (!attached && (variant === 'ghost' || variant === 'default')) {
    return `${base} px-0`
  }
  return `${base} px-4`
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
