<script setup lang="ts">
import Icon from '@/components/Icon.vue'

defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div class="group flex flex-col items-center text-center py-14 cursor-default">
    <h3 class="text-lg mb-1.5 font-semibold text-foreground tracking-tight">{{ title }}</h3>
    <p class="text-xs mb-4.5 text-foreground/40 leading-relaxed font-light" v-html="description" />
    <slot name="action" />
  </div>
</template>
