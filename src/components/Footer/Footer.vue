<script setup lang="ts">
import { computed } from 'vue'
import { getComponentConfig } from '@/utils/configUtils'
import type { FooterProps } from './types'
import Variant1 from './Variant1.vue'
import Variant2 from './Variant2.vue'
import Variant3 from './Variant3.vue'

const props = defineProps<FooterProps>()

const globalConfig = getComponentConfig('footer') || {}

const variant = computed(() => props.variant ?? (globalConfig as any).variant ?? 'Variant1')

const resolvedVariant = computed(() => {
  switch (variant.value) {
    case 'Variant2':
      return Variant2
    case 'Variant3':
      return Variant3
    case 'Variant1':
    default:
      return Variant1
  }
})
</script>

<template>
  <component
    :is="resolvedVariant"
    :data="props.data"
    :variant="variant"
    :labels="props.labels"
    :container-class="props.containerClass"
  />
</template>
