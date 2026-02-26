<script setup lang="ts">
import { DataTable } from '@/components/DataTable'
import Badge from '@/components/Badge.vue'
import Avatar from '@/components/Avatar.vue'

defineProps<{
  data: any[]
  loading: boolean
}>()

const headers = [
  { field: 'name', title: 'User' },
  { field: 'email', title: 'Email' },
  { field: 'role', title: 'Role', capitalize: true },
  { field: 'status', title: 'Status', capitalize: true }
]
</script>

<template>
  <DataTable
    :rows="data"
    :headers="headers"
    :loading="loading"
    :show-search="false"
    :show-pagination="false"
    hoverable
    bordered
  >
    <template #name="{ value, row }">
      <div class="flex items-center gap-3">
        <Avatar :src="row.avatar" :alt="value" size="sm" />
        <span class="font-medium">{{ value }}</span>
      </div>
    </template>
    <template #status="{ value }">
      <Badge :variant="value === 'active' ? 'success' : 'secondary'">{{ value }}</Badge>
    </template>
  </DataTable>
</template>
