<script setup lang="ts">
import { ref, computed } from 'vue'
import { highlightVue, extractSnippet } from './highlighter'

interface DemoProps {
  title?: string
  code: string
  direction?: 'row' | 'col'
  align?: 'center' | 'start' | 'end' | 'stretch'
  minWidth?: boolean
}

const props = withDefaults(defineProps<DemoProps>(), {
  direction: 'col',
  align: 'center',
  minWidth: false,
})

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
    textarea.value = snippet.value
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
  <section class="flex flex-col space-y-4 mb-10 w-full">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-[1.05rem] font-medium tracking-tight text-foreground">{{ title }}</h3>
    </div>

    <!-- Container -->
    <div
      class="relative flex flex-col rounded-xl border border-border/80 dark:border-border/50 bg-background shadow-sm overflow-hidden">
      <!-- Tabs header -->
      <div
        class="flex items-center justify-between px-3 py-2 border-b border-border/80 dark:border-border/50 z-20">
        <div class="flex items-center space-x-1 p-1 rounded-lg bg-muted/30">
          <button
            class="relative inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md focus-visible:outline-none"
            :class="
              activeTab === 'preview'
                ? 'bg-primary text-white shadow-md ring-1 ring-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            "
            @click="activeTab = 'preview'">
            Preview
          </button>
          <button
            class="relative inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-md focus-visible:outline-none"
            :class="
              activeTab === 'code'
                ? 'bg-primary text-white shadow-md ring-1 ring-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            "
            @click="activeTab = 'code'">
            Code
          </button>
        </div>

        <button
          v-show="activeTab === 'code'"
          class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground"
          @click="copyCode"
          title="Copy Code">
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
              stroke-linejoin="round"
              class="text-emerald-500">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </template>
          <template v-else>
            <svg
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
          </template>
        </button>
      </div>

      <!-- Preview Tab -->
      <div
        v-show="activeTab === 'preview'"
        class="preview-container relative flex w-full p-8 md:p-14 min-h-[150px] overflow-x-auto"
        :class="[
          direction === 'row' ? 'flex-row gap-8 justify-center' : 'flex-col gap-10',
          align === 'center'
            ? 'items-center justify-center'
            : align === 'start'
              ? 'items-start justify-start'
              : align === 'stretch'
                ? 'items-stretch'
                : 'items-end justify-end',
          minWidth ? 'preview-min-width' : '',
        ]">
        <slot />
      </div>

      <!-- Code Tab -->
      <div
        v-show="activeTab === 'code'"
        class="demo-code-panel relative bg-[#09090b] text-zinc-50 overflow-hidden w-full m-0">
        <div
          class="demo-code-body p-5 overflow-x-auto text-[13px] leading-[1.6] max-h-[500px] scrollbar-thin scrollbar-thumb-zinc-700">
          <pre><code v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-code-body pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
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
  background: #27272a;
  border-radius: 4px;
}

.demo-code-body::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}

/* Background dot pattern for preview */
.preview-container {
  background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 16px 16px;
}

:deep(.dark) .preview-container,
.dark .preview-container {
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}

/* Optional minimum width enforcing */
.preview-min-width > :deep(div) {
  min-width: min(100%, 30px);
  width: 100% !important;
}
@media (min-width: 768px) {
  .preview-min-width > :deep(div) {
    min-width: min(100%, 900px);
    width: 100% !important;
  }
}
</style>

<!-- Global syntax highlight styles (unscoped) -->
<style>
/* Modern editor syntax highlighting (One Dark / Vitesse inspired) */
.hl-sfc-tag {
  color: #f472b6;
  font-weight: 500;
} /* pink-400 */
.hl-tag {
  color: #60a5fa;
  font-weight: 500;
} /* blue-400 */
.hl-attr {
  color: #a78bfa;
} /* purple-400 */
.hl-directive {
  color: #fbbf24;
} /* amber-400 */
.hl-string {
  color: #34d399;
} /* emerald-400 */
.hl-keyword {
  color: #c084fc;
  font-weight: 500;
} /* purple-400 */
.hl-comment {
  color: #6b7280;
  font-style: italic;
} /* gray-500 */
.hl-number {
  color: #f87171;
} /* red-400 */
</style>
