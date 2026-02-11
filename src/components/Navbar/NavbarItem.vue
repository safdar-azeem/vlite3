<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '../Icon.vue'
import Tooltip from '@/components/Tooltip.vue'

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

const route = useRoute()

const isActive = computed(() => {
  if (props.active) return true
  if (props.to && route) {
    const toPath = props.to.toString()
    return (
      route.path === toPath ||
      (route.path.startsWith(toPath) && toPath !== '/' && toPath.length > 1)
    )
  }
  return false
})

const isExternal = computed(() => {
  return props.href && (props.href.startsWith('http') || props.href.startsWith('//'))
})

const componentType = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const navbarContext = inject<{ compact: { value: boolean } } | null>('navbar-context', null)
const isCompact = computed(() => navbarContext?.compact.value || false)
const classes = computed(() => {
  const base =
    'group flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const layout = isCompact.value ? 'justify-center' : ''

  // Ghost Variant
  if (props.variant === 'ghost') {
    return [
      base,
      layout,
      'hover:bg-accent hover:text-foreground text-muted-foreground',
      isActive.value
        ? 'bg-primary-light text-primary-fg-light font-semibold'
        : 'text-muted-foreground',
      props.class,
    ].join(' ')
  }

  // Pill Variant
  if (props.variant === 'pill') {
    return [
      base,
      layout,
      isActive.value
        ? 'bg-primary text-primary-fg shadow-sm'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
      props.class,
    ].join(' ')
  }

  // Underline Variant
  if (props.variant === 'underline') {
    return [
      base,
      layout,
      'rounded-none border-b-2',
      isActive.value
        ? 'text-primary border-primary'
        : 'text-muted-foreground border-transparent hover:border-border hover:text-foreground',
      props.class,
    ].join(' ')
  }

  // Default Variant (link style)
  return [
    base,
    layout,
    'hover:text-foreground transition-colors',
    isActive.value ? 'text-foreground font-semibold' : 'text-muted-foreground',
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
  <Tooltip
    :content="label || (typeof $slots.default === 'string' ? $slots.default : '')"
    placement="right"
    :disabled="!isCompact"
    class="w-full">
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
        :class="isActive ? 'text-current' : 'text-muted-foreground group-hover:text-current'" />

      <span
        v-if="label || $slots.default"
        class="flex-1 truncate text-left"
        :class="{ 'md:hidden': isCompact }">
        <slot>{{ label }}</slot>
      </span>

      <Icon
        v-if="iconRight"
        :icon="iconRight"
        class="h-4 w-4 shrink-0 opacity-70"
        :class="{ 'md:hidden': isCompact }" />

      <!-- Optional Badge Slot support -->
      <div v-if="$slots.badge" class="ml-auto" :class="{ 'md:hidden': isCompact }">
        <slot name="badge" />
      </div>
    </component>
  </Tooltip>
</template>
