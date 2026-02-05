<script setup lang="ts">
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <Button
    variant="ghost"
    size="sm"
    icon="lucide:plus"
    title="Add New Sheet"
    rounded="none"
    @click="emit('click', $event)" />
</template>
