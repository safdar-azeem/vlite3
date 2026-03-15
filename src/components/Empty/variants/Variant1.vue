<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center p-10 md:p-16 text-center">
    <Icon :icon="icon" class="mb-3 h-10 w-10 text-muted" stroke-width="1.2" />
    <h3 class="text-2xl font-medium text-foreground">{{ title }}</h3>
    <p class="mt-1.5 text-sm text-muted max-w-sm mx-auto" v-html="description"></p>
    <div class="mt-5" v-if="$slots.action">
      <slot name="action" />
    </div>
  </div>
</template>
