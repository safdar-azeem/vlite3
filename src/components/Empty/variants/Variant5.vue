<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div class="flex flex-col items-center text-center w-full py-4">
    <div class="mb-5 p-5 rounded-3xl bg-card border shadow-xs transition-shadow hover:shadow-sm">
      <Icon :icon="icon" class="w-8 h-8 text-foreground" stroke-width="1.2" />
    </div>
    <h3 class="text-2xl font-semibold tracking-tight text-foreground mb-2.5">{{ title }}</h3>
    <p
      class="text-sm text-muted max-w-[280px] mb-5.5 leading-relaxed font-normal"
      v-html="description"></p>
    <slot name="action" />
  </div>
</template>
