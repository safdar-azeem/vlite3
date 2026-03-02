<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { Barcode, barcodesConstants } from '@/components/Barcode'
import Input from '@/components/Input.vue'
import sourceCode from './BarcodeDemo.vue?raw'

const barcodeValue = ref('Vlite3-1234')
const barcodeFormat = ref('CODE128')

const formatOptions = barcodesConstants
</script>

<template>
  <div class="space-y-12 pb-20">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Barcode</h2>
      <p class="text-gray-500">
        A customizable Barcode component supporting multiple formats using JsBarcode.
      </p>
    </div>

    <DemoSection title="Playground" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <Input v-model="barcodeValue" label="Barcode Value" />

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-foreground">Barcode Format</label>
            <select
              v-model="barcodeFormat"
              class="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option v-for="fmt in formatOptions" :key="fmt.value" :value="fmt.value">
                {{ fmt.label }}
              </option>
            </select>
          </div>
        </div>

        <div
          class="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-border min-h-[300px]">
          <Barcode :value="barcodeValue" :format="barcodeFormat" class="w-full" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
