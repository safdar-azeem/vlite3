<script setup lang="ts">
import Icon from '../Icon.vue'
import type { TimelineProgressStatus, TimelineIndicatorType } from '@/types'

interface Props {
  status: TimelineProgressStatus
  type: TimelineIndicatorType
  index: number
  icon?: string
}

const props = defineProps<Props>()
</script>

<template>
  <span
    class="flex items-center justify-center shrink-0 z-10"
    aria-hidden="true"
    :class="[type === 'dot' ? 'h-5 w-5' : 'h-9 w-9']">
    <span
      v-if="type === 'number'"
      class="relative z-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors h-8 w-8"
      :class="
        status === 'completed' || status === 'current'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
      ">
      {{ index + 1 }}
    </span>

    <span
      v-else-if="type === 'dot'"
      class="relative z-10 flex items-center justify-center rounded-full transition-colors h-3.5 w-3.5"
      :class="[
        status === 'completed' || status === 'current' ? 'bg-primary' : 'bg-border',
        status === 'current' ? 'ring-4 ring-primary/20' : '',
      ]">
    </span>

    <template v-else>
      <span
        v-if="status === 'completed'"
        class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary-dark transition-colors">
        <Icon icon="lucide:check" class="h-5 w-5 text-primary-foreground" />
      </span>

      <span
        v-else-if="status === 'current'"
        class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
        <Icon v-if="icon" :icon="icon" class="h-4 w-4 text-primary" />
        <span v-else class="h-2.5 w-2.5 rounded-full bg-primary" />
      </span>

      <span
        v-else
        class="relative z-10 flex h-8 w-8 items-center justify-center border-2 bg-background group-hover:border-muted-foreground transition-colors rounded-full!">
        <Icon v-if="icon" :icon="icon" class="h-4 w-4 text-muted-foreground" />
        <span v-else class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-muted" />
      </span>
    </template>
  </span>
</template>
