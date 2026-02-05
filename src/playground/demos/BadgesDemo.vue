<script setup lang="ts">
import Badge from '@/components/Badge.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-xl font-semibold tracking-tight">Badges</h2>
      <p class="text-sm text-gray-500">
        Badges for status indicators, labels, and counts.
      </p>
    </div>

    <div class="space-y-8">
      <div class="flex flex-wrap gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
      </div>
    </div>
  </section>
</template>
