<script setup lang="ts">
import Textarea from '@/components/Textarea.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './TextareaDemo.vue?raw'

const val = ref('')
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Textarea</h2>
      <p class="text-gray-500">Multi-line text input component.</p>
    </div>

    <DemoSection title="Basic Usage" :code="sourceCode">
      <div class="max-w-xl space-y-4">
        <Textarea placeholder="Type your message here..." v-model="val" :rows="4" />
        <p class="text-sm text-gray-500">Value: {{ val }}</p>
      </div>
    </DemoSection>

    <DemoSection title="States" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea disabled placeholder="This textarea is disabled" :rows="3" />
        <Textarea error="This field is required" placeholder="Error state" :rows="3" />
      </div>
    </DemoSection>
  </div>
</template>
