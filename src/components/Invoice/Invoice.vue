<script setup lang="ts">
import { computed } from 'vue'
import { getComponentConfig } from '@/utils/configUtils'
import type { InvoiceProps } from './types'
import InvoiceVariant1 from './InvoiceVariant1.vue'
import InvoiceVariant2 from './InvoiceVariant2.vue'
import InvoiceVariant3 from './InvoiceVariant3.vue'
import InvoiceVariant4 from './InvoiceVariant4.vue'

const props = defineProps<InvoiceProps>()

const globalConfig = getComponentConfig('invoice') || {}

const variant = computed(() => props.variant ?? globalConfig.variant ?? 'Variant1')
const compact = computed(() => props.compact ?? globalConfig.compact ?? false)
const displayBarcodeValue = computed(() => props.displayBarcodeValue ?? globalConfig.displayBarcodeValue ?? false)

const resolvedVariant = computed(() => {
  switch (variant.value) {
    case 'Variant2':
      return InvoiceVariant2
    case 'Variant3':
      return InvoiceVariant3
    case 'Variant4':
      return InvoiceVariant4
    case 'Variant1':
    default:
      return InvoiceVariant1
  }
})
</script>

<template>
  <component 
    :is="resolvedVariant" 
    :data="props.data"
    :variant="variant"
    :compact="compact"
    :display-barcode-value="displayBarcodeValue"
  />
</template>
