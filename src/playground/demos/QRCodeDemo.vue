<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { QRCode } from '@/components/QRCode'
import Input from '@/components/Input.vue'
import sourceCode from './QRCodeDemo.vue?raw'

const qrValue = ref('https://github.com/safdar-azeem/vlite3')
</script>

<template>
  <div class="space-y-12 pb-20">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">QRCode</h2>
      <p class="text-gray-500">A lightweight QR Code component utilizing VueUse useQRCode.</p>
    </div>

    <DemoSection title="Playground" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <Input v-model="qrValue" label="QR Code Value" />
        </div>

        <div
          class="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-border min-h-[300px]">
          <QRCode :value="qrValue" :size="250" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
