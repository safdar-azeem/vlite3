<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './Pagination.vue?raw'

const paginatedVal = ref('')
const paginatedOptions = ref(
  Array.from({ length: 20 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: `${i + 1}`,
  }))
)
const paginatedLoading = ref(false)
const paginatedHasMore = ref(true)

const loadMoreItems = async () => {
  if (paginatedLoading.value) return
  paginatedLoading.value = true

  // Simulate API delay
  await new Promise((r) => setTimeout(r, 1000))

  const currentLength = paginatedOptions.value.length
  const newItems = Array.from({ length: 10 }, (_, i) => ({
    label: `Item ${currentLength + i + 1}`,
    value: `${currentLength + i + 1}`,
  }))

  paginatedOptions.value = [...paginatedOptions.value, ...newItems]

  if (paginatedOptions.value.length >= 60) {
    paginatedHasMore.value = false
  }
  paginatedLoading.value = false
}
</script>

<template>
  <DemoSection title="Pagination (Infinite Scroll)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">Loads more items as you scroll to the bottom.</p>

    <Dropdown
      :options="paginatedOptions"
      :loading="paginatedLoading"
      :hasMore="paginatedHasMore"
      :selected="paginatedVal"
      width="w-64"
      @on-select="(opt) => (paginatedVal = opt.value)"
      @load-more="loadMoreItems">
      <template #trigger>
        <Button variant="outline" icon-right="lucide:chevron-down" class="w-64 justify-between">
          Pick a Number ({{ paginatedOptions.length }} loaded)
        </Button>
      </template>
    </Dropdown>
  </DemoSection>
</template>
