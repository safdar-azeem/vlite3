<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'

interface Props {
  to?: string
  href?: string
  label?: string
  icon?: string
  iconRight?: string
  active?: boolean
  disabled?: boolean
  class?: string
  // 'horizontal' | 'vertical' - usually inferred but can be forced
  orientation?: 'horizontal' | 'vertical'
  // 'default' | 'pill' | 'underline'
  variant?: 'default' | 'pill' | 'underline' | 'ghost'
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false,
  class: '',
  orientation: 'horizontal',
  variant: 'ghost',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const isExternal = computed(() => {
  return props.href && (props.href.startsWith('http') || props.href.startsWith('//'))
})

const componentType = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const classes = computed(() => {
  const base =
    'group flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  // Ghost Variant
  if (props.variant === 'ghost') {
    return [
      base,
      'hover:bg-accent hover:text-foreground text-muted-foreground',
      props.active ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground',
      props.class,
    ].join(' ')
  }

  // Pill Variant
  if (props.variant === 'pill') {
    return [
      base,
      props.active
        ? 'bg-primary text-primary-fg shadow-sm'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
      props.class,
    ].join(' ')
  }

  // Underline Variant
  if (props.variant === 'underline') {
    return [
      base,
      'rounded-none border-b-2',
      props.active
        ? 'text-primary border-primary'
        : 'text-muted-foreground border-transparent hover:border-border hover:text-foreground',
      props.class,
    ].join(' ')
  }

  // Default Variant (link style)
  return [
    base,
    'hover:text-foreground transition-colors',
    props.active ? 'text-foreground font-semibold' : 'text-muted-foreground',
    props.class,
  ].join(' ')
})

const handleClick = (e: MouseEvent) => {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :type="componentType === 'button' ? 'button' : undefined"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :class="classes"
    @click="handleClick">
    <Icon
      v-if="icon"
      :icon="icon"
      class="h-4 w-4 shrink-0 transition-colors"
      :class="active ? 'text-current' : 'text-muted-foreground group-hover:text-current'" />

    <span v-if="label || $slots.default" class="flex-1 truncate text-left">
      <slot>{{ label }}</slot>
    </span>

    <Icon v-if="iconRight" :icon="iconRight" class="h-4 w-4 shrink-0 opacity-70" />

    <!-- Optional Badge Slot support -->
    <div v-if="$slots.badge" class="ml-auto">
      <slot name="badge" />
    </div>
  </component>
</template>
