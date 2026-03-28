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
  <section class="demo-section relative flex flex-col space-y-4 mb-12">
    <!-- Header -->
    <div class="flex items-center justify-between mt-6">
      <h3 class="font-heading scroll-m-20 text-xl font-semibold tracking-tight">{{ title }}</h3>
    </div>

    <div class="group relative my-4 flex flex-col space-y-2">
      <!-- Tabs header -->
      <div class="flex items-center justify-between pb-3">
        <div class="flex space-x-1 rounded-lg bg-muted/80 p-1">
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :class="activeTab === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'"
            @click="activeTab = 'preview'">
            Preview
          </button>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :class="activeTab === 'code' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'"
            @click="activeTab = 'code'">
            Code
          </button>
        </div>
      </div>

      <!-- Preview Tab -->
      <div
        v-show="activeTab === 'preview'"
        class="preview-container relative min-h-[300px] flex items-center justify-center rounded-xl border border-border bg-background p-10 mt-2">
        <div class="w-full flex items-center justify-center">
          <slot />
        </div>
      </div>

      <!-- Code Tab -->
      <div
        v-show="activeTab === 'code'"
        class="demo-code-panel relative rounded-xl border border-border/60 bg-[#0d1117] text-white shadow-sm overflow-hidden mt-2">
        <div class="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-[#161b22]">
          <span class="text-xs font-mono text-muted-foreground">vue</span>
          <button class="demo-copy-btn" @click="copyCode">
            <template v-if="copied">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </template>
            <template v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </template>
          </button>
        </div>
        <div class="demo-code-body p-4 overflow-x-auto text-sm leading-relaxed max-h-[600px] scrollbar-thin scrollbar-thumb-muted">
          <pre><code v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-section:not(:last-child) {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding-bottom: 3rem;
}

.demo-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #45475a;
  background: #313244;
  color: #cdd6f4;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-copy-btn:hover {
  background: #45475a;
  border-color: #585b70;
}

.demo-code-body pre {
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: #cdd6f4;
}

.demo-code-body code {
  font-family: inherit;
}

/* Scrollbar styling */
.demo-code-body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.demo-code-body::-webkit-scrollbar-track {
  background: transparent;
}

.demo-code-body::-webkit-scrollbar-thumb {
  background: #45475a;
  border-radius: 3px;
}

.demo-code-body::-webkit-scrollbar-thumb:hover {
  background: #585b70;
}
</style>

<!-- Global syntax highlight styles (unscoped) -->
<style>
.hl-sfc-tag {
  color: #cba6f7;
  font-weight: 600;
}

.hl-tag {
  color: #89b4fa;
}

.hl-attr {
  color: #fab387;
}

.hl-directive {
  color: #f9e2af;
  font-style: italic;
}

.hl-string {
  color: #a6e3a1;
}

.hl-keyword {
  color: #cba6f7;
  font-weight: 500;
}

.hl-comment {
  color: #6c7086;
  font-style: italic;
}

.hl-number {
  color: #fab387;
}
</style>
