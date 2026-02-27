<script setup lang="ts">
import Icon from '../Icon.vue'

interface Props {
  title?: string
  description?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  title: 'No data found',
  description: 'There is nothing to display here right now.',
  icon: 'lucide:inbox',
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-28 gap-5 rounded-3xl border border-gray-150 bg-muted/50 w-full mt-4">
    <div
      class="w-17 h-17 rounded-full bg-gray-200/60 border border-gray-250 shadow-inner flex items-center justify-center">
      <Icon :icon="icon" class="w-7 h-7 text-muted-foreground" stroke-width="1.2" />
    </div>
    <div class="text-center space-y-1">
      <h3 class="text-fs-5 font-semibold text-foreground tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-700 font-light leading-relaxed" v-html="description"></p>
    </div>
    <slot name="action" />
    <slot />
  </div>
</template>
