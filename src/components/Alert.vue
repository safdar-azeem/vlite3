<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import Icon from './Icon.vue'
import type { AlertVariant } from '@/types'
import { $t } from '@/utils/i18n'

interface Props {
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  variant?: AlertVariant
  closable?: boolean
  role?: 'alert' | 'status' | 'none'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  closable: false,
  class: '',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(true)

const handleClose = () => {
  isVisible.value = false
  emit('close')
}

const displayTitle = computed(() => props.titleI18n ? $t(props.titleI18n) : props.title)
const displayDescription = computed(() => props.descriptionI18n ? $t(props.descriptionI18n) : props.description)

const variantClasses = computed(() => {
  const variants: Record<AlertVariant, string> = {
    primary: 'bg-primary-light text-primary border-primary/15',
    success: 'bg-success-light text-success-dark border-success/25',
    warning: 'bg-warning-light text-warning-dark border-warning/20',
    danger: 'bg-danger-light text-danger-dark border-danger/15',
  }
  return variants[props.variant]
})

const iconClasses = computed(() => {
  const variants: Record<AlertVariant, string> = {
    primary: 'text-primary!',
    success: 'text-success-dark!',
    warning: 'text-warning-dark!',
    danger: 'text-danger-dark!',
  }
  return variants[props.variant]
})

const isTitleOnly = computed(() => !displayDescription.value && !useSlots().default)

const containerClasses = computed(() => {
  return [
    'relative w-full rounded-lg border px-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:text-foreground',
    isTitleOnly.value ? 'py-3' : 'pt-4 pb-2',
    isTitleOnly.value
      ? '[&>svg]:top-1/2 [&>svg]:-translate-y-1/2'
      : '[&>svg]:top-4 top-4 [&>svg+div]:translate-y-[-3px]',
    variantClasses.value,
    props.class,
  ].join(' ')
})

const titleClasses = computed(() => {
  return [
    'font-medium leading-none tracking-tight text-inherit!',
    isTitleOnly.value ? '' : 'mb-1',
  ].join(' ')
})

const computedRole = computed(() => {
  if (props.role) return props.role
  return ['danger', 'warning'].includes(props.variant) ? 'alert' : 'status'
})
</script>

<template>
  <div v-if="isVisible" :class="containerClasses" :role="computedRole">
    <slot name="icon">
      <Icon v-if="icon" :icon="icon" class="h-4 w-4" :class="iconClasses" />
    </slot>

    <div :class="{ 'pl-7': icon || $slots.icon, 'pr-6': closable }">
      <h5 :class="titleClasses" v-if="displayTitle">
        {{ displayTitle }}
      </h5>
      <div v-if="displayDescription || $slots.default" class="text-sm opacity-90 [&_p]:leading-relaxed">
        <slot>
          {{ displayDescription }}
        </slot>
      </div>
    </div>

    <button
      v-if="closable"
      type="button"
      @click="handleClose"
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      :class="[isTitleOnly ? 'top-1/2 -translate-y-1/2' : 'top-4']">
      <Icon icon="lucide:x" class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </button>
  </div>
</template>

