<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center p-8 min-h-[250px] text-center">
    <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/30 border border-border/40 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <Icon :icon="icon" class="h-6 w-6 text-muted-foreground" stroke-width="1.5" />
    </div>
    <h3 class="text-lg font-semibold text-foreground tracking-tight">{{ title }}</h3>
    <p class="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed" v-html="description"></p>
    <div class="mt-6" v-if="$slots.action">
      <slot name="action" />
    </div>
  </div>
</template>
