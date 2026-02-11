<script setup lang="ts">
import { ref } from 'vue'
import { FileTree, FileNode } from '@/components/FileTree'
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

// Specific data for content search demo to guarantee matches appear
const contentSearchData = ref<FileNode[]>([
  {
    id: 'src-search',
    label: 'src',
    isFolder: true,
    children: [
      { 
        id: 'utils', 
        label: 'utils.ts', 
        isFolder: false,
        icon: 'lucide:file-code',
        // Mocking a search result match (normally comes from backend search)
        searchMatch: {
          line_number: 42,
          line_content: 'export const calculateTotal = (a, b) => a + b',
          match_start: 13,
          match_length: 9, // "calculate"
        }
      },
      { 
        id: 'api', 
        label: 'api.ts', 
        isFolder: false,
        icon: 'lucide:file-code',
        searchMatch: {
            line_number: 10,
            line_content: 'const endpoint = "https://api.example.com"',
            match_start: 25,
            match_length: 3 // "api"
        }
      }
    ]
  }
])

// --- State ---
const singleSelection = ref<string[]>(['main'])
const multiSelection = ref<string[]>([])
const basicSearchQuery = ref('')
const contentSearchQuery = ref('calculate')

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
        <div>
            <h2 class="text-2xl font-bold mb-2">File Tree</h2>
            <p class="text-gray-500">
                A recursive tree component for displaying hierarchical data with selection, search, and async loading.
            </p>
        </div>

        <div class="space-y-4">
            <h3 class="text-lg font-semibold border-b pb-2">Single Selection & Search</h3>
            <div class="flex gap-6">
                <div class="w-1/2 border rounded-lg p-4 bg-card h-[400px] flex flex-col">
                    <div class="mb-4">
                         <Input v-model="basicSearchQuery" placeholder="Search files..." icon="lucide:search" />
                    </div>
                    <FileTree 
                        :data="basicData" 
                        v-model="singleSelection"
                        :search-query="basicSearchQuery"
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

        <div class="space-y-4">
            <h3 class="text-lg font-semibold border-b pb-2">Content Search Highlighting</h3>
             <p class="text-sm text-gray-500 mb-2">
                Simulates search results where the file content is matched. Note the line number and highlighted text snippet.
            </p>
            <div class="flex gap-6">
                <div class="w-1/2 border rounded-lg p-4 bg-card h-[300px] flex flex-col">
                    <div class="mb-4">
                         <Input v-model="contentSearchQuery" placeholder="Search content..." icon="lucide:search" />
                    </div>
                    <FileTree 
                        :data="contentSearchData" 
                        :search-query="contentSearchQuery"
                        selection-mode="single"
                        :default-expanded-keys="['src-search']"
                        class="flex-1"
                    />
                </div>
                <div class="w-1/2 p-4 bg-muted rounded-lg">
                    <h4 class="font-medium mb-2">Demo Info</h4>
                    <p class="text-xs text-gray-600">
                        This demo uses static data with `searchMatch` properties pre-populated to demonstrate the UI capability. 
                        Try searching for "calculate" or "api".
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>
