<script setup lang="ts">
import { ref } from 'vue'
import { FileTree, FileNode } from '@/components/FileTree'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

// --- Data ---
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
            { id: 'App', label: 'App.vue', isFolder: false, icon: 'lucide:file-code' }
        ]
      },
      { id: 'package', label: 'package.json', isFolder: false, icon: 'lucide:file-json' },
      { id: 'readme', label: 'README.md', isFolder: false, icon: 'lucide:file-text' }
    ]
  }
])

const asyncData = ref<FileNode[]>([
    { id: 'cloud', label: 'Cloud Storage', isFolder: true, children: [] },
    { id: 'local', label: 'Local Disk', isFolder: true, children: [] }
])

// --- State ---
const singleSelection = ref<string[]>(['main'])
const multiSelection = ref<string[]>([])
const searchQuery = ref('')

// --- Async Loader ---
const handleLoad = async (node: FileNode) => {
    // Simulate network delay
    return new Promise<FileNode[]>(resolve => {
        setTimeout(() => {
            // Mock response
            const newChildren: FileNode[] = [
                { id: `${node.id}-1`, label: `Dynamic Folder ${Math.floor(Math.random() * 100)}`, isFolder: true, children: [] },
                { id: `${node.id}-2`, label: `File ${Math.floor(Math.random() * 100)}.txt`, isFolder: false }
            ]
            node.children = newChildren
            resolve(newChildren)
        }, 1500)
    })
}

// --- Verification Logs ---
const logs = ref<string[]>([])
const handleLog = (msg: string) => {
    logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
    if (logs.value.length > 5) logs.value.pop()
}

</script>

<template>
    <div class="space-y-10">
        <!-- Header -->
        <div>
            <h2 class="text-2xl font-bold mb-2">File Tree</h2>
            <p class="text-gray-500">
                A recursive tree component for displaying hierarchical data with selection, search, and async loading.
            </p>
        </div>

        <!-- 1. Single Selection & Search -->
        <div class="space-y-4">
            <h3 class="text-lg font-semibold border-b pb-2">Single Selection & Search</h3>
            <div class="flex gap-6">
                <div class="w-1/2 border rounded-lg p-4 bg-card h-[400px] flex flex-col">
                    <div class="mb-4">
                         <Input v-model="searchQuery" placeholder="Search files..." icon="lucide:search" />
                    </div>
                    <FileTree 
                        :data="basicData" 
                        v-model="singleSelection"
                        :search-query="searchQuery"
                        selection-mode="single"
                        :default-expanded-keys="['root', 'src']"
                        @node-click="(n) => handleLog(`Clicked: ${n.label}`)"
                        @select="(n, val) => handleLog(`Selected: ${n.label} (${val})`)"
                        class="flex-1"
                    />
                </div>
                <div class="w-1/2 space-y-4">
                    <div class="p-4 bg-muted rounded-lg">
                        <h4 class="font-medium mb-2">State</h4>
                        <pre class="text-xs">{{ singleSelection }}</pre>
                    </div>
                     <div class="p-4 bg-muted rounded-lg">
                        <h4 class="font-medium mb-2">Logs</h4>
                        <div class="text-xs space-y-1 text-muted-foreground">
                            <div v-for="(log, i) in logs" :key="i">{{ log }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. Multiple Selection (Checkboxes) -->
        <div class="space-y-4">
            <h3 class="text-lg font-semibold border-b pb-2">Multiple Selection (Checkboxes)</h3>
            <div class="flex gap-6">
                <div class="w-1/2 border rounded-lg p-4 bg-card h-[400px]">
                    <FileTree 
                        :data="basicData" 
                        v-model="multiSelection"
                        selection-mode="multiple"
                        show-checkboxes
                        :default-expanded-keys="['root']"
                    />
                </div>
                <div class="w-1/2">
                    <div class="p-4 bg-muted rounded-lg h-full overflow-auto">
                        <h4 class="font-medium mb-2">Selected Keys</h4>
                        <pre class="text-xs">{{ multiSelection }}</pre>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. Async Loading -->
        <div class="space-y-4">
            <h3 class="text-lg font-semibold border-b pb-2">Async Loading</h3>
             <p class="text-sm text-gray-500 mb-2">
                Expand "Cloud Storage" or "Local Disk" to load children dynamically.
            </p>
            <div class="flex gap-6">
                <div class="w-1/2 border rounded-lg p-4 bg-card h-[300px]">
                    <FileTree 
                        :data="asyncData" 
                        selection-mode="single"
                        :load-data="handleLoad"
                    />
                </div>
            </div>
        </div>

    </div>
</template>
