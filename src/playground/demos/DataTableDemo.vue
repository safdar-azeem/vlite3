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

// ─── Visual Controls ────────────────────────────────────────────
const isTableSortable = ref(true)
const isBordered = ref(true)
const isCellBordered = ref(false)
const isStriped = ref(false)
const isHoverable = ref(true)
const isSelectable = ref(true)
const isRaised = ref(false)

// ─── Column Visibility ──────────────────────────────────────────
const showEmail = ref(true)
const showDepartment = ref(true)
const showSalary = ref(false)
const showJoinDate = ref(false)

// ─── Size & Header Variant ──────────────────────────────────────
const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
const headerVariant = ref<'default' | 'minimal'>('default')

// ─── Data ───────────────────────────────────────────────────────
const { result, loading, refetch } = useGetUsers()

const users = computed<User[]>(() => result.value?.users || [])
const pageInfo = computed<PageInfo | undefined>(() => result.value?.pageInfo)

// ─── Dynamic Columns ─────────────────────────────────────────────
const columns = computed<TableHeader[]>(() => {
  const cols: TableHeader[] = [
    { field: 'name', title: 'User', sortable: true },
  ]
  if (showEmail.value)
    cols.push({ field: 'email', title: 'Email', width: '22%', sortable: true, hideOnMobile: true })
  cols.push({ field: 'role', title: 'Role', width: '12%', sortable: true, capitalize: true })
  if (showDepartment.value)
    cols.push({ field: 'department', title: 'Department', width: '14%', sortable: true, hideOnMobile: true })
  if (showSalary.value)
    cols.push({ field: 'salary', title: 'Salary', width: '10%', sortable: true, align: 'right' })
  if (showJoinDate.value)
    cols.push({ field: 'joinDate', title: 'Joined', width: '10%', sortable: true, hideOnMobile: true })
  cols.push({
    field: 'status',
    title: 'Status',
    width: '10%',
    sortable: true,
    capitalize: true,
    addStatusColor: true,
  })
  cols.push({ field: 'action', title: 'Actions', width: '80px', sortable: false, align: 'center' })
  return cols
})

// Minimal demo uses a static column set
const minimalColumns: TableHeader[] = [
  { field: 'name', title: 'User', sortable: true },
  { field: 'email', title: 'Email', sortable: true },
  { field: 'role', title: 'Role', capitalize: true },
  { field: 'status', title: 'Status', capitalize: true, addStatusColor: true },
]

