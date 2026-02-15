<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { TabesOption, TabesSize, TabesVariant } from './types'
import Icon from '../Icon.vue'

interface Props {
  options: TabesOption[]
  modelValue: string | number
  size?: TabesSize
  variant?: TabesVariant
  block?: boolean
  textClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'surface',
  block: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const itemRefs = ref<Map<string | number, HTMLElement | null>>(new Map())

const setItemRef = (el: any, value: string | number) => {
  if (el) {
    itemRefs.value.set(value, el as HTMLElement)
  } else {
    itemRefs.value.delete(value)
  }
}

const markerStyle = ref({
  width: '0px',
  height: '0px',
  transform: 'translate(0px, 0px)',
  opacity: 0,
})

const updateMarker = async () => {
  await nextTick()
  const container = containerRef.value
  const activeElement = itemRefs.value.get(props.modelValue)

  if (!container || !activeElement) {
    markerStyle.value.opacity = 0
    return
  }

  const containerRect = container.getBoundingClientRect()
  const activeRect = activeElement.getBoundingClientRect()

  const left = activeRect.left - containerRect.left
  const top = activeRect.top - containerRect.top
  const width = activeRect.width
  const height = activeRect.height

  markerStyle.value = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${left}px, ${top}px)`,
    opacity: 1,
  }
}

useResizeObserver(containerRef, updateMarker)

watch(() => props.modelValue, updateMarker)
watch(() => props.options, updateMarker, { deep: true })
watch(() => props.size, updateMarker)
watch(() => props.block, updateMarker)

onMounted(updateMarker)

const handleSelect = (option: TabesOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

const containerClasses = computed(() => {
  const base = 'inline-flex rounded-lg relative isolate'

  const variantStyles: Record<TabesVariant, string> = {
    surface: 'bg-secondary p-1',
    primary: 'bg-secondary p-1',
    secondary: 'bg-secondary p-1',
    danger: 'bg-danger/10 p-1',
    success: 'bg-success/10 p-1',
    outline: 'bg-transparent border border-border p-1',
    line: 'bg-transparent gap-6 rounded-none p-0 border-b border-border w-full',
  }

  return [base, variantStyles[props.variant], props.block ? 'flex w-full' : '']
})

const sizeClasses = {
  sm: 'text-xs px-2.5 py-1',
  md: 'text-xs px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

const itemBaseClasses = computed(() => {
  const isLine = props.variant === 'line'
  const base = isLine
    ? 'relative z-10 flex items-center justify-center gap-2 font-medium transition-colors duration-50 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/50 pb-2 border-b-2 border-transparent hover:text-foreground'
    : 'relative z-10 flex-1 flex items-center justify-center gap-2 font-medium transition-colors duration-50 ease-out cursor-pointer select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

  return [base]
})

const getItemClasses = (option: TabesOption) => {
  const isActive = option.value === props.modelValue
  const isLine = props.variant === 'line'

  let activeStateClasses = ''
  if (isActive) {
    if (isLine) {
      activeStateClasses = 'text-primary'
    } else {
      switch (props.variant) {
        case 'surface':
          activeStateClasses = 'text-foreground'
          break
        case 'primary':
          activeStateClasses = 'text-primary-foreground'
          break
        case 'secondary':
          activeStateClasses = 'text-secondary'
          break
        case 'danger':
          activeStateClasses = 'text-danger-fg'
          break
        case 'success':
          activeStateClasses = 'text-success-fg'
          break
        case 'outline':
          activeStateClasses = 'text-accent-foreground'
          break
        default:
          activeStateClasses = 'text-foreground'
      }
    }
  } else {
    activeStateClasses = isLine
      ? 'text-muted-foreground'
      : 'text-muted-foreground hover:text-foreground/80'
  }

  const disabledClasses = option.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [itemBaseClasses.value, activeStateClasses, disabledClasses].join(' ')
}

const markerClasses = computed(() => {
  const base =
    'absolute left-0 top-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-0 pointer-events-none'

  if (props.variant === 'line') {
    return `${base} !h-[2px] !top-auto bottom-0`
  }

  return `${base} rounded-md shadow-sm`
})

const getMarkerColorClass = () => {
  const variantActiveStyles: Record<TabesVariant, string> = {
    surface: 'bg-background',
    primary: 'bg-primary',
    secondary: 'bg-secondary-foreground',
    danger: 'bg-danger',
    success: 'bg-success',
    outline: 'bg-accent/50 ring-1 ring-border',
    line: 'bg-primary',
  }
  return variantActiveStyles[props.variant]
}
</script>

<template>
  <div ref="containerRef" :class="containerClasses" role="tablist">
    <!-- Active Marker -->
    <div
      v-if="modelValue !== undefined"
      :class="[markerClasses, getMarkerColorClass()]"
      :style="markerStyle"></div>

    <button
      v-for="opt in options"
      :key="opt.value"
      :ref="(el) => setItemRef(el, opt.value)"
      role="tab"
      :aria-selected="modelValue === opt.value"
      :disabled="opt.disabled"
      :class="[getItemClasses(opt), sizeClasses[props.size]]"
      @click="handleSelect(opt)"
      type="button">
      <Icon v-if="opt.icon" :icon="opt.icon" :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
      <span class="whitespace-nowrap z-20 relative" :class="textClass">{{ opt.label }}</span>
    </button>
  </div>
</template>
