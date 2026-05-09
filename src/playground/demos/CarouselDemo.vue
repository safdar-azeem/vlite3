<script setup lang="ts">
import HorizontalCarouselDemo from './carousel/HorizontalCarouselDemo.vue'
import VerticalCarouselDemo from './carousel/VerticalCarouselDemo.vue'
import MultiPaginationDemo from './carousel/MultiPaginationDemo.vue'
</script>

<template>
  <div class="flex flex-col w-full space-y-12 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col space-y-2 pb-6 mb-6 border-b border-border/30">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">Carousel</span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Carousel</h2>
      <p class="text-lg text-muted-foreground max-w-[70ch]">
        A highly customizable carousel component supporting both horizontal and vertical modes,
        autoplay, loop, and interactive controls.
      </p>
    </div>

    <HorizontalCarouselDemo />
    <VerticalCarouselDemo />
    <MultiPaginationDemo />
  </div>
</template>
