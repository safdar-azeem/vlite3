<script setup lang="ts">
import { ref, computed } from 'vue'
import { FadeOverlay } from '@/components/FadeOverlay'
import type { Direction, Easing } from '@/components/FadeOverlay/types'
import { highlightVue } from '@/playground/highlighter'

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

/* ── Generated code snippet ──────────────────────────────── */

const generatedCode = computed(() => {
  const props: string[] = []

  if (direction.value !== 'bottom') props.push(`  direction="${direction.value}"`)
  if (coverage.value !== 100) props.push(`  coverage="${coverage.value}%"`)
  if (fadeStart.value !== 0) props.push(`  fadeStart="${fadeStart.value}%"`)
  if (easing.value !== 'smooth') props.push(`  easing="${easing.value}"`)
  if (opacity.value !== 1) props.push(`  :opacity="${opacity.value}"`)

  if (props.length === 0) return `<FadeOverlay />`
  return `<FadeOverlay\n${props.join('\n')}\n/>`
})

const highlightedCode = computed(() => highlightVue(generatedCode.value))

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = generatedCode.value
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
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

    <!-- Generated code -->
    <div class="mt-3 rounded-xl overflow-hidden border border-border/50">
      <div
        class="flex items-center justify-between px-4 py-2 bg-[#09090b] border-b border-white/[0.06]">
        <span class="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">Code</span>
        <button
          @click="copyCode"
          class="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Copy code">
          <svg
            v-if="copied"
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-emerald-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </button>
      </div>
      <div class="demo-code-body bg-[#09090b] p-4 overflow-x-auto text-[13px] leading-[1.6]">
        <pre class="m-0"><code v-html="highlightedCode"></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-code-body pre {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
}
</style>
