<script setup lang="ts">
import Badge from '@/components/Badge.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Badge</h2>
      <p class="text-gray-500">Displays a badge or a component that looks like a badge.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Variants</h3>
      <div class="flex flex-wrap gap-2">
        <Badge>Default / Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Semantic Colors</h3>
      <div class="flex flex-wrap gap-2">
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
      </div>
    </section>
  </div>
</template>
