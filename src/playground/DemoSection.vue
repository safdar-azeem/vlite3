<script setup lang="ts">
import { ref, computed } from 'vue'
import { highlightVue, extractSnippet } from './highlighter'

const props = defineProps<{
  title: string
  code: string
}>()

const activeTab = ref<'preview' | 'code'>('preview')
const copied = ref(false)

const snippet = computed(() => extractSnippet(props.code, props.title))
const highlightedCode = computed(() => highlightVue(snippet.value))

async function copyCode() {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = props.code
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <section class="demo-section relative flex flex-col mb-16">
    <!-- Header -->
    <div class="flex items-center justify-between mt-8 mb-6">
      <h3 class="font-heading scroll-m-20 text-2xl font-bold tracking-tight text-foreground">{{ title }}</h3>
    </div>

    <div class="group relative flex flex-col space-y-4">
      <!-- Tabs header -->
      <div class="flex items-center justify-between pb-1 border-b border-border/30">
        <div class="flex space-x-1">
          <button
            class="relative inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none"
            :class="
              activeTab === 'preview'
                ? 'text-foreground'
                : 'text-muted-foreground hover:bg-muted/30 rounded-md'
            "
            @click="activeTab = 'preview'">
            Preview
            <div v-if="activeTab === 'preview'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
          </button>
          <button
            class="relative inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none"
            :class="
              activeTab === 'code'
                ? 'text-foreground'
                : 'text-muted-foreground hover:bg-muted/30 rounded-md'
            "
            @click="activeTab = 'code'">
            Code
            <div v-if="activeTab === 'code'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
          </button>
        </div>
      </div>

      <!-- Preview Tab -->
      <div
        v-show="activeTab === 'preview'"
        class="preview-container relative min-h-[350px] flex items-center justify-center rounded-2xl border border-border/40 bg-background shadow-sm hover:shadow-md transition-shadow duration-300 p-12 overflow-hidden">
        <div class="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none"></div>
        <div class="w-full flex items-center justify-center flex-1 flex-col preview-tab relative z-10">
          <slot />
        </div>
      </div>

      <!-- Code Tab -->
      <div
        v-show="activeTab === 'code'"
        class="demo-code-panel relative rounded-2xl border border-zinc-800 bg-[#0a0a0a] text-zinc-50 shadow-xl overflow-hidden mt-2 ring-1 ring-white/10">
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#0a0a0a]/50 backdrop-blur-md">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-zinc-700"></div>
            <div class="w-3 h-3 rounded-full bg-zinc-700"></div>
            <div class="w-3 h-3 rounded-full bg-zinc-700"></div>
          </div>
          <span class="text-xs font-mono text-zinc-400 absolute left-1/2 -translate-x-1/2">vue</span>
          <button class="demo-copy-btn" @click="copyCode">
            <template v-if="copied">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span class="text-emerald-400">Copied</span>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </template>
          </button>
        </div>
        <div
          class="demo-code-body p-6 overflow-x-auto text-[13.5px] leading-relaxed max-h-[600px] scrollbar-thin scrollbar-thumb-zinc-700">
          <pre><code v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-section:not(:last-child) {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  border-bottom-color: color-mix(in srgb, var(--color-border) 40%, transparent);
  padding-bottom: 4rem;
}

.demo-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: transparent;
  color: #a1a1aa;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-copy-btn:hover {
  background: #27272a;
  color: #f4f4f5;
}

.demo-code-body pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
  color: #e4e4e7;
}

.demo-code-body code {
  font-family: inherit;
}

/* Scrollbar styling */
.demo-code-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.demo-code-body::-webkit-scrollbar-track {
  background: transparent;
}

.demo-code-body::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 4px;
}

.demo-code-body::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}

.bg-grid-black {
  background-size: 20px 20px;
  background-image: linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px);
}

.bg-grid-white {
  background-size: 20px 20px;
  background-image: linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px);
}
</style>

<!-- Global syntax highlight styles (unscoped) -->
<style>
.hl-sfc-tag {
  color: #8b8b8b;
  font-weight: 500;
}

.hl-tag {
  color: #3b82f6;
  font-weight: 500;
}

.hl-attr {
  color: #e4e4e7;
}

.hl-directive {
  color: #f59e0b;
}

.hl-string {
  color: #10b981;
}

.hl-keyword {
  color: #ec4899;
}

.hl-comment {
  color: #71717a;
  font-style: italic;
}

.hl-number {
  color: #38bdf8;
}

.preview-tab > div:first-of-type {
  width: 100%;
}
</style>
