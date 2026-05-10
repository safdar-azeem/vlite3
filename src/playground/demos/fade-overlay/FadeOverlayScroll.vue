<script setup lang="ts">
import { ref } from 'vue'
import { FadeOverlay } from '@/components/FadeOverlay'

const topCoverage = ref(60)
const bottomCoverage = ref(80)
const showTop = ref(true)
const showBottom = ref(true)

const items = [
  { name: 'Sunrise Peak', distance: '2.3 km', elevation: '160m', icon: '🏔' },
  { name: 'Crystal Lake', distance: '4.6 km', elevation: '280m', icon: '💎' },
  { name: 'Eagle Ridge', distance: '6.9 km', elevation: '400m', icon: '🦅' },
  { name: 'Pine Valley', distance: '9.2 km', elevation: '520m', icon: '🌲' },
  { name: 'Thunder Falls', distance: '11.5 km', elevation: '640m', icon: '⚡' },
  { name: 'Silver Meadow', distance: '13.8 km', elevation: '760m', icon: '✨' },
  { name: 'Wolf Creek', distance: '16.1 km', elevation: '880m', icon: '🐺' },
  { name: 'Boulder Pass', distance: '18.4 km', elevation: '1000m', icon: '🪨' },
  { name: 'Glacier Point', distance: '20.7 km', elevation: '1120m', icon: '🧊' },
  { name: 'Summit Trail', distance: '23.0 km', elevation: '1240m', icon: '⛰' },
  { name: 'Fox Hollow', distance: '25.3 km', elevation: '1360m', icon: '🦊' },
  { name: 'Moss Canyon', distance: '27.6 km', elevation: '1480m', icon: '🌿' },
  { name: 'Hawk Bluff', distance: '29.9 km', elevation: '1600m', icon: '🦅' },
  { name: 'Cascade Steps', distance: '32.2 km', elevation: '1720m', icon: '💧' },
  { name: 'Starlight Ridge', distance: '34.5 km', elevation: '1840m', icon: '⭐' },
]
</script>

<template>
  <div class="flex flex-col">
    <p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
      02 — Scroll-edge fade
    </p>
    <div class="relative rounded-2xl overflow-hidden bg-card border border-border">
      <!-- Scrollable list -->
      <div class="h-[300px] overflow-y-auto p-5">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="flex items-center gap-3.5 py-3 border-b border-border/40 last:border-0">
          <div
            class="w-10 h-10 rounded-xl shrink-0 bg-secondary flex items-center justify-center text-base">
            {{ item.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="m-0 text-[13px] font-medium text-foreground">{{ item.name }}</p>
            <p class="m-0 text-[11px] text-muted-foreground">
              {{ item.distance }} · {{ item.elevation }} elevation
            </p>
          </div>
          <div
            class="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider shrink-0">
            #{{ i + 1 }}
          </div>
        </div>
      </div>

      <!-- Top fade -->
      <FadeOverlay
        v-if="showTop"
        direction="top"
        :coverage="`${topCoverage}px`"
        color="var(--color-card)"
        easing="smooth" />

      <!-- Bottom fade -->
      <FadeOverlay
        v-if="showBottom"
        direction="bottom"
        :coverage="`${bottomCoverage}px`"
        color="var(--color-card)"
        easing="smooth" />
    </div>

    <!-- Controls -->
    <div class="mt-4 flex flex-col gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
          <input type="checkbox" v-model="showTop" class="w-3.5 h-3.5 accent-foreground cursor-pointer" />
          top
        </label>
        <label class="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
          <input type="checkbox" v-model="showBottom" class="w-3.5 h-3.5 accent-foreground cursor-pointer" />
          bottom
        </label>
      </div>

      <label class="text-xs text-muted-foreground flex justify-between">
        top coverage
        <span class="text-muted-foreground/60">{{ topCoverage }}px</span>
      </label>
      <input type="range" min="20" max="150" v-model.number="topCoverage" class="w-full" />

      <label class="text-xs text-muted-foreground flex justify-between">
        bottom coverage
        <span class="text-muted-foreground/60">{{ bottomCoverage }}px</span>
      </label>
      <input type="range" min="20" max="150" v-model.number="bottomCoverage" class="w-full" />
    </div>
  </div>
</template>
