<script setup lang="ts">
import { ref } from 'vue'
import { Carousel } from '@/components/Carousel'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from '../charts/ChartControlPanel.vue'
import type { ControlItem } from '../charts/ChartControlPanel.vue'
import sourceCode from './HorizontalCarouselDemo.vue?raw'

// ── Horizontal Data ──────────────────────────────────────────
const horizontalBanners = [1, 2, 3, 4, 5, 6]

// ── Controls for Horizontal ──────────────────────────────────
const hOpts = ref<Record<string, unknown>>({
  itemsToShow: 1,
  gap: 16,
  pagination: 'dots',
  paginationPosition: 'bottom-center',
  autoPlay: false,
  autoPlayInterval: 3000,
  loop: true,
  draggable: true,
  mousewheel: true,
  speed: 700,
})

const hControls: ControlItem[] = [
  {
    key: 'pagination',
    label: 'Pagination',
    type: 'select',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Dots', value: 'dots' },
      { label: 'Buttons', value: 'buttons' },
      { label: 'Lines', value: 'lines' },
      { label: 'Fraction', value: 'fraction' },
    ],
  },
  {
    key: 'paginationPosition',
    label: 'Position',
    type: 'select',
    options: [
      { label: 'Center', value: 'center' },
      { label: 'Bottom Center', value: 'bottom-center' },
      { label: 'Bottom Left', value: 'bottom-left' },
      { label: 'Bottom Right', value: 'bottom-right' },
      { label: 'Center Right', value: 'center-right' },
      { label: 'Bottom', value: 'bottom' },
    ],
  },
  { key: 'itemsToShow', label: 'Items to Show', type: 'slider', min: 1, max: 4, step: 1 },
  { key: 'gap', label: 'Gap (px)', type: 'slider', min: 0, max: 48, step: 4 },
  { key: 'autoPlay', label: 'Autoplay', type: 'toggle' },
  { key: 'loop', label: 'Loop', type: 'toggle' },
  { key: 'draggable', label: 'Draggable', type: 'toggle' },
  { key: 'mousewheel', label: 'Mousewheel', type: 'toggle' },
  { key: 'speed', label: 'Speed (ms)', type: 'slider', min: 100, max: 1500, step: 100 },
]
</script>

<template>
  <DemoSection title="Horizontal Carousel" :code="sourceCode">
    <div class="w-full space-y-4">
      <ChartControlPanel :controls="hControls" v-model="hOpts" />

      <div class="w-full p-6 border border-border bg-card rounded-xl">
        <Carousel
          :key="JSON.stringify(hOpts)"
          :data="horizontalBanners"
          direction="horizontal"
          :pagination="(hOpts.pagination === 'none' ? false : hOpts.pagination) as any"
          :pagination-position="hOpts.paginationPosition as string"
          :items-to-show="hOpts.itemsToShow as number"
          :gap="hOpts.gap as number"
          :auto-play="hOpts.autoPlay as boolean"
          :auto-play-interval="hOpts.autoPlayInterval as number"
          :loop="hOpts.loop as boolean"
          :draggable="hOpts.draggable as boolean"
          :mousewheel="hOpts.mousewheel as boolean"
          :speed="hOpts.speed as number"
          easing="ease-out">
          <template #default="{ item }">
            <div
              class="w-full flex flex-col items-center justify-center rounded-xl select-none bg-muted/30 border border-border/50"
              style="height: 320px">
              <h3
                class="text-2xl md:text-4xl font-bold text-foreground mb-3 tracking-tight text-center px-4">
                {{ item }}
              </h3>
            </div>
          </template>
        </Carousel>
      </div>
    </div>
  </DemoSection>
</template>
