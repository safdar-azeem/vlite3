<script setup lang="ts">
import { ref, computed } from 'vue'
import { FadeOverlay } from '@/components/FadeOverlay'
import { highlightVue } from '@/playground/highlighter'

const blurAmount = ref(40)
const blurTintOpacity = ref(0.5)
const blurColor = ref('#000000')
const coverage = ref(70)

const presets = [
  { label: 'macOS Vibrancy', blur: 16, tint: 0, color: '#000000' },
  { label: 'iOS Frost', blur: 24, tint: 0.25, color: '#ffffff' },
  { label: 'Cinematic Dark', blur: 32, tint: 0.55, color: '#000000' },
  { label: 'Warm Fog', blur: 40, tint: 0.35, color: '#4a2810' },
]

const activePreset = computed(() => {
  return presets.findIndex(
    (p) =>
      p.blur === blurAmount.value &&
      Math.abs(p.tint - blurTintOpacity.value) < 0.01 &&
      p.color === blurColor.value
  )
})

const blurVariantLabel = computed(() => {
  if (activePreset.value >= 0) return presets[activePreset.value].label
  if (blurTintOpacity.value === 0) return 'Pure vibrancy'
  if (blurTintOpacity.value <= 0.3) return 'Frosted glass'
  return 'Cinematic'
})

function applyPreset(preset: (typeof presets)[number]) {
  blurAmount.value = preset.blur
  blurTintOpacity.value = preset.tint
  blurColor.value = preset.color
}

/* ── Generated code snippet ──────────────────────────────── */

const generatedCode = computed(() => {
  const props: string[] = []
  props.push(`  direction="bottom"`)
  if (coverage.value !== 100) props.push(`  coverage="${coverage.value}%"`)
  props.push(`  :blur="${blurAmount.value}"`)
  if (blurTintOpacity.value !== 0) props.push(`  :tintOpacity="${blurTintOpacity.value}"`)
  if (blurColor.value !== '#000000') props.push(`  color="${blurColor.value}"`)
  props.push(`  easing="smooth"`)

  return `<FadeOverlay\n${props.join('\n')}\n/>`
})

const highlightedCode = computed(() => highlightVue(generatedCode.value))
const copied = ref(false)

async function copyCode() {
  try { await navigator.clipboard.writeText(generatedCode.value) }
  catch {
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
        :coverage="`${coverage}%`"
        :blur="+blurAmount"
        :tintOpacity="blurTintOpacity"
        :color="blurColor"
        easing="smooth" />

      <!-- Card text -->
      <div class="absolute bottom-0 inset-x-0 p-6 z-20 pointer-events-none text-[white]">
        <p class="m-0 mb-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[white]/50">
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
    <div class="mt-4 flex flex-col gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
      <label class="text-xs text-muted-foreground">presets</label>
      <div class="grid grid-cols-2 gap-1.5">
        <button
          v-for="(preset, i) in presets"
          :key="i"
          @click="applyPreset(preset)"
          class="px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 text-left"
          :class="
            activePreset === i
              ? 'bg-foreground text-background shadow-sm'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          ">
          {{ preset.label }}
        </button>
      </div>

      <label class="text-xs text-muted-foreground flex justify-between">
        blur <span class="text-muted-foreground/60">{{ blurAmount }}px</span>
      </label>
      <input type="range" min="4" max="60" v-model.number="blurAmount" class="w-full" />

      <label class="text-xs text-muted-foreground flex justify-between">
        tintOpacity <span class="text-muted-foreground/60">{{ blurTintOpacity }}</span>
      </label>
      <input type="range" min="0" max="0.8" step="0.05" v-model.number="blurTintOpacity" class="w-full" />

      <label class="text-xs text-muted-foreground flex justify-between">
        coverage <span class="text-muted-foreground/60">{{ coverage }}%</span>
      </label>
      <input type="range" min="20" max="100" v-model.number="coverage" class="w-full" />

      <div class="flex items-center gap-2">
        <label class="text-xs text-muted-foreground">tint color</label>
        <input type="color" v-model="blurColor" class="w-8 h-7 border-0 bg-transparent cursor-pointer rounded ml-auto" />
      </div>
    </div>

    <!-- Generated code -->
    <div class="mt-3 rounded-xl overflow-hidden border border-border/50">
      <div class="flex items-center justify-between px-4 py-2 bg-[#09090b] border-b border-white/[0.06]">
        <span class="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">Code</span>
        <button @click="copyCode" class="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors" title="Copy code">
          <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><polyline points="20 6 9 17 4 12" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
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
