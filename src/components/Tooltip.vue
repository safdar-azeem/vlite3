<script setup lang="ts">
import ToolTipLite from 'v-tooltip-lite'
import 'v-tooltip-lite/style.css'
import type { TooltTipProps } from 'v-tooltip-lite/types'

const props = withDefaults(defineProps<TooltTipProps & { disabled?: boolean }>(), {
  placement: 'top',
  class: '',
  className: '',
  teleport: true,
  arrow: true,
  contentClass: 'max-w-[350px]',
  triggerClass: '',
  disabled: false,
})
</script>

<template>
  <div v-if="disabled" class="contents">
    <slot />
  </div>
  <ToolTipLite
    v-else
    v-bind="props"
    class="inline-block"
    :class-name="`basic-tooltip ${className}`">
    <template #trigger>
      <slot />
    </template>
    <template #default>
      <slot name="content" />
    </template>
  </ToolTipLite>
</template>
