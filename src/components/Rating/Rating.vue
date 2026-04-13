<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { RatingProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  max: 5,
  allowHalf: false,
  readonly: false,
  showText: false,
  icon: 'lucide:star',
  activeIcon: 'lucide:star',
  activeColor: 'text-amber-400',
  inactiveColor: 'text-muted-foreground/30',
  size: 'md',
  clearable: false,
  disabled: false,
  solid: true
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number]
  'hover': [value: number]
}>()

const hoverValue = ref(0)
const displayValue = computed(() => (hoverValue.value > 0 ? hoverValue.value : props.modelValue))

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

type CustomIcon = string | string[]

const getIcon = (val: number, type: 'active' | 'inactive') => {
  const iconSource: CustomIcon = type === 'active' ? props.activeIcon : props.icon
  if (Array.isArray(iconSource)) {
    // If we have hover value or model value, we might want all icons to match the active state
    // For emojis, typically you want the current selected emoji to show for all OR individual
    // We'll map by index for individual
    return iconSource[Math.min(val - 1, iconSource.length - 1)]
  }
  return iconSource
}

// For cases where one global icon should show for the whole row (like Emoji reactions where all become 'happy')
// But wait, the standard way is mapping index icon, so we leave it as is.

const handleMouseMove = (e: MouseEvent, val: number) => {
  if (props.readonly || props.disabled) return
  
  if (props.allowHalf) {
    const target = e.currentTarget as HTMLElement
    // Only calculate half if the target is the container, not inner parts, but isolate handles it usually
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const value = x < rect.width / 2 ? val - 0.5 : val
    
    if (hoverValue.value !== value) {
      hoverValue.value = value
      emit('hover', value)
    }
  } else {
    if (hoverValue.value !== val) {
      hoverValue.value = val
      emit('hover', val)
    }
  }
}

const handleMouseLeave = () => {
  if (props.readonly || props.disabled) return
  hoverValue.value = 0
  emit('hover', 0)
}

const handleClick = (val: number) => {
  if (props.readonly || props.disabled) return
  
  let newValue = hoverValue.value || val
  
  if (props.clearable && props.modelValue === newValue) {
    newValue = 0
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const calculateFill = (val: number) => {
  const diff = displayValue.value - val + 1
  if (diff >= 1) return 100
  if (diff > 0) return diff * 100
  return 0
}
</script>

<template>
  <div 
    class="inline-flex items-center gap-1.5" 
    :class="[props.class, { 'opacity-50 cursor-not-allowed': disabled }]" 
    @mouseleave="handleMouseLeave"
  >
    <div
      v-for="val in max"
      :key="val"
      class="relative flex items-center justify-center isolate transition-transform"
      :class="{ 
        'cursor-pointer hover:scale-110 active:scale-95': !readonly && !disabled,
        'cursor-default pointer-events-none': readonly || disabled 
      }"
      @mousemove="handleMouseMove($event, val)"
      @click="handleClick(val)"
    >
      <!-- Base Icon (Inactive) -->
      <Icon
        :icon="getIcon(val, 'inactive')"
        :class="[sizeClasses[size], inactiveColor]"
      />
      
      <!-- Colored Icon (Active) - Overlay with clip-path for partial fill -->
      <div 
        class="absolute inset-0 overflow-hidden"
        :style="{ width: `${calculateFill(val)}%` }"
      >
        <Icon
          :icon="getIcon(val, 'active')"
          :class="[sizeClasses[size], activeColor, { 'is-solid': solid }]"
        />
      </div>
    </div>
    
    <slot name="text" :value="displayValue" :max="max">
      <span v-if="showText" class="ml-2 text-sm text-foreground/80 font-medium whitespace-nowrap">
        {{ displayValue }} <span class="text-xs text-muted-foreground font-normal">/ {{ max }}</span>
      </span>
    </slot>
  </div>
</template>

<style scoped>
.is-solid :deep(path),
.is-solid :deep(polygon),
.is-solid :deep(circle),
.is-solid :deep(rect) {
  fill: currentColor !important;
}
</style>
