<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from './Icon.vue'
import { $t } from '@/utils/i18n'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    label?: string
    labelI18n?: string
    icon?: string
    disabled?: boolean
    showValue?: boolean
    modelValue?: number
    labelClass?: string
    valueClass?: string
    centerOrigin?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
    orientation?: 'horizontal' | 'vertical'
    variant?: 'one' | 'two'
    thumbVariant?: 'default' | 'solid'
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    modelValue: 0,
    showValue: true,
    centerOrigin: undefined,
    size: 'md',
    orientation: 'horizontal',
    variant: 'one',
    thumbVariant: 'default',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
  iconClick: []
}>()

const isDragging = ref(false)
const isHovered = ref(false)
const innerValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal
  }
)

const isBipolar = computed(() => {
  if (props.centerOrigin !== undefined) return props.centerOrigin
  return props.min < 0 && props.max > 0
})

const range = computed(() => props.max - props.min)

const percentage = computed(() => {
  return ((innerValue.value - props.min) / range.value) * 100
})

const zeroPercentage = computed(() => {
  return ((0 - props.min) / range.value) * 100
})

const thumbWidth = computed(() => {
  switch (props.size) {
    case 'xs':
      return 12
    case 'sm':
      return 12
    case 'lg':
      return 16
    case 'md':
    default:
      return 14
  }
})

const getContainedPos = (p: number) => {
  const offset = thumbWidth.value / 2
  const width = thumbWidth.value
  return `calc(${p}% + (${offset}px - ${width * (p / 100)}px))`
}

const trackStyle = computed(() => {
  if (isBipolar.value) {
    const start = Math.min(percentage.value, zeroPercentage.value)
    const end = Math.max(percentage.value, zeroPercentage.value)

    const startPos = getContainedPos(start)
    const endPos = getContainedPos(end)

    if (props.orientation === 'vertical') {
      return {
        bottom: startPos,
        height: `calc(${endPos} - ${startPos})`,
      }
    } else {
      return {
        left: startPos,
        width: `calc(${endPos} - ${startPos})`,
      }
    }
  } else {
    if (props.orientation === 'vertical') {
      return {
        bottom: '0%',
        height: getContainedPos(percentage.value),
      }
    } else {
      return {
        left: '0%',
        width: getContainedPos(percentage.value),
      }
    }
  }
})

const trackRoundingClass = computed(() => {
  if (!isBipolar.value) return ''

  if (props.orientation === 'vertical') {
    if (innerValue.value < 0) return 'rounded-t-none'
    if (innerValue.value > 0) return 'rounded-b-none'
  } else {
    if (innerValue.value < 0) return 'rounded-r-none'
    if (innerValue.value > 0) return 'rounded-l-none'
  }

  return ''
})

const thumbStyle = computed(() => {
  if (props.orientation === 'vertical') {
    return {
      bottom: getContainedPos(percentage.value),
    }
  } else {
    return {
      left: getContainedPos(percentage.value),
    }
  }
})

const handleInput = () => {
  emit('update:modelValue', innerValue.value)
}

const handleChange = () => {
  emit('change', innerValue.value)
  isDragging.value = false
}

const isModified = computed(() => Math.abs(props.modelValue) > 0.001)

const handleReset = () => {
  if (props.disabled) return
  const resetValue = isBipolar.value ? 0 : props.min
  innerValue.value = resetValue
  emit('update:modelValue', resetValue)
  emit('change', resetValue)
}

const displayValue = computed(() => {
  const decimals = props.step.toString().split('.')[1]?.length || 0
  return innerValue.value.toFixed(decimals)
})

const sizeClasses = computed(() => {
  const isVertical = props.orientation === 'vertical'
  const sizes = {
    xs: {
      track: isVertical ? 'w-[2.85px] bg-gray-300' : 'h-[2.4px] bg-gray-300',
      thumb: 'w-[11.5px] h-[11.5px]',
      wrapper: isVertical ? 'w-4 min-h-[100px]' : 'h-4 w-full',
      tick: isVertical ? 'w-2.5 h-[1.85px]' : 'h-2.5 w-[2px]',
    },
    sm: {
      track: isVertical ? 'w-[4px] bg-gray-300' : 'h-[4px] bg-gray-300',
      thumb: 'w-[13px] h-[13px]',
      wrapper: isVertical ? 'w-4 min-h-[100px]' : 'h-4 w-full',
      tick: isVertical ? 'w-3 h-[2px]' : 'h-3 w-[2px]',
    },
    md: {
      track: isVertical ? 'w-1.5 bg-gray-250' : 'h-1.5 bg-gray-250',
      thumb: 'w-3.5 h-3.5',
      wrapper: isVertical ? 'w-6 min-h-[100px]' : 'h-6 w-full',
      tick: isVertical ? 'w-3.5 h-[2px]' : 'h-3.5 w-[2px]',
    },
    lg: {
      track: isVertical ? 'w-2 bg-gray-250' : 'h-2 bg-gray-250',
      thumb: 'w-4.5 h-4.5',
      wrapper: isVertical ? 'w-7 min-h-[100px]' : 'h-7 w-full',
      tick: isVertical ? 'w-4 h-[2px]' : 'h-4 w-[2px]',
    },
  }
  return sizes[props.size]
})

const displayLabel = computed(() => (props.labelI18n ? $t(props.labelI18n) : props.label))

