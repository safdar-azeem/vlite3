<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    label?: string
    icon?: string
    disabled?: boolean
    showValue?: boolean
    modelValue?: number
    labelClass?: string
    centerOrigin?: boolean
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    modelValue: 0,
    showValue: true,
    centerOrigin: undefined,
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

const getContainedPos = (p: number) => {
  return `calc(${p}% + (8px - ${p * 0.16}px))`
}

const trackStyle = computed(() => {
  if (isBipolar.value) {
    const start = Math.min(percentage.value, zeroPercentage.value)
    const end = Math.max(percentage.value, zeroPercentage.value)

    const startPos = getContainedPos(start)
    const endPos = getContainedPos(end)

    return {
      left: startPos,
      width: `calc(${endPos} - ${startPos})`,
    }
  } else {
    return {
      left: '0%',
      width: getContainedPos(percentage.value),
    }
  }
})

const thumbStyle = computed(() => {
  return {
    left: getContainedPos(percentage.value),
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
</script>

<template>
  <div
    class="slider-wrapper flex items-center gap-3 w-full select-none touch-none"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false">
    <div
      v-if="label || icon"
      class="flex items-center gap-2 min-w-fit cursor-pointer transition-colors"
      :class="[{ 'text-primary': isDragging || isHovered }, labelClass || 'text-muted-foreground']"
      @click="emit('iconClick')"
      :title="`Double-click to reset`">
      <Icon v-if="icon" :icon="icon" class="h-4 w-4" />
      <label v-if="label" class="text-sm font-medium whitespace-nowrap cursor-pointer">
        {{ label }}
      </label>
    </div>

    <div class="relative flex-1 h-6 flex items-center group">
      <!-- Track Background -->
      <div class="absolute w-full h-1.5 bg-secondary rounded-full overflow-hidden"></div>

      <!-- Zero Tick for Bipolar -->
      <div
        v-if="isBipolar"
        class="absolute top-1/2 h-1.5 w-0.5 bg-muted-foreground/30 rounded transform -translate-y-1/2 z-0"
        :style="{ left: getContainedPos(zeroPercentage) }"></div>

      <!-- Active Track -->
      <div
        class="absolute h-1.5 bg-primary rounded-full transition-all duration-75 ease-out will-change-transform"
        :class="{ 'bg-muted-foreground': disabled }"
        :style="trackStyle"></div>

      <!-- Thumb -->
      <div
        class="absolute top-1/2 w-4 h-4 bg-background border border-border shadow-sm rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-100 ease-out z-10"
        :class="{
          'border-primary shadow-md scale-110': isDragging,
          'border-primary': isModified,
        }"
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
        class="slider-input absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0 p-0" />
    </div>

    <span
      @dblclick="handleReset"
      v-if="showValue"
      class="font-mono tabular-nums text-muted-foreground text-right min-w-[1.5rem] text-sm">
      {{ displayValue }}
    </span>
  </div>
</template>
