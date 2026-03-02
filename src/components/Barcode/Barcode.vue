<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import JsBarcode from 'jsbarcode'
import { barcodesConstants } from './types'

export interface BarcodeProps {
  value: string
  format?: string
  displayValue?: boolean
  width?: number
  height?: number
  lineColor?: string
  background?: string
  margin?: number
}

const props = withDefaults(defineProps<BarcodeProps>(), {
  format: 'CODE128',
  displayValue: true,
  width: 2,
  height: 100,
  lineColor: '#000000',
  background: '#ffffff',
  margin: 10,
})

const barcodeRef = ref<SVGSVGElement | null>(null)
const error = ref('')

const generateBarcode = () => {
  error.value = ''
  if (barcodeRef.value && props.value) {
    barcodeRef.value.innerHTML = ''
    try {
      // Find the correct case-sensitive format if it matches the constant
      const formatObj = barcodesConstants.find(
        (b) => b.value.toLowerCase() === props.format.toLowerCase()
      )
      const actualFormat = formatObj ? formatObj.value : props.format

      JsBarcode(barcodeRef.value, props.value, {
        format: actualFormat,
        displayValue: props.displayValue,
        width: props.width,
        height: props.height,
        lineColor: props.lineColor,
        background: props.background,
        margin: props.margin,
      })
    } catch (e: any) {
      console.error('Failed to generate barcode:', e)
      error.value =
        typeof e === 'string' ? e : e?.message || 'Invalid barcode value for this format'
    }
  }
}

onMounted(() => {
  generateBarcode()
})

watch(() => props, generateBarcode, { deep: true })
</script>

<template>
  <div class="inline-flex justify-center items-center max-w-full flex-col gap-2">
    <div
      v-if="error"
      class="text-sm text-destructive px-4 py-2 bg-destructive/10 rounded-md border border-destructive/20 text-center whitespace-normal overflow-wrap-anywhere">
      {{ error }}
    </div>
    <svg
      v-show="!error"
      ref="barcodeRef"
      class="w-full h-auto max-w-full"
      preserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>
