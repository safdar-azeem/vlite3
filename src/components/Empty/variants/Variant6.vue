<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center p-10 md:p-16 text-center">
    <Icon :icon="icon" class="mb-5 h-12 w-12 text-foreground" stroke-width="1.2" />
    <h3 class="text-lg font-medium text-foreground">{{ title }}</h3>
    <p class="mt-2 text-sm text-muted max-w-sm mx-auto" v-html="description"></p>
    <div class="mt-8" v-if="$slots.action">
      <slot name="action" />
    </div>
  </div>
</template>
