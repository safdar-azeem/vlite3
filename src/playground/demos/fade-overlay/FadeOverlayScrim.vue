<script setup lang="ts">
import { ref, computed } from 'vue'
import { FadeOverlay } from '@/components/FadeOverlay'
import type { Direction, Easing } from '@/components/FadeOverlay/types'

const coverage = ref(100)
const fadeStart = ref(45)
const direction = ref<Direction>('bottom')
const easing = ref<Easing>('smooth')
const opacity = ref(1)

const directionLabel = computed(() => {
  const map: Record<Direction, string> = {
    top: '↑ Top',
    bottom: '↓ Bottom',
    left: '← Left',
    right: '→ Right',
  }
  return map[direction.value]
})
</script>

<template>
  <div class="flex flex-col">
    <p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
      01 — Image scrim
    </p>
    <div class="relative overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-900 group">
      <img
        src="https://plus.unsplash.com/premium_photo-1751906599954-2f814f94676c?q=80&w=985&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Mountain"
        class="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-105" />

      <FadeOverlay
        :direction="direction"
        :coverage="`${coverage}%`"
        :fadeStart="`${fadeStart}%`"
        fadeEnd="100%"
        color="#000000"
        :easing="easing"
        :opacity="opacity" />

      <!-- Card text -->
      <div class="absolute bottom-0 inset-x-0 p-6 z-20 pointer-events-none text-[white]">
        <p class="m-0 mb-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[white]/60">
          Featured trail
        </p>
        <h2 class="m-0 mb-2.5 text-[22px] font-bold leading-[1.2] text-[white]">
          American Cordillera Trails
        </h2>
        <div class="flex gap-3.5 items-center">
          <span class="text-[13px] text-[white]/75">⏱ 2 days</span>
          <span class="text-[13px] text-[white]/75">★ 4.8 / 5</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-4 flex flex-col gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
      <!-- Direction toggle -->
      <div class="flex items-center justify-between">
        <label class="text-xs text-muted-foreground">direction</label>
        <div class="flex gap-1">
          <button
            v-for="d in (['top', 'bottom', 'left', 'right'] as Direction[])"
            :key="d"
            @click="direction = d"
            class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors"
            :class="
              direction === d
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            ">
            {{ d }}
          </button>
        </div>
      </div>

      <!-- Easing toggle -->
      <div class="flex items-center justify-between">
        <label class="text-xs text-muted-foreground">easing</label>
        <div class="flex gap-1">
          <button
            v-for="e in (['linear', 'smooth'] as Easing[])"
            :key="e"
            @click="easing = e"
            class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors"
            :class="
              easing === e
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            ">
            {{ e }}
          </button>
        </div>
      </div>

      <label class="text-xs text-muted-foreground flex justify-between">
        coverage
        <span class="text-muted-foreground/60">{{ coverage }}%</span>
      </label>
      <input type="range" min="20" max="100" v-model.number="coverage" class="w-full" />

      <label class="text-xs text-muted-foreground flex justify-between">
        fadeStart
        <span class="text-muted-foreground/60">{{ fadeStart }}%</span>
      </label>
      <input type="range" min="0" max="80" v-model.number="fadeStart" class="w-full" />

      <label class="text-xs text-muted-foreground flex justify-between">
        opacity
        <span class="text-muted-foreground/60">{{ opacity }}</span>
      </label>
      <input type="range" min="0" max="1" step="0.05" v-model.number="opacity" class="w-full" />
    </div>
  </div>
</template>
