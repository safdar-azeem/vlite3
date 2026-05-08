<script setup lang="ts">
import { ref } from 'vue'
import { Carousel } from '@/components/Carousel'
import DemoSection from '../DemoSection.vue'
import ChartControlPanel from './charts/ChartControlPanel.vue'
import type { ControlItem } from './charts/ChartControlPanel.vue'
import sourceCode from './CarouselDemo.vue?raw'

// ── Horizontal Data ──────────────────────────────────────────
const horizontalBanners = [
  {
    title: 'Ship Faster',
    subtitle: 'Production-ready Vue 3 components. Copy and paste.',
  },
  {
    title: 'Built for Performance',
    subtitle: 'Virtual DOM recycling and lazy rendering architecture.',
  },
  {
    title: 'Dark Mode First',
    subtitle: 'Automatic theme switching. No manual prefixes needed.',
  },
  {
    title: 'Highly Customizable',
    subtitle: 'Tweak every detail to perfectly match your brand.',
  },
]

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
  mousewheel: false,
  speed: 500,
})

const hControls: ControlItem[] = [
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
  { key: 'itemsToShow', label: 'Items to Show', type: 'slider', min: 1, max: 4, step: 1 },
  { key: 'gap', label: 'Gap (px)', type: 'slider', min: 0, max: 48, step: 4 },
  { key: 'autoPlay', label: 'Autoplay', type: 'toggle' },
  { key: 'loop', label: 'Loop', type: 'toggle' },
  { key: 'draggable', label: 'Draggable', type: 'toggle' },
  { key: 'mousewheel', label: 'Mousewheel', type: 'toggle' },
  { key: 'speed', label: 'Speed (ms)', type: 'slider', min: 100, max: 1500, step: 100 },
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
  <div class="flex flex-col w-full space-y-2 pb-20">
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

    <!-- ── 1. Horizontal Carousel ──────────────────────────────────────── -->
    <DemoSection title="Horizontal Carousel" :code="sourceCode">
      <div class="w-full space-y-4">
        <ChartControlPanel :controls="hControls" v-model="hOpts" />

        <div class="w-full p-6 border border-border bg-card rounded-xl">
          <!-- Using key to force remount if vue-carousel-lite doesn't react to all props properly -->
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
              <div class="w-full flex flex-col items-center justify-center rounded-xl select-none bg-muted/30 border border-border/50" style="height: 320px">
                <h3 class="text-2xl md:text-4xl font-bold text-foreground mb-3 tracking-tight text-center px-4">
                  {{ item.title }}
                </h3>
                <p class="text-sm md:text-base text-muted-foreground max-w-md text-center px-4">
                  {{ item.subtitle }}
                </p>
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </DemoSection>

    <!-- ── 2. Vertical Carousel ────────────────────────────────────────── -->
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
  </div>
</template>

