<script setup lang="ts">
import { ref, computed } from 'vue'
import { highlightVue, extractSnippet } from './highlighter'

const props = defineProps<{
  title: string
  code: string
}>()

const showCode = ref(false)
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
  <section class="demo-section space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <button
        class="demo-toggle-btn"
        :class="{ active: showCode }"
        @click="showCode = !showCode"
        :title="showCode ? 'Hide Code' : 'Show Code'"
        aria-label="Toggle source code">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </button>
    </div>

    <!-- Live Demo -->
    <div>
      <slot />
    </div>

    <!-- Source Code Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[2000px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[2000px]"
      leave-to-class="opacity-0 max-h-0">
      <div v-if="showCode" class="demo-code-panel">
        <div class="demo-code-header">
          <span class="demo-code-lang">vue</span>
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
              Copied!
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
        <div class="demo-code-body">
          <pre><code v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.demo-section {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding-bottom: 2rem;
}

.demo-section:last-child {
  border-bottom: none;
}

.demo-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  background: transparent;
  color: var(--color-muted-foreground, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-toggle-btn:hover {
  background: var(--color-muted, #f3f4f6);
  color: var(--color-foreground, #111827);
  border-color: var(--color-primary, #6366f1);
}

.demo-toggle-btn.active {
  background: var(--color-primary, #6366f1);
  color: white;
  border-color: var(--color-primary, #6366f1);
}

.demo-code-panel {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border, #e5e7eb);
  background: #1e1e2e;
}

.demo-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #181825;
  border-bottom: 1px solid #313244;
}

.demo-code-lang {
  font-size: 12px;
  font-weight: 500;
  color: #a6adc8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.demo-code-body {
  padding: 16px;
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
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
