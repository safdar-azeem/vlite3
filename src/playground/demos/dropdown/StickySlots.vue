<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './StickySlots.vue?raw'

const val1 = ref('1')
</script>

<template>
  <DemoSection title="Sticky Header & Footer Slots" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Use <code>#header</code> and <code>#footer</code> slots to add fixed content that stays
      visible while scrolling.
    </p>

    <Dropdown
      :options="
        Array.from({ length: 20 }, (_, i) => ({
          value: `${i}`,
          label: `Item ${i + 1}`,
        }))
      "
      :selected="val1"
      width="w-[300px]"
      class="min-h-[200px]">
      <template #trigger>
        <Button variant="outline" class="w-[300px] justify-between" icon-right="lucide:chevron-down"
          >Sticky Slots Example</Button
        >
      </template>

      <template #header>
        <div
          class="p-2 border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 flex justify-between items-center">
          <span>Filter Options</span>
          <Button size="xs" variant="ghost">Clear</Button>
        </div>
      </template>

      <template #footer>
        <div class="p-2 border-t bg-gray-50 flex gap-2">
          <Button size="sm" class="flex-1">Apply</Button>
          <Button size="sm" variant="outline" class="flex-1">Cancel</Button>
        </div>
      </template>
    </Dropdown>
  </DemoSection>
</template>