// ─── Table State ─────────────────────────────────────────────────
const currentTableState = ref<TableState>({
  pagination: { page: 1, limit: 10 },
  sort: { field: '', order: '' },
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

onMounted(() => {
  refreshData()
})

// ─── Actions ─────────────────────────────────────────────────────
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

const formatSalary = (val: number) =>
  val ? `$${val.toLocaleString()}` : '—'

const formatDate = (val: string) =>
  val ? new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
</script>

<template>
  <div class="space-y-10">
    <!-- ─── Page Header ─────────────────────────────────────────── -->
    <div class="space-y-4 pb-6 border-b border-border/50">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">DataTable</span>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div class="space-y-1.5">
          <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
            DataTable
          </h2>
          <p class="text-lg text-muted-foreground max-w-[70ch]">
            A powerful data table with sorting, pagination, row selection, and beautiful configuration
            options. Every prop is live-editable below.
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <div class="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            {{ pageInfo?.totalItems ?? 0 }} users
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Control Panel ─────────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Behavior toggles -->
      <div class="bg-muted/20 border border-border/40 rounded-xl p-5 space-y-4 col-span-1">
        <div>
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Table Behavior</span>
          <div class="grid grid-cols-2 gap-3">
            <CheckBox v-model="isTableSortable" label="Sortable" />
            <CheckBox v-model="isBordered" label="Outer Border" />
            <CheckBox v-model="isCellBordered" label="Cell Borders" />
            <CheckBox v-model="isStriped" label="Striped Rows" />
            <CheckBox v-model="isHoverable" label="Hoverable" />
            <CheckBox v-model="isSelectable" label="Selectable" />
            <CheckBox v-model="isRaised" label="Raised Card" />
          </div>
        </div>
      </div>

      <!-- Column visibility -->
      <div class="bg-muted/20 border border-border/40 rounded-xl p-5 space-y-4 col-span-1">
        <div>
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Column Visibility</span>
          <div class="grid grid-cols-2 gap-3">
            <CheckBox v-model="showEmail" label="Email" />
            <CheckBox v-model="showDepartment" label="Department" />
            <CheckBox v-model="showSalary" label="Salary" />
            <CheckBox v-model="showJoinDate" label="Join Date" />
          </div>
        </div>
      </div>

      <!-- Size & header variant -->
      <div class="bg-muted/20 border border-border/40 rounded-xl p-5 space-y-4 col-span-1">
        <div>
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Table Size</span>
          <div class="flex flex-wrap gap-2">
            <Button size="sm" :variant="size === 'xs' ? 'primary' : 'outline'" @click="size = 'xs'">XS</Button>
            <Button size="sm" :variant="size === 'sm' ? 'primary' : 'outline'" @click="size = 'sm'">SM</Button>
            <Button size="sm" :variant="size === 'md' ? 'primary' : 'outline'" @click="size = 'md'">MD</Button>
            <Button size="sm" :variant="size === 'lg' ? 'primary' : 'outline'" @click="size = 'lg'">LG</Button>
          </div>
        </div>
        <div>
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Header Style</span>
          <div class="flex gap-2">
            <Button size="sm" :variant="headerVariant === 'default' ? 'primary' : 'outline'" @click="headerVariant = 'default'">Default</Button>
            <Button size="sm" :variant="headerVariant === 'minimal' ? 'primary' : 'outline'" @click="headerVariant = 'minimal'">Minimal</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Demo Section: Playground ─────────────────────────── -->
    <DemoSection title="User Management Playground" :code="sourceCode" align="stretch">
      <div class="w-full space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 max-sm:px-1">
          <div>
            <h3 class="text-base font-semibold text-foreground">Team Members</h3>
            <p class="text-sm text-muted-foreground">
              Manage team members and their roles across your organization.
            </p>
          </div>
          <Button variant="primary" size="sm" icon="lucide:user-plus">
            Invite Member
          </Button>
        </div>

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
          empty-title="No team members found"
          empty-description="We couldn't find any users matching your criteria."
          @change="handleTableChange"
          @delete="handleDelete"
        >
          <template #name="{ value, row }">
            <div class="flex items-center gap-3">
              <Avatar :src="row.avatar" :alt="value" size="sm" />
              <div class="min-w-0">
                <p class="font-medium text-foreground truncate">{{ value }}</p>
                <p class="text-xs text-muted-foreground truncate md:hidden">{{ row.email }}</p>
              </div>
            </div>
          </template>

          <template #salary="{ value }">
            <span class="font-medium tabular-nums">{{ formatSalary(value) }}</span>
          </template>

          <template #joinDate="{ value }">
            <span class="text-muted-foreground text-sm">{{ formatDate(value) }}</span>
          </template>

          <template #status="{ value }">
            <Badge :variant="getStatusVariant(value)">{{ value }}</Badge>
          </template>

          <template #action="{ row }">
            <div class="flex items-center justify-end gap-1">
              <Button variant="ghost" size="sm" icon="lucide:eye" @click.stop="handleView(row)" />
              <Button variant="ghost" size="sm" icon="lucide:pencil" @click.stop="handleEdit(row)" />
            </div>
          </template>
        </DataTable>
      </div>
    </DemoSection>

    <!-- ─── Demo Section: Minimal Header ─────────────────────── -->
    <div class="space-y-3">
      <div>
        <h3 class="text-base font-semibold text-foreground">Minimal Header Variant</h3>
        <p class="text-sm text-muted-foreground max-w-[65ch]">
          The <code class="text-xs bg-muted px-1 py-0.5 rounded">header-variant="minimal"</code> style
          removes the background fill from the header row, giving the table a cleaner, editorial look.
          Great for lightweight data summaries and dashboards.
        </p>
      </div>
    </div>

    <DemoSection title="Minimal Header Variant" :code="sourceCode" align="stretch">
      <DataTable
        :rows="users"
        :headers="minimalColumns"
        :page-info="pageInfo"
        :loading="loading"
        sortable
        hoverable
        bordered
        header-variant="minimal"
        key-field="_id"
        empty-title="No users found"
        @change="handleTableChange"
      >
        <template #name="{ value, row }">
          <div class="flex items-center gap-3">
            <Avatar :src="row.avatar" :alt="value" size="sm" />
            <div class="min-w-0">
              <p class="font-medium text-foreground truncate">{{ value }}</p>
            </div>
          </div>
        </template>
        <template #status="{ value }">
          <Badge :variant="getStatusVariant(value)">{{ value }}</Badge>
        </template>
      </DataTable>
    </DemoSection>
  </div>
</template>
