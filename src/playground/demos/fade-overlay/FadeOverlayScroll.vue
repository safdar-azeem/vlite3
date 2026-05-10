<script setup lang="ts">
import { ref, computed } from 'vue'
import { FadeOverlay } from '@/components/FadeOverlay'
import { highlightVue } from '@/playground/highlighter'

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

const generatedCode = computed(() => {
  const parts: string[] = []
  if (showTop.value) {
    parts.push(`<FadeOverlay\n  direction="top"\n  coverage="${topCoverage.value}px"\n  easing="smooth"\n/>`)
  }
  if (showBottom.value) {
    parts.push(`<FadeOverlay\n  direction="bottom"\n  coverage="${bottomCoverage.value}px"\n  easing="smooth"\n/>`)
  }
  return parts.length > 0 ? parts.join('\n\n') : '<!-- No overlays enabled -->'
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
    <p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
      02 — Scroll-edge fade
    </p>
    <div class="relative rounded-2xl overflow-hidden bg-card border border-border">
      <div class="h-[300px] overflow-y-auto p-5">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="flex items-center gap-3.5 py-3 border-b border-border/40 last:border-0">
          <div class="w-10 h-10 rounded-xl shrink-0 bg-secondary flex items-center justify-center text-base">
            {{ item.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="m-0 text-[13px] font-medium text-foreground">{{ item.name }}</p>
            <p class="m-0 text-[11px] text-muted-foreground">
              {{ item.distance }} · {{ item.elevation }} elevation
            </p>
          </div>
          <div class="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider shrink-0">
            #{{ i + 1 }}
          </div>
        </div>
      </div>

      <FadeOverlay v-if="showTop" direction="top" :coverage="`${topCoverage}px`" color="var(--color-card)" easing="smooth" />
      <FadeOverlay v-if="showBottom" direction="bottom" :coverage="`${bottomCoverage}px`" color="var(--color-card)" easing="smooth" />
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
        top coverage <span class="text-muted-foreground/60">{{ topCoverage }}px</span>
      </label>
      <input type="range" min="20" max="150" v-model.number="topCoverage" class="w-full" />
      <label class="text-xs text-muted-foreground flex justify-between">
        bottom coverage <span class="text-muted-foreground/60">{{ bottomCoverage }}px</span>
      </label>
      <input type="range" min="20" max="150" v-model.number="bottomCoverage" class="w-full" />
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
