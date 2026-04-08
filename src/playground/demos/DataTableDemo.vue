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
const isCellBordered = ref(false)
const isStriped = ref(false)
const isHoverable = ref(true)
const isSelectable = ref(true)
const isRaised = ref(false)

const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
const headerVariant = ref<'default' | 'minimal'>('default')

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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Config Checkboxes -->
        <div
          class="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/30 p-6 rounded-2xl border border-border/40 content-start">
          <CheckBox v-model="isTableSortable" label="Sortable" />
          <CheckBox v-model="isBordered" label="Outer Borders" />
          <CheckBox v-model="isCellBordered" label="Cell Borders" />
          <CheckBox v-model="isStriped" label="Striped" />
          <CheckBox v-model="isHoverable" label="Hoverable" />
          <CheckBox v-model="isSelectable" label="Selectable" />
          <CheckBox v-model="isRaised" label="Raised" />
        </div>

        <!-- Sizing & Variants -->
        <div class="flex flex-col gap-5 bg-muted/30 p-6 rounded-2xl border border-border/40">
          <div>
            <span class="text-sm font-medium mb-3 block text-foreground">Table Size</span>
            <div class="flex items-center gap-2">
              <Button size="sm" :variant="size === 'xs' ? 'primary' : 'outline'" @click="size = 'xs'">XS</Button>
              <Button size="sm" :variant="size === 'sm' ? 'primary' : 'outline'" @click="size = 'sm'">SM</Button>
              <Button size="sm" :variant="size === 'md' ? 'primary' : 'outline'" @click="size = 'md'">MD</Button>
              <Button size="sm" :variant="size === 'lg' ? 'primary' : 'outline'" @click="size = 'lg'">LG</Button>
            </div>
          </div>
          <div>
            <span class="text-sm font-medium mb-3 block text-foreground">Header Variant</span>
            <div class="flex items-center gap-2">
              <Button size="sm" :variant="headerVariant === 'default' ? 'primary' : 'outline'" @click="headerVariant = 'default'">Default</Button>
              <Button size="sm" :variant="headerVariant === 'minimal' ? 'primary' : 'outline'" @click="headerVariant = 'minimal'">Minimal</Button>
            </div>
          </div>
        </div>
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
        :cell-bordered="isCellBordered"
        :striped="isStriped"
        :size="size"
        :header-variant="headerVariant"
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
