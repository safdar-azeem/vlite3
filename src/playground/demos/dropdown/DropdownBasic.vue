<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './DropdownBasic.vue?raw'

const val1 = ref('1')
</script>

<template>
  <DemoSection title="Basic Usage" :code="sourceCode">
    <div class="flex items-center gap-4">
      <Dropdown
        closeOnSelect
        :options="[
          {
            value: '1',
            label: 'Dashboard',
            icon: 'https://cdn.prod.website-files.com/666ad77562dfabab1eb27f63/6747850440da96e6bc2d78b3_friso_ai3.webp',
            confirmation: true,
          },
          {
            value: '2',
            label: 'Settings',
            icon: 'lucide:settings',
          },
          {
            value: '3',
            label: 'Logout',
            icon: 'lucide:log-out',
            disabled: true,
          },
        ]"
        :selected="val1"
        @on-select="(opt) => (val1 = opt.value)">
        <template #trigger>
          <Button variant="outline" icon-right="lucide:chevron-down">Menu</Button>
        </template>
      </Dropdown>
      <span class="text-sm text-gray-500">Selected: {{ val1 }}</span>
    </div>
  </DemoSection>
</template>
