<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './CustomSlot.vue?raw'

const val1 = ref('u1')
</script>

<template>
  <DemoSection title="Custom Item Slot" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Customize the look of each option using the
      <code>#item</code> slot.
    </p>

    <Dropdown
      :options="[
        {
          value: 'u1',
          label: 'Alex Doe',
          data: {
            email: 'alex@example.com',
            avatar: 'https://i.pravatar.cc/150?u=a',
          },
        },
        {
          value: 'u2',
          label: 'Jane Smith',
          data: {
            email: 'jane@example.com',
            avatar: 'https://i.pravatar.cc/150?u=b',
          },
        },
        {
          value: 'u3',
          label: 'John Pix',
          data: {
            email: 'john@example.com',
            avatar: 'https://i.pravatar.cc/150?u=c',
          },
        },
      ]"
      :selected="val1"
      class="min-w-[240px]">
      <template #trigger>
        <Button variant="outline" icon-right="lucide:user">Select User</Button>
      </template>

      <template #item="{ option, selected }">
        <div class="flex items-center gap-3 w-full p-1">
          <img :src="option.data?.avatar" class="w-8 h-8 rounded-full bg-gray-100 object-cover" />
          <div class="flex flex-col text-left">
            <span class="font-medium text-gray-900 leading-tight">{{ option.label }}</span>
            <span class="text-xs text-gray-500 leading-tight">{{ option.data?.email }}</span>
          </div>
          <div v-if="selected === option.value" class="ml-auto text-primary">
            <Icon icon="lucide:check" class="w-4 h-4" />
          </div>
        </div>
      </template>
    </Dropdown>
  </DemoSection>
</template>
