<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './Nested.vue?raw'

const nestedVal = ref({})

const nestedOptions = [
  { label: 'Diff', value: 'diff', key: 'diff' },
  { label: 'Repo', value: 'repo', key: 'repo' },
  { label: '---', value: 'divider' },
  {
    label: 'Stash',
    key: 'stash',
    children: [
      { label: 'Apply Stash', value: 'apply' },
      { label: 'Drop Stash', value: 'drop' },
      {
        label: 'Advanced',
        key: 'advanced',
        children: [
          { label: 'Force Push', value: 'force-push' },
          {
            label: 'Delete Branch',
            value: 'delete-branch',
            class: 'text-danger',
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <DemoSection title="Multi-Nested Dropdowns (Schema Driven)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Demonstrating recursive nested menus using the
      <code>children</code> property in the options schema.
    </p>

    <div class="flex items-center gap-4">
      <Dropdown
        :options="nestedOptions"
        :selected="nestedVal"
        @on-select="(payload) => (nestedVal = payload.value)">
        <template #trigger>
          <Button variant="outline" icon-right="lucide:chevron-down">Options Menu</Button>
        </template>
      </Dropdown>
      <span class="text-sm text-gray-500">Selected Value: {{ nestedVal }}</span>
    </div>
  </DemoSection>
</template>
