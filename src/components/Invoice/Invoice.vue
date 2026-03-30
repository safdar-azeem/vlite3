<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceProps } from './types'
import InvoiceVariant1 from './InvoiceVariant1.vue'
import InvoiceVariant2 from './InvoiceVariant2.vue'
import InvoiceVariant3 from './InvoiceVariant3.vue'
import InvoiceVariant4 from './InvoiceVariant4.vue'

const props = withDefaults(defineProps<InvoiceProps>(), {
  variant: 'Variant1'
})

const resolvedVariant = computed(() => {
  switch (props.variant) {
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
  <component :is="resolvedVariant" v-bind="$props" />
</template>
