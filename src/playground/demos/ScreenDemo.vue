<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { Screen } from '@/components/Screen'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ScreenDemo.vue?raw'
import { useGetUsers } from '../composables/useGetUsers'

// Lazy Loading custom heavy components specific to the Screen
const UserList = defineAsyncComponent(() => import('./ScreenDemoComponents/UserList.vue'))
const UserTable = defineAsyncComponent(() => import('./ScreenDemoComponents/UserTable.vue'))
const AddUser = defineAsyncComponent(() => import('./ScreenDemoComponents/AddUser.vue'))

// Separate data instances so both Screen demos are independent
const {
  result: result1,
  loading: loading1,
  refetch: refetch1,
} = useGetUsers({
  pagination: { page: 1, limit: 10 },
  filter: { search: '' },
})

const {
  result: result2,
  loading: loading2,
  refetch: refetch2,
} = useGetUsers({
  pagination: { page: 1, limit: 10 },
  filter: { search: '' },
})

const fetchData1 = (payload?: any) => {
  refetch1(payload || { pagination: { page: 1, limit: 10 }, filter: { search: '' } })
}

const fetchData2 = (payload?: any) => {
  refetch2(payload || { pagination: { page: 1, limit: 10 }, filter: { search: '' } })
}

const handleDelete1 = (items: any[]) => {
  alert(`Deleted ${items.length} item(s) successfully!`)
  fetchData1()
}

const handleDelete2 = (items: any[]) => {
  alert(`Deleted ${items.length} item(s) successfully!`)
  fetchData2()
}

