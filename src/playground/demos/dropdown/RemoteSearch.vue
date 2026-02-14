<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './RemoteSearch.vue?raw'

// --- Remote Search State ---
const remoteVal = ref('')
const remoteOptions = ref<any[]>([])
const remoteLoading = ref(false)
const remoteLabel = computed(
  () => remoteOptions.value.find((o) => o.value === remoteVal.value)?.label || remoteVal.value
)

// Mock Database
const allRemoteUsers = [
  { label: 'Alice', value: 'alice' },
  { label: 'Bob', value: 'bob' },
  { label: 'Charlie', value: 'charlie' },
  { label: 'Dave', value: 'dave' },
  { label: 'Eve', value: 'eve' },
  { label: 'Frank', value: 'frank' },
  { label: 'George', value: 'george' },
  { label: 'Helen', value: 'helen' },
]

const handleRemoteSearch = async (query: string) => {
  remoteLoading.value = true
  // Simulate Network
  await new Promise((r) => setTimeout(r, 600))

  if (!query) {
    remoteOptions.value = [] // Or set to default list
  } else {
    remoteOptions.value = allRemoteUsers.filter((u) =>
      u.label.toLowerCase().includes(query.toLowerCase())
    )
  }
  remoteLoading.value = false
}
</script>

<template>
  <DemoSection title="Remote Search (Async)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Fetches results from a Simulated API as you type. Disables local filtering.
    </p>

    <Dropdown
      :options="remoteOptions"
      :loading="remoteLoading"
      remote
      searchable
      :selected="remoteVal"
      width="w-64"
      @on-select="(opt) => (remoteVal = opt.value)"
      @search="handleRemoteSearch">
      <template #trigger>
        <Button variant="outline" icon-right="lucide:search" class="w-64 justify-between">
          {{ remoteLabel || 'Search Users...' }}
        </Button>
      </template>
    </Dropdown>
  </DemoSection>
</template>
