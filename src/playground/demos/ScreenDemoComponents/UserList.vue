<script setup lang="ts">
import { DataList } from '@/components/DataList'
import Avatar from '@/components/Avatar.vue'
import Badge from '@/components/Badge.vue'
import Button from '@/components/Button.vue'

const props = defineProps<{
  data?: any[]
  loading?: boolean
  delete?: (items: any[]) => void
}>()
</script>

<template>
  <DataList
    :data="data || []"
    :loading="loading"
    :show-pagination="false"
    class-name="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    <template #skeleton>
      <div class="bg-card border border-border rounded-xl p-5 h-[152px] animate-pulse flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-full bg-muted shrink-0"></div>
          <div class="flex flex-col gap-2 flex-1">
            <div class="h-3.5 bg-muted rounded w-3/4"></div>
            <div class="h-2.5 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div class="flex justify-between mt-auto pt-3 border-t border-border/60">
          <div class="h-2.5 bg-muted rounded w-1/3"></div>
          <div class="h-5 bg-muted rounded-full w-16"></div>
        </div>
      </div>
    </template>

    <template #item="{ item }">
      <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 group">
        <div class="flex items-center gap-4">
          <Avatar
            :src="item.avatar || `https://i.pravatar.cc/150?u=${item._id}`"
            :alt="item.name"
            size="md"
            class="shrink-0 group-hover:scale-105 transition-transform duration-200"
          />
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-foreground truncate">{{ item.name }}</h3>
            <p class="text-sm text-muted-foreground truncate">{{ item.email }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-border/60 mt-auto">
          <div class="min-w-0">
            <p class="text-xs font-medium text-foreground truncate">{{ item.role }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ item.department }}</p>
          </div>
          <Badge
            :variant="item.status === 'active' ? 'success' : item.status === 'pending' ? 'warning' : 'secondary'"
            class="shrink-0"
          >
            {{ item.status }}
          </Badge>
        </div>
      </div>
    </template>
  </DataList>
</template>
