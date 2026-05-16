<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileTree, FileNode } from '@/components/FileTree'
import type { FileTreeSelectionMode, FileTreeVariant } from '@/components/FileTree/types'
import { highlightVue } from '@/playground/highlighter'
import Input from '@/components/Input.vue'

const selectionMode = ref<FileTreeSelectionMode>('single')
const showCheckboxes = ref(false)
const highlightSearch = ref(true)
const variant = ref<FileTreeVariant>('default')
const searchQuery = ref('')
const selectedKeys = ref<string[]>(['src'])

const basicData = ref<FileNode[]>([
  {
    id: 'root',
    label: 'Project Root',
    isFolder: true,
    children: [
      {
        id: 'src',
        label: 'src',
        isFolder: true,
        children: [
          { id: 'components', label: 'components', isFolder: true, children: [] },
          { id: 'assets', label: 'assets', isFolder: true, children: [] },
          { id: 'main', label: 'main.ts', isFolder: false, icon: 'lucide:file-code' },
          { id: 'App', label: 'App.vue', isFolder: false, icon: 'lucide:file-code' },
        ],
      },
      { id: 'package', label: 'package.json', isFolder: false, icon: 'lucide:file-json' },
      { id: 'readme', label: 'README.md', isFolder: false, icon: 'lucide:file-text' },
    ],
  },
])

const generatedCode = computed(() => {
  const props: string[] = []

  if (selectionMode.value !== 'single') props.push(`  selectionMode="${selectionMode.value}"`)
  if (showCheckboxes.value) props.push(`  showCheckboxes`)
  if (highlightSearch.value) props.push(`  highlightSearch`)
  if (variant.value !== 'default') props.push(`  variant="${variant.value}"`)
  if (searchQuery.value) props.push(`  searchQuery="${searchQuery.value}"`)

  if (props.length === 0) return `<FileTree\n  :data="data"\n  v-model="selectedKeys"\n/>`
  return `<FileTree\n  :data="data"\n  v-model="selectedKeys"\n${props.join('\n')}\n/>`
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
  <div class="flex flex-col mb-10">
    <p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
      Interactive Playground
    </p>
    
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Preview Area -->
      <div class="relative w-full md:w-1/2 rounded-2xl border border-border bg-card p-4 overflow-hidden h-[440px] flex flex-col">
        <div class="mb-4">
          <Input v-model="searchQuery" placeholder="Search..." icon="lucide:search" />
        </div>
        <FileTree
          :data="basicData"
          v-model="selectedKeys"
          :selection-mode="selectionMode"
          :show-checkboxes="showCheckboxes"
          :highlight-search="highlightSearch"
          :variant="variant"
          :search-query="searchQuery"
          :default-expanded-keys="['root', 'src']"
          class="flex-1"
        />
      </div>

      <!-- Controls & Code -->
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <!-- Controls -->
        <div class="flex flex-col gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          
          <!-- Selection Mode -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">selectionMode</label>
            <div class="flex gap-1">
              <button
                v-for="mode in (['single', 'multiple', 'none'] as FileTreeSelectionMode[])"
                :key="mode"
                @click="selectionMode = mode"
                class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors"
                :class="
                  selectionMode === mode
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                ">
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- Variant -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">variant</label>
            <div class="flex gap-1">
              <button
                v-for="v in (['default', 'bordered'] as FileTreeVariant[])"
                :key="v"
                @click="variant = v"
                class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors"
                :class="
                  variant === v
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                ">
                {{ v }}
              </button>
            </div>
          </div>

          <!-- Toggles -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">showCheckboxes</label>
            <button
              @click="showCheckboxes = !showCheckboxes"
              class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors"
              :class="showCheckboxes ? 'bg-emerald-500/20 text-emerald-600' : 'bg-muted text-muted-foreground hover:text-foreground'">
              {{ showCheckboxes ? 'true' : 'false' }}
            </button>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">highlightSearch</label>
            <button
              @click="highlightSearch = !highlightSearch"
              class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors"
              :class="highlightSearch ? 'bg-emerald-500/20 text-emerald-600' : 'bg-muted text-muted-foreground hover:text-foreground'">
              {{ highlightSearch ? 'true' : 'false' }}
            </button>
          </div>

        </div>

        <!-- Generated code -->
        <div class="rounded-xl overflow-hidden border border-border/50">
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
    </div>
  </div>
</template>

<style scoped>
.demo-code-body pre {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
}
</style>