const computedLabelClass = computed(() => {
  if (props.labelClass) return props.labelClass
  if (props.size === 'xs' || props.size === 'sm') {
    return 'text-muted-foreground text-xs font-normal'
  }
  return 'text-muted-foreground text-sm font-medium'
})

const computedValueClass = computed(() => {
  if (props.valueClass) return props.valueClass
  if (props.size === 'xs' || props.size === 'sm') {
    return 'text-muted-foreground text-xs font-normal'
  }
  return 'text-muted-foreground text-sm'
})
</script>

<template>
  <div
    class="slider-wrapper flex select-none touch-none"
    :class="[
      { 'opacity-50 pointer-events-none': disabled },
      props.orientation === 'vertical'
        ? 'flex-col items-center h-full py-2 gap-3'
        : props.variant === 'two'
          ? 'flex-col w-full gap-1'
          : 'w-full flex-row items-center gap-3',
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false">
    <div
      v-if="props.variant === 'two' && props.orientation !== 'vertical'"
      class="flex justify-between items-end w-full">
      <div
        v-if="displayLabel || icon"
        class="flex items-center gap-2 cursor-pointer transition-colors"
        :class="[{ 'text-primary': isDragging || isHovered }, computedLabelClass]"
        @click="emit('iconClick')"
        :title="`Double-click to reset`">
        <Icon v-if="icon" :icon="icon" class="h-4 w-4" />
        <label v-if="displayLabel" class="whitespace-nowrap cursor-pointer">
          {{ displayLabel }}
        </label>
      </div>
      <span
        @dblclick="handleReset"
        v-if="showValue"
        class="font-mono tabular-nums text-right min-w-6"
        :class="computedValueClass">
        {{ displayValue }}
      </span>
    </div>

    <div
      v-if="(props.variant !== 'two' || props.orientation === 'vertical') && (displayLabel || icon)"
      class="flex items-center gap-2 min-w-fit cursor-pointer transition-colors"
      :class="[{ 'text-primary': isDragging || isHovered }, computedLabelClass]"
      @click="emit('iconClick')"
      :title="`Double-click to reset`">
      <Icon v-if="icon" :icon="icon" class="h-4 w-4" />
      <label v-if="displayLabel" class="whitespace-nowrap cursor-pointer">
        {{ displayLabel }}
      </label>
    </div>

    <div
      class="relative flex justify-center items-center group"
      :class="[
        sizeClasses.wrapper,
        props.orientation === 'vertical' || props.variant !== 'two' ? 'flex-1' : '',
      ]">
      <div
        class="absolute rounded-full"
        :class="[
          sizeClasses.track,
          props.orientation === 'vertical'
            ? 'h-full left-1/2 transform -translate-x-1/2'
            : 'w-full top-1/2 transform -translate-y-1/2',
        ]"></div>

      <div
        v-if="isBipolar"
        class="absolute bg-muted-foreground/30 rounded z-0"
        :class="[
          sizeClasses.tick,
          props.orientation === 'vertical'
            ? 'left-1/2 transform -translate-x-1/2'
            : 'top-1/2 transform -translate-y-1/2',
        ]"
        :style="
          props.orientation === 'vertical'
            ? { bottom: getContainedPos(zeroPercentage) }
            : { left: getContainedPos(zeroPercentage) }
        "></div>

      <div
        class="absolute bg-primary rounded-full will-change-transform"
        :class="[
          {
            'bg-muted-foreground': disabled,
            'transition-all duration-75 ease-out': !isDragging,
            'duration-0': isDragging,
          },
          sizeClasses.track,
          trackRoundingClass,
          props.orientation === 'vertical'
            ? 'left-1/2 transform -translate-x-1/2'
            : 'top-1/2 transform -translate-y-1/2',
        ]"
        :style="trackStyle"></div>

      <div
        class="absolute rounded-full pointer-events-none transition-transform duration-100 ease-out z-10"
        :class="[
          props.thumbVariant === 'solid'
            ? 'bg-primary'
            : 'bg-background border border-gray-400/90 shadow-sm',
          {
            'border-primary shadow-md scale-110': isDragging && props.thumbVariant !== 'solid',
            'scale-110': isDragging && props.thumbVariant === 'solid',
            'border-primary': isModified && props.thumbVariant !== 'solid',
            'bg-muted-foreground': disabled && props.thumbVariant === 'solid',
          },
          sizeClasses.thumb,
          props.orientation === 'vertical'
            ? 'left-1/2 transform -translate-x-1/2 translate-y-1/2'
            : 'top-1/2 -ml-px transform -translate-y-1/2 -translate-x-1/2',
        ]"
        :style="thumbStyle"></div>

      <input
        type="range"
        v-model.number="innerValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @input="handleInput"
        @change="handleChange"
        @mousedown="isDragging = true"
        @touchstart="isDragging = true"
        @mouseup="isDragging = false"
        @touchend="isDragging = false"
        class="slider-input absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0 p-0"
        :orient="props.orientation === 'vertical' ? 'vertical' : undefined"
        :style="
          props.orientation === 'vertical'
            ? 'appearance: slider-vertical; -webkit-appearance: slider-vertical;'
            : ''
        " />
    </div>

    <span
      @dblclick="handleReset"
      v-if="(props.variant !== 'two' || props.orientation === 'vertical') && showValue"
      class="font-mono tabular-nums text-right min-w-6"
      :class="computedValueClass">
      {{ displayValue }}
    </span>
  </div>
</template>
