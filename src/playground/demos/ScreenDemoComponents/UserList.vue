<script setup lang="ts">
import { DataList } from '@/components/DataList'
import Badge from '@/components/Badge.vue'
import Avatar from '@/components/Avatar.vue'

defineProps<{
  data: any[]
  loading: boolean
}>()
</script>

<template>
  <DataList :data="data" :loading="loading" :show-pagination="false" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <template #skeleton>
      <div class="bg-card border border-border rounded-xl p-4 shadow-sm animate-pulse h-[120px] flex flex-col justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-muted rounded-full"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-muted rounded w-1/2"></div>
            <div class="h-3 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </template>
    <template #item="{ item }">
      <div class="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors flex flex-col justify-between h-full">
        <div class="flex items-center gap-3">
          <Avatar :src="item.avatar" :alt="item.name" size="md" />
          <div class="min-w-0 flex-1">
            <h3 class="font-medium text-foreground truncate">{{ item.name }}</h3>
            <p class="text-sm text-muted-foreground truncate">{{ item.email }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between gap-2">
          <Badge :variant="item.status === 'active' ? 'success' : 'secondary'">{{ item.status }}</Badge>
          <span class="text-xs text-muted-foreground capitalize font-medium">{{ item.role }}</span>
        </div>
      </div>
    </template>
  </DataList>
</template>
