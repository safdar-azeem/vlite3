<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Icon from '../Icon.vue'

const props = withDefaults(
  defineProps<{
    beforeImage: string
    afterImage: string
    beforeLabel?: string
    afterLabel?: string
    initialPosition?: number
    hover?: boolean
  }>(),
  {
    beforeLabel: 'Before',
    afterLabel: 'After',
    initialPosition: 50,
    hover: false,
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
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full overflow-hidden select-none cursor-ew-resize rounded-2xl shadow-xl group"
    @mousemove="onContainerMouseMove"
    @mousedown="startDrag"
    @touchstart.passive="startDrag"
  >
    <!-- After Image (Background) -->
    <img
      :src="afterImage"
      class="block w-full h-auto object-cover select-none"
      alt="After"
      draggable="false"
    />

    <!-- After Label -->
    <div
      v-if="afterLabel"
      class="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-sm transition-opacity duration-300 pointer-events-none"
      :class="sliderPosition > 80 ? 'opacity-0' : 'opacity-100'"
    >
      {{ afterLabel }}
    </div>

    <!-- Before Image (Foreground with clip-path) -->
    <div
      class="absolute inset-0 w-full h-full"
      :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }"
    >
      <img
        :src="beforeImage"
        class="absolute inset-0 w-full h-full object-cover select-none"
        alt="Before"
        draggable="false"
      />
    </div>

    <!-- Before Label -->
    <div
      v-if="beforeLabel"
      class="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-sm transition-opacity duration-300 pointer-events-none z-10"
      :class="sliderPosition < 20 ? 'opacity-0' : 'opacity-100'"
    >
      {{ beforeLabel }}
    </div>

    <!-- Slider Handle Line -->
    <div
      class="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
      :style="{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }"
    >
      <!-- Handle Knob -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-200"
        :class="isDragging ? 'scale-110 bg-white/20' : 'group-hover:scale-105'"
      >
        <Icon icon="lucide:chevrons-left-right" class="w-6 h-6 text-white drop-shadow-md" />
      </div>
    </div>
  </div>
</template>
