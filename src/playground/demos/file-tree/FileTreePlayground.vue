<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileTree, FileNode } from '@/components/FileTree'
import type { FileTreeSelectionMode, FileTreeVariant } from '@/components/FileTree/types'
import { highlightVue } from '@/playground/highlighter'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import CheckBox from '@/components/CheckBox.vue'
import Tabes from '@/components/Tabes/Tabes.vue'

const selectionMode = ref<FileTreeSelectionMode>('single')
const showCheckboxes = ref(false)
const highlightSearch = ref(true)
const variant = ref<FileTreeVariant>('default')
const showActionsSlot = ref(false)
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

  if (props.length === 0) {
    if (!showActionsSlot.value) return `<FileTree\n  :data="data"\n  v-model="selectedKeys"\n/>`
    return `<FileTree\n  :data="data"\n  v-model="selectedKeys"\n>\n  <template #actions="{ node }">\n    <!-- Actions here -->\n  </template>\n</FileTree>`
  }

  if (!showActionsSlot.value) {
    return `<FileTree\n  :data="data"\n  v-model="selectedKeys"\n${props.join('\n')}\n/>`
  }
  return `<FileTree\n  :data="data"\n  v-model="selectedKeys"\n${props.join('\n')}\n>\n  <template #actions="{ node }">\n    <!-- Actions here -->\n  </template>\n</FileTree>`
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
      <div
        class="relative w-full md:w-1/2 rounded-2xl border border-border bg-card p-4 overflow-hidden h-[440px] flex flex-col">
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
          class="flex-1">
          <template v-if="showActionsSlot" #actions="{ node }">
            <div class="flex items-center gap-1 transition-opacity">
              <Button size="xs" variant="ghost" @click.stop>Edit</Button>
            </div>
          </template>
        </FileTree>
      </div>

      <!-- Controls & Code -->
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <!-- Controls -->
        <div class="flex flex-col gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <!-- Selection Mode -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">selectionMode</label>
            <Tabes
              :options="[
                { label: 'single', value: 'single' },
                { label: 'multiple', value: 'multiple' },
                { label: 'none', value: 'none' },
              ]"
              v-model="selectionMode"
              size="sm" />
          </div>

          <!-- Variant -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">variant</label>
            <Tabes
              :options="[
                { label: 'default', value: 'default' },
                { label: 'bordered', value: 'bordered' },
              ]"
              v-model="variant"
              size="sm" />
          </div>

          <!-- Toggles -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">showCheckboxes</label>
            <CheckBox v-model="showCheckboxes" size="sm" />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">highlightSearch</label>
            <CheckBox v-model="highlightSearch" size="sm" />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-xs text-muted-foreground">showActionsSlot</label>
            <CheckBox v-model="showActionsSlot" size="sm" />
          </div>
        </div>

        <!-- Generated code -->
        <div class="rounded-xl overflow-hidden border border-border/50">
          <div
            class="flex items-center justify-between px-4 py-2 bg-[#09090b] border-b border-white/[0.06]">
            <span class="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">Code</span>
            <Button
              @click="copyCode"
              variant="transparent"
              size="xs"
              class="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]"
              :icon="copied ? 'lucide:check' : 'lucide:copy'"
              :class="{ 'text-emerald-400 hover:text-emerald-400': copied }"
              title="Copy code" />
          </div>
          <div
            class="demo-code-body bg-[#09090b] text-[white] p-4 overflow-x-auto text-[13px] leading-[1.6]">
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
