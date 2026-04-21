<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Icon from '../Icon.vue'

const props = withDefaults(
  defineProps<{
    beforeImage: string
    afterImage: string
    beforeLabel?: string
    afterLabel?: string
    initialPosition?: number
    hover?: boolean
    width?: string | number
    height?: string | number
    containerClass?: string
    handleClass?: string
  }>(),
  {
    beforeLabel: 'Before',
    afterLabel: 'After',
    initialPosition: 50,
    hover: false,
    width: '100%',
    height: 'auto',
    containerClass: '',
    handleClass: '',
  }
)

const sliderPosition = ref(props.initialPosition)
const isDragging = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const handleMove = (clientX: number) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = clientX - rect.left
  const position = (x / rect.width) * 100
  sliderPosition.value = Math.max(0, Math.min(100, position))
}

const onContainerMouseMove = (e: MouseEvent) => {
  if (props.hover && !isDragging.value) {
    handleMove(e.clientX)
  }
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  handleMove(clientX)
}

const onWindowMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  if ('touches' in e && e.cancelable) {
    e.preventDefault() // Prevent scrolling while dragging on touch devices
  }

  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  handleMove(clientX)
}

const stopDrag = () => {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onWindowMove)
  window.addEventListener('touchmove', onWindowMove, { passive: false })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onWindowMove)
  window.removeEventListener('touchmove', onWindowMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchend', stopDrag)
})

const containerStyle = computed(() => {
  const parseSize = (val: string | number) => (typeof val === 'number' ? `${val}px` : val)
  return {
    width: parseSize(props.width),
    height: parseSize(props.height),
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative overflow-hidden select-none cursor-ew-resize rounded-2xl group"
    :class="containerClass"
    :style="containerStyle"
    @mousemove="onContainerMouseMove"
    @mousedown="startDrag"
    @touchstart.passive="startDrag">
    <!-- After Image (Background) -->
    <img
      :src="afterImage"
      class="block w-full object-cover select-none"
      :class="props.height === 'auto' ? 'h-auto' : 'h-full'"
      alt="After"
      draggable="false" />

    <!-- After Label -->
    <div
      v-if="afterLabel"
      class="absolute top-4 right-4 bg-[#4846468d] px-3 py-1 -text-fs-4 rounded-full text-sm font-medium text-[white] transition-opacity duration-300 pointer-events-none"
      :class="sliderPosition > 80 ? 'opacity-0' : 'opacity-100'">
      {{ afterLabel }}
    </div>

    <!-- Before Image (Foreground with clip-path) -->
    <div
      class="absolute inset-0 w-full h-full"
      :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, willChange: 'clip-path' }">
      <img
        :src="beforeImage"
        class="absolute inset-0 w-full h-full object-cover select-none"
        alt="Before"
        draggable="false" />
    </div>

    <!-- Before Label -->
    <div
      v-if="beforeLabel"
      class="absolute top-4 left-4 bg-[#4846468d] px-3 py-1 -text-fs-4 rounded-full text-sm font-medium text-[white] transition-opacity duration-300 pointer-events-none z-10"
      :class="sliderPosition < 20 ? 'opacity-0' : 'opacity-100'">
      {{ beforeLabel }}
    </div>

    <!-- Slider Handle Line -->
    <div
      class="absolute top-0 bottom-0 flex flex-col items-center justify-center cursor-ew-resize z-20 pointer-events-none"
      :style="{
        left: `${sliderPosition}%`,
        transform: 'translateX(-50%)',
        willChange: 'transform',
      }">
      <!-- Top Line -->
      <div class="w-px h-full bg-[white]"></div>

      <!-- Handle Knob (Transparent) -->
      <div
        class="w-7 h-7 border-[1.5px] border-[white] rounded-full flex-shrink-0 flex items-center justify-center transform transition-all duration-200"
        :class="[isDragging ? 'scale-110 ' : 'group-hover:scale-105', handleClass]">
        <Icon icon="lucide:chevrons-left-right" class="w-4 h-4 text-[white]" v-once />
      </div>

      <!-- Bottom Line -->
      <div class="w-px h-full bg-[white]"></div>
    </div>
  </div>
</template>
