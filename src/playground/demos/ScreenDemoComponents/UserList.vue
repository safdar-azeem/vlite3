<script setup lang="ts">
import { DataList } from '@/components/DataList'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const props = defineProps<{
  data?: any[]
  loading?: boolean
  delete?: (items: any[]) => void
}>()
</script>

<template>
  <DataList :data="data || []" :loading="loading" class-name="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <template #item="{ item }">
      <div class="p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <h3 class="font-semibold text-foreground text-lg">{{ item.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ item.email }}</p>
          </div>
          <span
            class="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
            :class="item.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'"
          >
            {{ item.status }}
          </span>
        </div>
        
        <div class="mt-auto flex justify-between items-center pt-4 border-t border-border">
          <div class="flex items-center text-sm text-muted-foreground gap-1.5">
            <Icon icon="lucide:shield" class="w-4 h-4" />
            <span class="capitalize">{{ item.role || 'User' }}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon="lucide:trash-2"
            class="text-destructive border-destructive hover:bg-destructive/10"
            @click="props.delete?.([item])"
          >
            Delete
          </Button>
        </div>
      </div>
    </template>
  </DataList>
</template>
