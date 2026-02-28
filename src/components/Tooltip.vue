<script setup lang="ts">
import ToolTipLite from 'v-tooltip-lite'
import 'v-tooltip-lite/style.css'
import type { TooltTipProps } from 'v-tooltip-lite/types'
import { computed } from 'vue'
import { $t } from '@/utils/i18n'

interface Props extends TooltTipProps {
  disabled?: boolean
  contentI18n?: string
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  class: '',
  className: '',
  teleport: true,
  arrow: true,
  contentClass: 'max-w-[350px]',
  triggerClass: '',
  disabled: false,
})

const displayContent = computed(() => {
  if (props.contentI18n) return $t(props.contentI18n)
  return props.content
})
</script>

<template>
  <div v-if="disabled" class="contents">
    <slot />
  </div>
  <ToolTipLite
    v-else
    v-bind="{...props, content: displayContent}"
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

