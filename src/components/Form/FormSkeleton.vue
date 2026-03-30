<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rows?: number
  isGrouped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  isGrouped: false,
})

const rowCount = computed(() => props.rows)
</script>

<template>
  <div class="form-skeleton w-full animate-pulse">
    <!-- Grouped Skeleton -->
    <div v-if="isGrouped" class="space-y-6">
      <div
        v-for="group in 2"
        :key="group"
        class="form-group border rounded overflow-hidden bg-body"
      >
        <div class="form-group-header bg-muted/50 px-4 py-3 border-b flex flex-col gap-2">
          <div class="h-5 bg-muted rounded w-1/3"></div>
          <div class="h-3 bg-muted rounded w-1/2"></div>
        </div>
        <div class="form-group-body p-4.5 space-y-6">
          <div v-for="i in 2" :key="i" class="space-y-2">
            <div class="h-4 bg-muted rounded w-1/4"></div>
            <div class="h-10 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Flat Skeleton -->
    <div v-else class="space-y-6">
      <div v-for="i in rowCount" :key="i" class="space-y-2">
        <div class="h-4 bg-muted rounded w-1/4"></div>
        <div class="h-10 bg-muted rounded w-full"></div>
      </div>
    </div>
  </div>
</template>
