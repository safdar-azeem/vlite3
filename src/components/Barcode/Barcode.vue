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

const generateBarcode = () => {
  if (barcodeRef.value && props.value) {
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
    } catch (e) {
      console.error('Failed to generate barcode:', e)
    }
  }
}

onMounted(() => {
  generateBarcode()
})

watch(() => props, generateBarcode, { deep: true })
</script>

<template>
  <div class="inline-flex justify-center items-center max-w-full">
    <svg
      ref="barcodeRef"
      class="w-full h-auto max-w-full"
      preserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>
