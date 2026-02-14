<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './Direction.vue?raw'

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
  <DemoSection title="Direction Control (RTL)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">Support for LTR and RTL directions.</p>
    <div class="flex gap-4">
      <div class="space-y-2">
        <div class="text-xs font-bold uppercase text-gray-500">LTR (Default)</div>
        <Dropdown :options="nestedOptions" direction="ltr">
          <template #trigger>
            <Button variant="outline" icon-right="lucide:chevron-down">LTR Menu</Button>
          </template>
        </Dropdown>
      </div>
      <div class="space-y-2">
        <div class="text-xs font-bold uppercase text-gray-500">RTL</div>
        <Dropdown :options="nestedOptions" direction="rtl">
          <template #trigger>
            <Button variant="outline" icon-right="lucide:chevron-down">RTL Menu</Button>
          </template>
        </Dropdown>
      </div>
    </div>
  </DemoSection>
</template>
