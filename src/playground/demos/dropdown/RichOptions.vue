<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './RichOptions.vue?raw'

const val1 = ref('profile')
</script>

<template>
  <DemoSection title="Rich Options (Subtitle & Description)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Options can have proper subtitles (shortcuts) and descriptions.
    </p>

    <Dropdown
      :options="[
        { label: 'Profile', value: 'profile', subtitle: '⌘P', icon: 'lucide:user' },
        { label: 'Settings', value: 'settings', subtitle: '⌘,', icon: 'lucide:settings' },
        {
          label: 'Print (Native)',
          value: 'print',
          description: 'Recommended for high fidelity',
          icon: 'lucide:printer',
        },
        {
          label: 'Export PDF',
          value: 'export',
          description: 'Best for digital sharing',
          subtitle: '⌘E',
          icon: 'lucide:file-down',
        },
      ]"
      :selected="val1"
      width="w-[280px]">
      <template #trigger>
        <Button variant="outline" icon-right="lucide:layout-list" class="w-[280px] justify-between">
          Rich Options
        </Button>
      </template>
    </Dropdown>
  </DemoSection>
</template>
