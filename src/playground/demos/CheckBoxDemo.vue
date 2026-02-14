<script setup lang="ts">
import CheckBox from '@/components/CheckBox.vue'
import Label from '@/components/Label.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './CheckBoxDemo.vue?raw'

const checked1 = ref(false)
const checked2 = ref(true)
const checked3 = ref(false)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">CheckBox</h2>
      <p class="text-gray-500">A control that allows the user to make a binary choice.</p>
    </div>

    <DemoSection title="Basic" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <CheckBox v-model:checked="checked1" id="c1" />
          <Label for="c1">Accept Terms and Conditions</Label>
        </div>
        <p class="text-xs text-gray-400">Value: {{ checked1 }}</p>
      </div>
    </DemoSection>

    <DemoSection title="States" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <CheckBox checked disabled id="c2" />
          <Label for="c2" class="opacity-50">Checked & Disabled</Label>
        </div>
        <div class="flex items-center gap-2">
          <CheckBox :checked="false" disabled id="c3" />
          <Label for="c3" class="opacity-50">Unchecked & Disabled</Label>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
