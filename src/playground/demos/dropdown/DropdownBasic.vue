<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './DropdownBasic.vue?raw'
import Modal from '@/components/Modal.vue'

const val1 = ref('1')
</script>

<template>
  <DemoSection title="Basic Usage" :code="sourceCode">
    <div class="flex items-center gap-4">
      <Dropdown
        closeOnSelect
        empty-message="Data not found."
        :options="[]"
        :searchable="true"
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
