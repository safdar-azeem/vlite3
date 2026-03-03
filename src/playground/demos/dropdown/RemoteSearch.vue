<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import { MultiSelect } from '@/components/MultiSelect'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './RemoteSearch.vue?raw'
import type { IDropdownOption } from '@/types'

// -----------------------------------------------------------------------------
// 1. MOCK SERVER / DATABASE
// -----------------------------------------------------------------------------
const TOTAL_RECORDS = 1000
const ITEMS_PER_PAGE = 10

// Generate 1000 dummy users
const MOCK_DB: IDropdownOption[] = Array.from({ length: TOTAL_RECORDS }, (_, i) => ({
  value: `user_${i + 1}`,
  label: `User ${i + 1} ${i % 2 === 0 ? '(Admin)' : '(Member)'}`,
  description: `user${i + 1}@example.com`,
  icon: 'lucide:user',
}))

// Simulate API: Fetch paginated & searched options
const apiFetchOptions = async (query: string, page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 600)) // Network delay
  const q = query.toLowerCase()
  const filtered = MOCK_DB.filter((u) => u.label.toLowerCase().includes(q))
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return {
    data: filtered.slice(start, end),
    hasMore: end < filtered.length,
  }
}

// Simulate API: Fetch specific records by IDs (Hydration)
const apiFetchSelected = async (ids: any[]): Promise<IDropdownOption[]> => {
  console.log('[Mock API] Fetching missing IDs for hydration:', ids)
  await new Promise((resolve) => setTimeout(resolve, 400)) // Network delay
  return MOCK_DB.filter((u) => ids.includes(u.value))
}

// -----------------------------------------------------------------------------
// 2. DEMO STATE
// -----------------------------------------------------------------------------
// Pre-select items that are WAY off the first page to demonstrate hydration
const selectedSingle = ref('user_456') 
const selectedMultiple = ref(['user_789', 'user_999'])

const options = ref<IDropdownOption[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const currentQuery = ref('')

// -----------------------------------------------------------------------------
// 3. EVENT HANDLERS
// -----------------------------------------------------------------------------
const loadOptions = async (reset = false) => {
  if (loading.value) return
  
  loading.value = true
  try {
    const res = await apiFetchOptions(currentQuery.value, currentPage.value)
    if (reset) {
      options.value = res.data
    } else {
      options.value = [...options.value, ...res.data]
    }
    hasMore.value = res.hasMore
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string) => {
  currentQuery.value = query
  currentPage.value = 1
  loadOptions(true)
}

const handleLoadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    loadOptions(false)
  }
}

onMounted(() => {
  // Initial load of first page
  loadOptions(true)
})
</script>

<template>
  <DemoSection title="Async Data, Pagination & Hydration" :code="sourceCode">
    <div class="space-y-8">
      <div class="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-lg">
        <p class="font-semibold mb-1">How this works:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>The database contains <strong>1,000 records</strong>. Only 10 are loaded per page.</li>
          <li>Default selections (e.g., <code>user_456</code>, <code>user_999</code>) don't exist on Page 1.</li>
          <li>The components use the <code>fetchSelected</code> prop to automatically detect missing IDs, fetch their details in parallel, and cache them in an internal buffer so their labels render correctly instantly.</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-700">Single Select (Dropdown)</h4>
          <Dropdown
            v-model="selectedSingle"
            :options="options"
            :loading="loading"
            :has-more="hasMore"
            :remote="true"
            :searchable="true"
            :debounce-time="400"
            :fetch-selected="apiFetchSelected"
            @search="handleSearch"
            @load-more="handleLoadMore"
          >
            <template #trigger="{ selectedLabel, isOpen }">
              <Button 
                variant="outline" 
                class="w-full justify-between"
                :icon-right="isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'"
              >
                {{ selectedLabel || 'Search users...' }}
              </Button>
            </template>
            <template #item="{ option }">
              <div class="flex items-center justify-between w-full">
                <span>{{ option.label }}</span>
                <span class="text-xs text-muted-foreground">{{ option.description }}</span>
              </div>
            </template>
          </Dropdown>
          <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            <strong>v-model:</strong> {{ selectedSingle }}
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-700">Multi Select</h4>
          <MultiSelect
            v-model="selectedMultiple"
            :options="options"
            :loading="loading"
            :has-more="hasMore"
            :remote="true"
            :searchable="true"
            :max-visible="3"
            :debounce-time="400"
            :fetch-selected="apiFetchSelected"
            placeholder="Search and select users..."
            @search="handleSearch"
            @load-more="handleLoadMore"
          />
          <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            <strong>v-model:</strong> {{ selectedMultiple }}
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
