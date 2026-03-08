<script setup lang="ts">
import { computed } from 'vue'
import { Chip } from '@/components/Chip'
import type { ChipProps } from '@/components/Chip/types'
import { resolveStatus } from './status-map'
import { $t } from '@/utils/i18n'

interface Props {
  /** The status value (e.g. 'in_progress', 'Approved', 'CANCELLED') */
  status: string
  /** Override resolved label (falls back to status if not provided) */
  label?: string
  /** i18n key for the label */
  labelI18n?: string
  /** Hide the icon even when one is resolved */
  hideIcon?: boolean
  /** Override chip size */
  size?: ChipProps['size']
  /** Extra classes */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  hideIcon: false,
  size: 'medium',
  class: '',
})

const config = computed(() => resolveStatus(props.status))

const displayLabel = computed(() => {
  if (props.labelI18n) return $t(props.labelI18n)
  if (props.label) return props.label
  // Format status as readable label: 'in_progress' → 'In Progress'
  return props.status
    .replace(/[_\-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
})
</script>

<template>
  <Chip
    :text="displayLabel"
    :variant="config.variant"
    :icon="hideIcon ? undefined : config.icon"
    :size="size"
    :class="props.class"
  />
</template>
