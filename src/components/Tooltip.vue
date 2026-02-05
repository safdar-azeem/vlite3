<script setup lang="ts">
import ToolTipLite from 'v-tooltip-lite'
import 'v-tooltip-lite/style.css'
import type { TooltTipProps } from 'v-tooltip-lite/types'

const props = withDefaults(defineProps<TooltTipProps>(), {
  placement: 'top',
  class: '',
  teleport: true,
  arrow: true,
  contentClass: 'max-w-[350px]',
  triggerClass: '',
})
</script>

<template>
  <ToolTipLite v-bind="props" class="inline-block" class-name="basic-tooltip">
    <template #trigger>
      <slot />
    </template>
    <template #default>
      <slot name="content" />
    </template>
  </ToolTipLite>
</template>
