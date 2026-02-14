<script setup lang="ts">
import Switch from '@/components/Switch.vue'
import Label from '@/components/Label.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './SwitchDemo.vue?raw'

const active = ref(false)
const active2 = ref(true)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Switch</h2>
      <p class="text-gray-500">A control that allows the user to toggle between two states.</p>
    </div>

    <DemoSection title="Basic Usage" :code="sourceCode">
      <div class="flex items-center justify-between max-w-sm p-4 border rounded-lg">
         <Label>Airplane Mode</Label>
         <Switch v-model="active" />
      </div>
       <p class="text-xs text-gray-400">Value: {{ active }}</p>
    </DemoSection>

    <DemoSection title="States" :code="sourceCode">
      <div class="grid gap-4 max-w-sm">
        <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
           <Label class="text-gray-400">Disabled Off</Label>
           <Switch :model-value="false" disabled />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
           <Label class="text-gray-400">Disabled On</Label>
           <Switch :model-value="true" disabled />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
