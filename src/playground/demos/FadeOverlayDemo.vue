<script setup lang="ts">
/**
 * FadeOverlayDemo.vue
 * Shows all use cases with live controls and static examples.
 */
import { ref, computed } from 'vue'
import FadeOverlay from '@/components/FadeOverlay.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './FadeOverlayDemo.vue?raw'

// ── Scrim controls ────────────────────────────────────────────────────────────
const scrimCoverage = ref(100)
const scrimFadeStart = ref(45)

// ── Scroll-fade controls ──────────────────────────────────────────────────────
const scrollColor = ref('var(--color-background)')

// ── Blur controls ─────────────────────────────────────────────────────────────
const blurAmount = ref(40)
const blurTintOpacity = ref(0.5)
const blurColor = ref('#000000')

const blurVariantLabel = computed(() => {
  if (blurTintOpacity.value === 0) return 'Pure vibrancy (macOS)'
  if (blurTintOpacity.value <= 0.3) return 'Frosted glass (iOS)'
  return 'Cinematic dark'
})

const propTable = [
  {
    prop: 'direction',
    type: "'top'|'bottom'|'left'|'right'",
    default: "'bottom'",
    mode: 'both',
    notes: 'Which edge the overlay anchors to',
  },
  {
    prop: 'coverage',
    type: 'string|number',
    default: "'100%'",
    mode: 'both',
    notes: 'How much of the parent to cover. Any CSS length.',
  },
  {
    prop: 'fadeStart',
    type: 'string|number',
    default: "'0%'",
    mode: 'both',
    notes: '% of coverage where transparent end begins',
  },
  {
    prop: 'fadeEnd',
    type: 'string|number',
    default: "'100%'",
    mode: 'both',
    notes: '% of coverage where opaque end finishes',
  },
  {
    prop: 'color',
    type: 'string',
    default: "'#000000'",
    mode: 'both',
    notes: 'Scrim color (scrim) or tint color (blur)',
  },
  {
    prop: 'easing',
    type: "'linear'|'smooth'",
    default: "'smooth'",
    mode: 'both',
    notes: 'smooth = 13-stop Material scrim curve',
  },
  {
    prop: 'opacity',
    type: 'string|number',
    default: '1',
    mode: 'both',
    notes: 'Overall element opacity',
  },
  {
    prop: 'zIndex',
    type: 'string|number',
    default: '10',
    mode: 'both',
    notes: 'CSS z-index',
  },
  {
    prop: 'blendMode',
    type: 'CSSBlendMode',
    default: 'undefined',
    mode: 'both',
    notes: 'CSS mix-blend-mode',
  },
  {
    prop: 'blur',
    type: 'number|string',
    default: 'undefined',
    mode: 'blur only',
    notes: 'Activates blur mode. Number = px, string = as-is',
  },
  {
    prop: 'tintOpacity',
    type: 'number',
    default: '0',
    mode: 'blur only',
    notes: '0 = pure vibrancy · 0.3 = frost · 0.6 = cinematic',
  },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">FadeOverlay</h2>
      <p class="text-muted-foreground">
        A versatile overlay component for smooth scrims, scroll-edge fades, and frosted glass
        effects.
      </p>
    </div>

    <!-- ── INTERACTIVE DEMOS ────────────────────────────────────────────────── -->
    <DemoSection
      title="Interactive Examples"
      description="Play with coverage, blur, and opacity."
      :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- ── 1. SCRIM ───────────────────────────────────────────────────────── -->
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
              direction="bottom"
              :coverage="`${scrimCoverage}%`"
              :fadeStart="`${scrimFadeStart}%`"
              fadeEnd="100%"
              color="#000000"
              easing="smooth" />

            <!-- Card text -->
            <div class="absolute bottom-0 inset-x-0 p-6 z-20 pointer-events-none text-[white]">
              <p
                class="m-0 mb-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[white]/60">
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
          <div class="mt-4 flex flex-col gap-2.5">
            <label class="text-xs text-muted-foreground flex justify-between">
              coverage
              <span class="text-muted-foreground/60">{{ scrimCoverage }}%</span>
            </label>
            <input type="range" min="20" max="100" v-model="scrimCoverage" class="w-full" />

            <label class="text-xs text-muted-foreground flex justify-between">
              fadeStart
              <span class="text-muted-foreground/60">{{ scrimFadeStart }}%</span>
            </label>
            <input type="range" min="0" max="80" v-model="scrimFadeStart" class="w-full" />
          </div>
        </div>

        <!-- ── 2. SCROLL FADE ─────────────────────────────────────────────────── -->
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

        <!-- ── 3. BLUR ────────────────────────────────────────────────────────── -->
        <div class="flex flex-col">
          <p
            class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3 flex flex-wrap gap-1">
            03 — Frosted glass
            <span class="text-muted-foreground/60 font-normal normal-case tracking-normal ml-1">
              {{ blurVariantLabel }}
            </span>
          </p>
          <div class="relative overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-900 group">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800"
              alt="Forest"
              class="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-105" />

            <FadeOverlay
              direction="bottom"
              coverage="70%"
              :blur="+blurAmount"
              :tintOpacity="blurTintOpacity"
              :color="blurColor"
              easing="smooth" />

            <!-- Card text -->
            <div class="absolute bottom-0 inset-x-0 p-6 z-20 pointer-events-none text-[white]">
              <p
                class="m-0 mb-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[white]/50">
                Nature reserve
              </p>
              <h2 class="m-0 mb-2.5 text-[22px] font-bold leading-[1.2] text-[white]">
                Pacific Forest Trail
              </h2>
              <div class="flex gap-3.5 items-center">
                <span class="text-[13px] text-[white]/70">⏱ 4 hours</span>
                <span class="text-[13px] text-[white]/70">★ 4.6 / 5</span>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="mt-4 flex flex-col gap-2.5">
            <label class="text-xs text-muted-foreground flex justify-between">
              blur
              <span class="text-muted-foreground/60">{{ blurAmount }}px</span>
            </label>
            <input type="range" min="4" max="40" v-model="blurAmount" class="w-full" />

            <label class="text-xs text-muted-foreground flex justify-between">
              tintOpacity
              <span class="text-muted-foreground/60">{{ blurTintOpacity }}</span>
            </label>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              v-model="blurTintOpacity"
              class="w-full" />

            <div class="flex items-center gap-2">
              <label class="text-xs text-muted-foreground">tint color</label>
              <input
                type="color"
                v-model="blurColor"
                class="w-12 h-7 border-0 bg-transparent cursor-pointer rounded" />
            </div>
          </div>
        </div>
      </div>
    </DemoSection>

    <DemoSection
      title="Bottom Fade (Default)"
      description="Fades out content at the bottom of the container."
      :code="sourceCode">
      <div
        class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border p-4">
        <p class="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <FadeOverlay direction="bottom" coverage="50%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Top Fade"
      description="Fades out content at the top of the container."
      :code="sourceCode">
      <div
        class="relative w-full max-w-sm h-48 bg-card rounded-md overflow-hidden border border-border p-4 flex items-end">
        <p class="text-sm pb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <FadeOverlay direction="top" coverage="40%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Right Fade"
      description="Useful for horizontally scrollable lists."
      :code="sourceCode">
      <div
        class="relative w-full max-w-md h-32 bg-card rounded-md overflow-hidden border border-border flex items-center p-4">
        <div class="flex gap-2 whitespace-nowrap overflow-hidden">
          <div
            v-for="i in 10"
            :key="i"
            class="w-16 h-16 bg-primary/20 rounded-md shrink-0 flex items-center justify-center">
            Item {{ i }}
          </div>
        </div>
        <FadeOverlay direction="right" coverage="30%" />
      </div>
    </DemoSection>

    <DemoSection
      title="Left Fade"
      description="Fades out content at the left edge."
      :code="sourceCode">
      <div
        class="relative w-full max-w-md h-32 bg-card rounded-md overflow-hidden border border-border flex items-center p-4">
        <div class="flex gap-2 whitespace-nowrap overflow-hidden justify-end">
          <div
            v-for="i in 10"
            :key="i"
            class="w-16 h-16 bg-primary/20 rounded-md shrink-0 flex items-center justify-center">
            Item {{ i }}
          </div>
        </div>
        <FadeOverlay direction="left" coverage="40%" />
      </div>
    </DemoSection>
  </div>
</template>
