<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div
    class="flex w-full flex-col items-center justify-center p-10 min-h-[450px] text-center rounded-2xl bg-card">
    <Icon :icon="icon" class="mb-3 h-12 w-12 text-muted" stroke-width="1.2" />
    <h3 class="text-fs-5 font-semibold text-foreground">{{ title }}</h3>
    <p class="mt-1.5 text-sm text-muted max-w-md mx-auto" v-html="description"></p>
    <div class="mt-6" v-if="$slots.action">
      <slot name="action" />
    </div>
  </div>
</template>
