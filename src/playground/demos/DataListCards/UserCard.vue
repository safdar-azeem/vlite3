<script setup lang="ts">
import Avatar from '@/components/Avatar.vue'
import Badge from '@/components/Badge.vue'

defineProps<{
  item: any
  index?: number
}>()
</script>

<template>
  <div class="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200 group">
    <div class="flex items-center gap-4">
      <Avatar :src="item.avatar" :alt="item.name" size="lg" class="group-hover:scale-105 transition-transform" />
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-foreground text-base truncate">{{ item.name }}</h3>
        <p class="text-sm text-muted-foreground truncate">{{ item.email }}</p>
      </div>
    </div>
    <div class="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
      <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">{{ item.department }}</span>
      <Badge :variant="item.status === 'active' ? 'success' : item.status === 'pending' ? 'warning' : 'secondary'">
        {{ item.status }}
      </Badge>
    </div>
  </div>
</template>