// Controls for demo toggles
const showRefresh1 = ref(true)
const showExport = ref(true)
const showImport = ref(true)
const filterType = ref<'dropdown' | 'sidebar'>('dropdown')
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- ─── Page Header ─────────────────────────────────────────── -->
    <div class="space-y-4 pb-6 border-b border-border/50">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">Screen</span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Screen</h2>
      <p class="text-lg text-muted-foreground max-w-[75ch]">
        A high-level page wrapper that auto-manages title, search, pagination, actions, and
        seamlessly toggles between custom <strong class="text-foreground">Table</strong> and
        <strong class="text-foreground">List</strong> views. View preferences are persisted to
        <code class="text-xs bg-muted px-1 py-0.5 rounded">localStorage</code> using the
        <code class="text-xs bg-muted px-1 py-0.5 rounded">name</code> prop as the key.
      </p>

      <!-- Feature pills -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="feat in [
            'Auto-pagination',
            'Search built-in',
            'Sort support',
            'Export / Import',
            'Quick Filters',
            'View toggle',
            'Add modal',
            'Stats bar',
          ]"
          :key="feat"
          class="px-2.5 py-1 rounded-md bg-muted/50 border border-border/40 text-xs font-medium text-muted-foreground">
          {{ feat }}
        </span>
      </div>
    </div>

    <!-- ─── SECTION 1: Default Screen ────────────────────────── -->
    <div class="space-y-3">
      <h3 class="text-base font-semibold text-foreground">Default Screen — Users Directory</h3>
      <p class="text-sm text-muted-foreground max-w-[65ch]">
        The standard Screen layout. Includes a title, description, search input, quick filters, view
        toggle (table ↔ list), add button with modal, export &amp; import, and built-in pagination.
      </p>
    </div>

    <DemoSection title="Default Screen" :code="sourceCode" align="stretch">
      <Screen
        name="users-directory-demo"
        title="Users Directory"
        info="Manage all system users from a single, unified interface."
        description="Browse, search, filter and manage user accounts across your organization."
        :data="result1?.users"
        :loading="loading1"
        :page-info="result1?.pageInfo"
        :refetch="fetchData1"
        :list="UserList"
        :table="UserTable"
        show-refresh
        :quick-filters="[
          { label: 'All', value: '' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Pending', value: 'pending' },
        ]"
        :skip-quick-filter-views="['list']"
        :filter-schema="[
          { name: 'user', type: 'text', label: 'User Name' },

          {
            name: 'userType',
            label: 'User Type',
            type: 'select',
            options: [
              { label: 'Employee', value: 'EMPLOYEE' },
              { label: 'Customer', value: 'CUSTOMER' },
              { label: 'Supplier', value: 'SUPPLIER' },
              { label: 'Contractor', value: 'CONTRACTOR' },
              { label: 'Client', value: 'CLIENT' },
            ],
          },
        ]"
        :export-schema="[
          { field: 'id', title: 'ID', required: true },
          { field: 'name', title: 'Full Name', required: true },
          { field: 'email', title: 'Email Address', required: true },
          { field: 'role', title: 'Role' },
          { field: 'department', title: 'Department' },
          { field: 'status', title: 'Account Status' },
        ]"
        :import-schema="[
          { field: 'id', title: 'ID', required: true },
          { field: 'name', title: 'Full Name', required: true },
          { field: 'email', title: 'Email Address', required: true },
          { field: 'role', title: 'Role' },
          { field: 'status', title: 'Account Status' },
        ]"
        filter-type="dropdown"
        export-props
        import-props
        export-mode="backend"
        export-type="user"
        import-type="user"
        @delete="handleDelete1"
        :add-btn="{
          modal: AddUser,
          label: 'Add User',
          modalProps: { title: 'Add User' },
        }" />
    </DemoSection>

    <!-- ─── SECTION 2: Variant Two ─────────────────────────── -->
    <div class="space-y-3">
      <h3 class="text-base font-semibold text-foreground">Stats Layout — Variant Two</h3>
      <p class="text-sm text-muted-foreground max-w-[65ch]">
        <code class="text-xs bg-muted px-1 py-0.5 rounded">variant="two"</code> moves stats directly
        opposite to the title, while quick-filters appear on the actions row. Great for dashboards
        that need KPI numbers visible at a glance.
      </p>
    </div>

    <DemoSection title="Screen Variant Two" :code="sourceCode" align="stretch">
      <Screen
        name="employees-directory-demo"
        title="Employees"
        info="Variant two layout — stats sit opposite the title, quick-filters move to the actions row."
        description="Manage your organization's employees and staff details."
        variant="two"
        :stats="[
          { id: 1, title: 'Total Payroll', value: '2300', isPrice: true },
          { id: 2, title: 'Headcount', value: '8.51k' },
          { id: 3, title: 'Departments', value: '12' },
          { id: 4, title: 'Avg. Tenure', value: '3.2y' },
        ]"
        :data="result2?.users"
        :loading="loading2"
        :page-info="result2?.pageInfo"
        :refetch="fetchData2"
        :list="UserList"
        :table="UserTable"
        show-refresh
        :quick-filters="[
          { label: 'All', value: '' },
          { label: 'Active', value: 'active' },
          { label: 'On Notice', value: 'notice' },
          { label: 'Laid Off', value: 'laid_off' },
          { label: 'Terminated', value: 'terminated' },
          { label: 'Resigned', value: 'resigned' },
        ]"
        :filter-schema="[
          { name: 'user', type: 'text', label: 'Employee Name' },
          {
            name: 'department',
            label: 'Department',
            type: 'select',
            options: [
              { label: 'Engineering', value: 'engineering' },
              { label: 'Design', value: 'design' },
              { label: 'Marketing', value: 'marketing' },
              { label: 'HR', value: 'hr' },
              { label: 'Management', value: 'management' },
            ],
          },
        ]"
        :export-schema="[
          { field: 'id', title: 'ID', required: true },
          { field: 'name', title: 'Full Name', required: true },
          { field: 'email', title: 'Email Address', required: true },
          { field: 'role', title: 'Role' },
          { field: 'department', title: 'Department' },
          { field: 'salary', title: 'Salary' },
          { field: 'joinDate', title: 'Join Date' },
        ]"
        filter-type="dropdown"
        export-props
        import-props
        export-mode="backend"
        export-type="user"
        import-type="user"
        @delete="handleDelete2"
        :add-btn="{
          modal: AddUser,
          label: 'Add Employee',
          modalProps: { title: 'Add Employee' },
        }" />
    </DemoSection>
  </div>
</template>
