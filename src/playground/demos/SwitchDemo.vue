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
      <div class="flex flex-col items-center justify-center w-full">
        <div class="flex items-center justify-between w-full max-w-sm p-4 border rounded-lg bg-background">
           <Label>Airplane Mode</Label>
           <Switch v-model="active" />
        </div>
        <p class="text-[13px] text-muted-foreground mt-3">Value: {{ active }}</p>
      </div>
    </DemoSection>

    <DemoSection title="States" :code="sourceCode">
      <div class="flex flex-col w-full max-w-sm gap-4">
        <div class="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
           <Label class="text-muted-foreground">Disabled Off</Label>
           <Switch :model-value="false" disabled />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
           <Label class="text-muted-foreground">Disabled On</Label>
           <Switch :model-value="true" disabled />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
