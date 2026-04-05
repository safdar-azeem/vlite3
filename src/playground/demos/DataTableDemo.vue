<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DataTable } from '@/components/DataTable'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import Avatar from '@/components/Avatar.vue'
import CheckBox from '@/components/CheckBox.vue'
import type { TableHeader, TableFilter, TableState } from '@/components/DataTable/types'
import { useGetUsers, type User } from '../composables/useGetUsers'
import DemoSection from '../DemoSection.vue'
import sourceCode from './DataTableDemo.vue?raw'
import { PageInfo } from '@/components/Pagination'

// Controls mapping
const isTableSortable = ref(true)
const isBordered = ref(true)
const isStriped = ref(false)
const isCompact = ref(false)
const isHoverable = ref(true)
const isSelectable = ref(true)
const isRaised = ref(false)

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

// Initial state — matches the standardized payload shape
const currentTableState = ref<TableState>({
  pagination: {
    page: 1,
    limit: 10,
  },
  sort: {
    field: '',
    order: '',
  },
  filter: {},
})

const handleTableChange = async (state: TableState) => {
  currentTableState.value = state
  await refreshData()
}

const refreshData = async () => {
  const filter: TableFilter = {
    pagination: currentTableState.value.pagination,
    sort: currentTableState.value.sort,
    filter: currentTableState.value.filter,
  }
  await refetch(filter)
}

// Fetch initial data on mount natively without relying on component emitting changes
onMounted(() => {
  refreshData()
})

const handleEdit = (user: User) => {
  alert(`Editing user: ${user.name}`)
}

const handleView = (user: User) => {
  alert(`Viewing user: ${user.name}`)
}

const getStatusVariant = (status: string) => {
  const map: Record<string, 'success' | 'secondary' | 'warning'> = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
  }
  return map[status] || 'secondary'
}

const handleDelete = (rows: User[]) => {
  alert(`Deleting ${rows.length} users:\n` + rows.map((u) => u.name).join(', '))
}
</script>

<template>
  <div class="space-y-12">
    <!-- Header & Controls -->
    <div class="space-y-6 pb-8 border-b border-border/50">
      <div class="space-y-2">
        <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
          DataTable
        </h2>
        <p class="text-lg text-muted-foreground w-full max-w-[80%]">
          A powerful data table component with sorting, pagination, and endless configuration
          options.
        </p>
      </div>

      <!-- Config Checkboxes -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-6 rounded-2xl border border-border/40">
        <CheckBox v-model="isTableSortable" label="Sortable Columns" />
        <CheckBox v-model="isBordered" label="Show Borders" />
        <CheckBox v-model="isStriped" label="Zebra Stripes" />
        <CheckBox v-model="isCompact" label="Compact Padding" />
        <CheckBox v-model="isHoverable" label="Row Hover Effect" />
        <CheckBox v-model="isSelectable" label="Selectable Rows" />
        <CheckBox v-model="isRaised" label="Raised Variant" />
      </div>
    </div>

    <!-- Demo Section -->
    <DemoSection title="Playground" :code="sourceCode">
      <h2 class="text-lg font-semibold max-sm:px-2">User Management</h2>
      <p class="text-sm text-muted-foreground mb-6 max-sm:px-2">
        Manage team members and their roles across your organization.
      </p>

      <DataTable
        :rows="users"
        :headers="columns"
        :page-info="pageInfo"
        :loading="loading"
        :sortable="isTableSortable"
        :bordered="isBordered"
        :striped="isStriped"
        :compact="isCompact"
        :hoverable="isHoverable"
        :hide-selectable="!isSelectable"
        :variant="isRaised ? 'raised' : 'default'"
        key-field="_id"
        empty-title="No users found"
        empty-description="We couldn't find any users matching your criteria."
        @change="handleTableChange"
        @delete="handleDelete">
        <template #name="{ value, row }">
          <div class="flex items-center gap-3">
            <Avatar :src="row.avatar" :alt="value" size="sm" />
            <div class="min-w-0">
              <p class="font-medium text-foreground truncate">
                {{ value }}
              </p>
              <p class="text-xs text-muted-foreground truncate md:hidden">
                {{ row.email }}
              </p>
            </div>
          </div>
        </template>

        <template #status="{ value }">
          <Badge :variant="getStatusVariant(value)">
            {{ value }}
          </Badge>
        </template>

        <template #action="{ row }">
          <div class="flex items-center justify-end gap-1">
            <Button variant="ghost" size="sm" icon="lucide:eye" @click.stop="handleView(row)" />
            <Button variant="ghost" size="sm" icon="lucide:pencil" @click.stop="handleEdit(row)" />
          </div>
        </template>
      </DataTable>
    </DemoSection>
  </div>
</template>
