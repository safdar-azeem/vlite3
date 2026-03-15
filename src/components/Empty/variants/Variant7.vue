<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
  <div
    class="relative flex w-full max-w-2xl flex-col items-center justify-center py-10 pl-4 md:pl-16">
    <div class="flex flex-col items-start relative">
      <div
        class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-card border shadow-xs transition-transform duration-500 hover:scale-110">
        <Icon :icon="icon" class="h-5 w-5 text-foreground" />
      </div>
      <h3 class="mb-3 font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        {{ title }}
      </h3>
      <p class="mb-10 max-w-md text-base leading-relaxed text-muted" v-html="description"></p>
      <slot name="action" />

      <!-- Narrative Timeline Line -->
      <div
        class="max-md:hidden absolute bottom-0 left-0 -ml-16 top-0 mt-4 w-px bg-linear-to-b from-border via-border/50 to-transparent md:left-6"></div>

      <!-- Node Marker -->
      <div
        class="max-md:hidden absolute left-0 -ml-16 top-0 flex h-6 w-6 mt-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-background bg-card ring-1 ring-border md:left-6">
        <div class="h-1.5 w-1.5 rounded-full bg-foreground"></div>
      </div>
    </div>
  </div>
</template>
