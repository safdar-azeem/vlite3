<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressBarProps, ProgressBarVariant, ProgressBarSize } from '@/types/progressbar'

const props = withDefaults(defineProps<ProgressBarProps>(), {
  type: 'linear',
  variant: 'primary',
  size: 'md',
  showValue: false,
  striped: false,
  animated: false,
  indeterminate: false,
  rounded: 'rounded-full',
})

// --- Utilities ---

const normalizeValue = (val: number) => Math.min(100, Math.max(0, val))

const formatSize = (val?: string | number) => {
  if (val === undefined) return undefined
  return typeof val === 'number' ? `${val}px` : val
}

// --- Styles & Classes ---

const variantClasses: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-success text-success-fg',
  warning: 'bg-warning text-warning-fg',
  danger: 'bg-destructive text-destructive-foreground',
  info: 'bg-info text-info-fg',
  gradient: 'bg-gradient-to-r from-primary to-purple-500 text-white',
}

const sizeHeights: Record<ProgressBarSize, string> = {
  xs: 'h-1 text-[10px]',
  sm: 'h-2 text-xs',
  md: 'h-3 text-xs',
  lg: 'h-4 text-sm',
  xl: 'h-6 text-base',
}

const circularSizes: Record<ProgressBarSize, number> = {
  xs: 40,
  sm: 60,
  md: 80,
  lg: 120,
  xl: 160,
}

// --- Linear Logic ---

const linearStyle = computed(() => {
  const height = formatSize(props.height)
  return {
    height: height,
    width: `${normalizeValue(props.modelValue)}%`,
    backgroundColor: props.color,
    transition: 'width 0.3s ease-in-out',
  }
})

const trackStyle = computed(() => {
  return {
    backgroundColor: props.trackColor,
    height: formatSize(props.height),
  }
})

// --- Circular Logic ---

const circleConfig = computed(() => {
  const width =
    typeof props.width === 'number'
      ? props.width
      : props.width
        ? parseInt(props.width as string)
        : circularSizes[props.size]

  const stroke = props.strokeWidth || width / 10
  const radius = (width - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (normalizeValue(props.modelValue) / 100) * circumference

  return {
    width,
    stroke,
    radius,
    circumference,
    offset,
    center: width / 2,
  }
})

const strokeColor = computed(() => {
  if (props.color) return props.color
  // Map variant to hex/var for SVG stroke if possible,
  // but usually classes work better.
  // We'll use currentColor via text class on wrapper.
  return 'currentColor'
})

// --- Classes ---

const wrapperClasses = computed(() => {
  return [
    'w-full overflow-hidden',
    props.rounded,
    !props.height ? sizeHeights[props.size] : '', // Only apply preset height if custom not set
    'bg-secondary', // Default track
  ]
})

const barClasses = computed(() => {
  return [
    'h-full flex items-center justify-center transition-all duration-300 rounded',
    !props.color ? variantClasses[props.variant] : '',
    props.striped ? 'bg-stripe' : '',
    props.animated ? 'animate-progress-stripe' : '',
    props.indeterminate ? 'animate-progress-indeterminate w-full origin-left' : '',
  ]
})

const circularTextClass = computed(() => {
  const base = 'absolute inset-0 flex items-center justify-center font-medium'
  const sizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
  }
  return [base, sizes[props.size]].join(' ')
})

const circularVariantClass = computed(() => {
  const map: Record<ProgressBarVariant, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
    info: 'text-info',
    gradient: 'text-primary', // SVG gradient handled separately if needed
  }
  return map[props.variant]
})
</script>

<template>
  <div
    v-if="type === 'linear'"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : modelValue"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :class="wrapperClasses"
    :style="trackStyle">
    <div :class="barClasses" :style="indeterminate ? {} : linearStyle">
      <span
        v-if="showValue && !indeterminate && size !== 'xs' && size !== 'sm'"
        class="px-2 font-medium truncate">
        {{ label || `${Math.round(modelValue)}%` }}
      </span>
    </div>
  </div>

  <div
    v-else
    role="progressbar"
    :aria-valuenow="modelValue"
    :aria-valuemin="0"
    :aria-valuemax="100"
    class="relative inline-flex items-center justify-center"
    :style="{ width: `${circleConfig.width}px`, height: `${circleConfig.width}px` }">
    <svg
      :width="circleConfig.width"
      :height="circleConfig.width"
      :viewBox="`0 0 ${circleConfig.width} ${circleConfig.width}`"
      class="transform -rotate-90">
      <circle
        :cx="circleConfig.center"
        :cy="circleConfig.center"
        :r="circleConfig.radius"
        :stroke-width="circleConfig.stroke"
        fill="transparent"
        class="text-secondary stroke-current"
        :style="{ stroke: trackColor }" />
      <circle
        :cx="circleConfig.center"
        :cy="circleConfig.center"
        :r="circleConfig.radius"
        :stroke-width="circleConfig.stroke"
        fill="transparent"
        :stroke-dasharray="circleConfig.circumference"
        :stroke-dashoffset="circleConfig.offset"
        stroke-linecap="round"
        class="stroke-current transition-all duration-300 ease-out"
        :class="[!color ? circularVariantClass : '']"
        :style="{ stroke: color }" />
    </svg>

    <div v-if="showValue" :class="circularTextClass">
      {{ label || `${Math.round(modelValue)}%` }}
    </div>
  </div>
</template>

<style scoped>
.bg-stripe {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.animate-progress-stripe {
  animation: progress-stripe 1s linear infinite;
}

@keyframes progress-stripe {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

.animate-progress-indeterminate {
  animation: progress-indeterminate 1.5s infinite cubic-bezier(0.65, 0.815, 0.735, 0.395);
}

@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%) scaleX(0.2);
  }
  50% {
    transform: translateX(0%) scaleX(0.5);
  }
  100% {
    transform: translateX(100%) scaleX(0.2);
  }
}
</style>
