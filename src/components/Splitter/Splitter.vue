<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  layout?: 'horizontal' | 'vertical'
  modelValue?: number
  min?: number
  max?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  modelValue: 50,
  min: 10,
  max: 90,
  class: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const currentSplit = ref(props.modelValue)
let rafId: number | null = null

const startPaneStyle = computed(() => {
  return props.layout === 'horizontal'
    ? { width: `${currentSplit.value}%` }
    : { height: `${currentSplit.value}%` }
})

const endPaneStyle = computed(() => {
  return props.layout === 'horizontal'
    ? { width: `${100 - currentSplit.value}%` }
    : { height: `${100 - currentSplit.value}%` }
})

const handleInteractionStart = (e: MouseEvent | TouchEvent) => {
  // Prevent actual multi-touch scrolling if touch
  if (e.cancelable && e.type !== 'touchstart') {
    e.preventDefault()
  }
  isDragging.value = true
  document.body.style.cursor = props.layout === 'horizontal' ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'

  window.addEventListener('mousemove', handleInteractionMove, { passive: false })
  window.addEventListener('mouseup', handleInteractionEnd)
  window.addEventListener('touchmove', handleInteractionMove, { passive: false })
  window.addEventListener('touchend', handleInteractionEnd)
}

const handleInteractionMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !containerRef.value) return
  
  if (e.cancelable) {
    e.preventDefault() // prevent scrolling while dragging
  }

  if (rafId) cancelAnimationFrame(rafId)

  rafId = requestAnimationFrame(() => {
    const rect = containerRef.value!.getBoundingClientRect()
    
    let clientX, clientY;
    if (window.TouchEvent && e instanceof TouchEvent) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
    }
  
    let newSplit = 0
    if (props.layout === 'horizontal') {
      const x = clientX - rect.left
      newSplit = (x / rect.width) * 100
    } else {
      const y = clientY - rect.top
      newSplit = (y / rect.height) * 100
    }
  
    // Constrain based on min/max
    if (newSplit < props.min) newSplit = props.min
    if (newSplit > props.max) newSplit = props.max
  
    currentSplit.value = newSplit
    emit('update:modelValue', newSplit)
  })
}

const handleInteractionEnd = () => {
  isDragging.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  
  window.removeEventListener('mousemove', handleInteractionMove)
  window.removeEventListener('mouseup', handleInteractionEnd)
  window.removeEventListener('touchmove', handleInteractionMove)
  window.removeEventListener('touchend', handleInteractionEnd)
}

onUnmounted(() => {
  handleInteractionEnd()
})
</script>

<template>
  <div
    ref="containerRef"
    class="flex w-full h-full overflow-hidden"
    :class="[props.layout === 'vertical' ? 'flex-col' : 'flex-row', props.class]">
    
    <!-- Start Pane -->
    <div class="relative overflow-hidden" style="will-change: transform; contain: layout style;" :style="startPaneStyle">
      <slot name="start" />
    </div>

    <!-- Resizer Handle -->
    <div
      class="flex items-center justify-center bg-border/40 hover:bg-primary/50 transition-colors z-10 shrink-0 touch-none"
      :class="[
        props.layout === 'horizontal' 
          ? 'w-1.5 cursor-col-resize h-full mx-px' 
          : 'h-1.5 cursor-row-resize w-full my-px',
        isDragging ? 'bg-primary/80!' : ''
      ]"
      @mousedown="handleInteractionStart"
      @touchstart="handleInteractionStart">
      <!-- Optional drag visual indicator -->
      <div 
        class="bg-muted-foreground/30 rounded-full"
        :class="props.layout === 'horizontal' ? 'h-8 w-0.5' : 'w-8 h-0.5'">
      </div>
    </div>

    <!-- End Pane -->
    <div class="relative overflow-hidden flex-1" style="will-change: transform; contain: layout style;" :style="endPaneStyle">
      <slot name="end" />
    </div>

  </div>
</template>
