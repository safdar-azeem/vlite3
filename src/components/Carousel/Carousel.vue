<script setup lang="ts">
import { ref, computed } from 'vue'
import VueCarouselLite from 'vue-carousel-lite'
import 'vue-carousel-lite/style.css'
import type { CarouselProps } from './types'

const props = withDefaults(defineProps<CarouselProps>(), {
  data: () => [],
  pagination: 'dots',
  paginationSize: 'md',
  paginationPosition: 'bottom-center',
  direction: 'horizontal',
  autoPlay: false,
  draggable: false,
  autoPlayInterval: 3000,
  itemsToShow: 1,
  gap: 0,
  speed: 300,
  easing: 'ease',
  mousewheel: true,
  loop: false,
  currentItem: 0,
  bufferSize: 5,
  maxDomElements: 10,
  updateKey: undefined,
})

const emit = defineEmits<{
  (e: 'slide-change', index: number): void
}>()

const carouselRef = ref<any>(null)

// Expose methods
const goToSlide = (index: number, smooth?: boolean) => {
  carouselRef.value?.goToSlide(index, smooth)
}

const goNext = (smooth?: boolean) => {
  carouselRef.value?.goNext(smooth)
}

const goPrev = (smooth?: boolean) => {
  carouselRef.value?.goPrev(smooth)
}

const goNextPage = (smooth?: boolean) => {
  carouselRef.value?.goNextPage(smooth)
}

const goPrevPage = (smooth?: boolean) => {
  carouselRef.value?.goPrevPage(smooth)
}

defineExpose({
  goToSlide,
  goNext,
  goPrev,
  goNextPage,
  goPrevPage,
})
</script>

<template>
  <div class="carousel-wrapper">
    <VueCarouselLite
      ref="carouselRef"
      v-bind="props as any"
      style="height: 100%; width: 100%"
      @slide-change="(index) => emit('slide-change', index)">
      <!-- Pass through all slots -->
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </VueCarouselLite>
  </div>
</template>

<style scoped>
.carousel-wrapper {
  width: 100%;
  position: relative;
}
</style>
