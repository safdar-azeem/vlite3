<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DataTable } from '@/components/DataTable'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import Avatar from '@/components/Avatar.vue'
import type {
  TableHeader,
  TableFilter,
  PageInfo,
  PaginationConfig,
  SortConfig,
  SelectionState,
  TableState,
} from '@/components/DataTable/types'
import { useGetUsers, type User } from '../composables/useGetUsers'
import DemoSection from '../DemoSection.vue'
import sourceCode from './DataTableDemo.vue?raw'

const searchQuery = ref('')
const isTableSortable = ref(true)
const isRaised = ref(false)
// selectedCount definition removed (ref defined later)

const { result, loading, refetch } = useGetUsers()

const users = computed<User[]>(() => result.value?.users || [])
const pageInfo = computed<PageInfo | undefined>(() => result.value?.pageInfo)

const columns = ref<TableHeader[]>([
  {
    field: 'name',
    title: 'User',
    sortable: true,
  },
  {
    field: 'email',
    title: 'Email',
    width: '25%',
    sortable: true,
    hideOnMobile: true,
  },
  {
    field: 'role',
    title: 'Role',
    width: '15%',
    sortable: true,
    capitalize: true,
  },
  {
    field: 'department',
    title: 'Department',
    width: '15%',
    sortable: true,
    hideOnMobile: true,
  },
  {
    field: 'status',
    title: 'Status',
    width: '10%',
    sortable: true,
    capitalize: true,
    addStatusColor: true,
  },
  {
    field: 'action',
    title: 'Actions',
    width: '5%',
    sortable: false,
    align: 'center',
  },
])

// Initial state
const currentTableState = ref<TableState>({
  pagination: {
    page: 1,
    limit: 10,
  },
  sorting: {
    field: '',
    order: '',
  },
  search: '',
})

const handleTableChange = async (state: TableState) => {
  console.log('handleTableChange', state)
  currentTableState.value = state
  await refreshData()
}

const refreshData = async () => {
  const filter: TableFilter = {
    pagination: currentTableState.value.pagination,
    filter: {
      search: currentTableState.value.search,
      sorting: currentTableState.value.sorting,
    },
  }
  console.log('Fetching data with:', filter)
  await refetch(filter)
}

const handleEdit = (user: User) => {
  console.log('Edit user:', user)
  alert(`Edit user: ${user.name}`)
}

const handleView = (user: User) => {
  console.log('View user:', user)
  alert(`View user: ${user.name}`)
}

const getStatusVariant = (status: string) => {
  const map: Record<string, 'success' | 'secondary' | 'warning'> = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
  }
  return map[status] || 'secondary'
}

const handleAddUser = () => {
  alert('Add User Clicked')
}

const handleDelete = (rows: User[]) => {
  console.log('Delete rows:', rows)
  alert(`Deleting ${rows.length} users:\n` + rows.map((u) => u.name).join(', '))
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">DataTable</h1>
        <label class="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" v-model="isTableSortable" class="rounded border-gray-300" />
          Global Sortable
        </label>
        <label class="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" v-model="isRaised" class="rounded border-gray-300" />
          Raised Variant
        </label>
      </div>
      <p class="text-muted-foreground">
        Refactored DataTable with external controls (Search, Actions) and built-in pagination.
      </p>
    </div>

    <!-- Main Demo -->
    <DemoSection title="User Management" :code="sourceCode">
      <h2 class="text-lg font-semibold">User Management</h2>

      <DataTable
        :rows="users"
        :headers="columns"
        :page-info="pageInfo"
        :loading="loading"
        :search="searchQuery"
        :sortable="isTableSortable"
        :variant="isRaised ? 'raised' : 'default'"
        :items-per-page-options="[10, 25, 50, 100]"
        key-field="_id"
        selectable
        hoverable
        bordered
        empty-title="No users found"
        empty-description="We couldn't find any users matching your search criteria."
        @change="handleTableChange"
        @delete="handleDelete">
        <!-- Custom User Cell with Avatar -->
        <template #name="{ value }">
          <div class="flex items-center gap-3">
            <Avatar :src="value.avatar" :alt="value.name" size="sm" />
            <div class="min-w-0">
              <p class="font-medium text-foreground truncate">
                {{ value.name }}
              </p>
              <p class="text-xs text-muted-foreground truncate md:hidden">
                {{ value.email }}
              </p>
            </div>
          </div>
        </template>

        <!-- Status Badge -->
        <template #status="{ value }">
          <Badge :variant="getStatusVariant(value.status)">
            {{ value.status }}
          </Badge>
        </template>

        <!-- Actions Column -->
        <template #action="{ value }">
          <div class="flex items-center justify-end gap-1">
            <Button variant="ghost" size="xs" icon="lucide:eye" @click.stop="handleView(value)" />
            <Button
              variant="ghost"
              size="xs"
              icon="lucide:pencil"
              @click.stop="handleEdit(value)" />
          </div>
        </template>
      </DataTable>
    </DemoSection>
  </div>
</template>
