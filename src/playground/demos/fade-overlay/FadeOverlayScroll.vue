<script setup lang="ts">
import { ref } from 'vue'
import { FadeOverlay } from '@/components/FadeOverlay'

const scrollColor = ref('var(--color-background)')
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
          v-for="i in 20"
          :key="i"
          class="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
          <div
            class="w-9 h-9 rounded-lg shrink-0 bg-secondary flex items-center justify-center text-sm text-muted-foreground">
            {{ i }}
          </div>
          <div>
            <p class="m-0 text-[13px] text-foreground">Trail segment {{ i }}</p>
            <p class="m-0 text-[11px] text-muted-foreground">
              {{ (i * 2.3).toFixed(1) }} km · {{ i * 40 + 120 }}m elevation
            </p>
          </div>
        </div>
      </div>

      <!-- Top fade -->
      <FadeOverlay direction="top" coverage="60px" :color="scrollColor" easing="smooth" />

      <!-- Bottom fade -->
      <FadeOverlay direction="bottom" coverage="80px" :color="scrollColor" easing="smooth" />
    </div>

    <!-- Controls -->
    <div class="mt-4 flex flex-col gap-2.5">
      <label class="text-xs text-muted-foreground flex items-center gap-2">
        color (match container bg)
        <input
          type="color"
          v-model="scrollColor"
          class="w-12 h-7 border-0 bg-transparent cursor-pointer rounded" />
      </label>
    </div>
  </div>
</template>
