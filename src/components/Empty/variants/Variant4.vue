<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center py-24 px-6 min-h-[400px]">
    <div class="flex flex-col w-full max-w-md text-left">
      <h3
        class="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1] max-w-[280px]">
        {{ title }}
      </h3>

      <div class="flex items-center w-full my-6">
        <div class="h-[2px] flex-1 bg-gradient-to-r from-gray-150 via-gray-300 to-gray-100"></div>
        <div class="h-2.5 w-2.5 rounded-full bg-gray-300 ml-1 shrink-0"></div>
      </div>

      <p class="text-sm sm:text-base text-muted leading-relaxed" v-html="description"></p>

      <div class="mt-8" v-if="$slots.action">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>
