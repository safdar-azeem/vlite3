<script setup lang="ts">
import { ref } from 'vue'
import { Carousel } from '@/components/Carousel'
import DemoSection from '../../DemoSection.vue'
import ChartControlPanel from '../charts/ChartControlPanel.vue'
import type { ControlItem } from '../charts/ChartControlPanel.vue'
import sourceCode from './VerticalCarouselDemo.vue?raw'

// ── Vertical Data ────────────────────────────────────────────
const verticalReels = [
  {
    user: 'sarah_designs',
    caption: 'Building a full dashboard in 10 minutes ✨',
    likes: '12.4K',
    comments: '342',
  },
  {
    user: 'dev_marcus',
    caption: 'This carousel component is insane 🔥 #vuejs',
    likes: '8.7K',
    comments: '198',
  },
  {
    user: 'ui_craft',
    caption: 'Dark mode that just works 🌙',
    likes: '15.1K',
    comments: '567',
  },
  {
    user: 'code_ninja',
    caption: 'Virtual scrolling on 10,000 items. Zero lag 🚀',
    likes: '22.3K',
    comments: '891',
  },
]

// ── Controls for Vertical ────────────────────────────────────
const vOpts = ref<Record<string, unknown>>({
  itemsToShow: 1,
  gap: 16,
  pagination: 'none',
  paginationPosition: 'center-right',
  autoPlay: false,
  autoPlayInterval: 3000,
  loop: false,
  draggable: true,
  mousewheel: true,
  speed: 500,
})

const vControls: ControlItem[] = [
  { key: 'pagination', label: 'Pagination', type: 'select', options: [
      { label: 'None', value: 'none' },
      { label: 'Dots', value: 'dots' },
      { label: 'Buttons', value: 'buttons' },
      { label: 'Lines', value: 'lines' },
      { label: 'Fraction', value: 'fraction' }
    ] },
  { key: 'paginationPosition', label: 'Position', type: 'select', options: [
      { label: 'Center', value: 'center' },
      { label: 'Bottom Center', value: 'bottom-center' },
      { label: 'Bottom Left', value: 'bottom-left' },
      { label: 'Bottom Right', value: 'bottom-right' },
      { label: 'Center Right', value: 'center-right' },
      { label: 'Bottom', value: 'bottom' }
    ] },
  { key: 'itemsToShow', label: 'Items to Show', type: 'slider', min: 1, max: 3, step: 1 },
  { key: 'gap', label: 'Gap (px)', type: 'slider', min: 0, max: 48, step: 4 },
  { key: 'autoPlay', label: 'Autoplay', type: 'toggle' },
  { key: 'loop', label: 'Loop', type: 'toggle' },
  { key: 'draggable', label: 'Draggable', type: 'toggle' },
  { key: 'mousewheel', label: 'Mousewheel', type: 'toggle' },
  { key: 'speed', label: 'Speed (ms)', type: 'slider', min: 100, max: 1500, step: 100 },
]
</script>

<template>
  <DemoSection title="Vertical Carousel" :code="sourceCode">
    <div class="w-full space-y-4">
      <ChartControlPanel :controls="vControls" v-model="vOpts" />

      <div class="w-full p-6 border border-border bg-card rounded-xl flex justify-center">
        <div class="w-[320px]">
          <Carousel
            :key="JSON.stringify(vOpts)"
            :data="verticalReels"
            direction="vertical"
            :pagination="(vOpts.pagination === 'none' ? false : vOpts.pagination) as any"
            :pagination-position="vOpts.paginationPosition as string"
            :items-to-show="vOpts.itemsToShow as number"
            :gap="vOpts.gap as number"
            :auto-play="vOpts.autoPlay as boolean"
            :auto-play-interval="vOpts.autoPlayInterval as number"
            :loop="vOpts.loop as boolean"
            :draggable="vOpts.draggable as boolean"
            :mousewheel="vOpts.mousewheel as boolean"
            :speed="vOpts.speed as number"
            easing="ease-out">
            <template #default="{ item }">
              <div class="relative w-full overflow-hidden rounded-xl select-none bg-muted/30 border border-border/50" style="height: 480px">
                <!-- Bottom content -->
                <div class="absolute bottom-0 left-0 right-0 p-5 z-10 bg-gradient-to-t from-background/90 to-transparent">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {{ item.user[0].toUpperCase() }}
                    </div>
                    <span class="text-foreground text-sm font-semibold">@{{ item.user }}</span>
                  </div>
                  <p class="text-foreground/90 text-sm leading-relaxed mb-4">{{ item.caption }}</p>
                  <div class="flex items-center gap-5 text-muted-foreground text-xs font-medium">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {{ item.likes }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      {{ item.comments }}
                    </span>
                  </div>
                </div>
                
                <!-- Video Placeholder Centered icon -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center backdrop-blur-sm">
                    <svg class="w-8 h-8 text-foreground/70 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
