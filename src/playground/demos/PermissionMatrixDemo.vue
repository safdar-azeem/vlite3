<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { PermissionMatrix, PermissionEditor } from '@/components/PermissionMatrix'
import type { RoleDef, PermissionGroup, PermissionMap } from '@/components/PermissionMatrix'

// ── Sample Roles ──
const roles: RoleDef[] = [
  { key: 'admin', label: 'Admin', locked: true },
  { key: 'manager', label: 'Manager' },
  { key: 'editor', label: 'Editor' },
  { key: 'viewer', label: 'Viewer' },
]

// ── Sample Permission Groups ──
const groups: PermissionGroup[] = [
  {
    key: 'users',
    label: 'Users',
    icon: 'lucide:users',
    permissions: [
      {
        key: 'users_manage_employees',
        label: 'Manage Employees',
        description: 'Create, edit, delete employee records',
      },
      { key: 'users_view_employees', label: 'View Employees' },
      { key: 'users_manage_customers', label: 'Manage Customers' },
      { key: 'users_view_customers', label: 'View Customers' },
      { key: 'users_manage_suppliers', label: 'Manage Suppliers' },
      { key: 'users_view_suppliers', label: 'View Suppliers' },
    ],
  },
  {
    key: 'hrm',
    label: 'HRM',
    icon: 'lucide:briefcase',
    permissions: [
      { key: 'hrm_manage_department', label: 'Manage Departments' },
      { key: 'hrm_view_department', label: 'View Departments' },
      {
        key: 'hrm_manage_payroll',
        label: 'Manage Payroll',
        description: 'Create and edit payroll runs',
      },
      { key: 'hrm_view_payroll', label: 'View Payroll' },
      {
        key: 'hrm_approve_payroll',
        label: 'Approve Payroll',
        description: 'Approve or reject payroll submissions',
      },
      { key: 'hrm_manage_leaves', label: 'Manage Leaves' },
      { key: 'hrm_view_leaves', label: 'View Leaves' },
      { key: 'hrm_manage_attendance', label: 'Manage Attendance' },
      { key: 'hrm_view_attendance', label: 'View Attendance' },
    ],
  },
  {
    key: 'crm',
    label: 'CRM',
    icon: 'lucide:contact',
    permissions: [
      { key: 'crm_manage_leads', label: 'Manage Leads' },
      { key: 'crm_manage_deals', label: 'Manage Deals' },
      { key: 'crm_manage_contacts', label: 'Manage Contacts' },
      { key: 'crm_manage_tasks', label: 'Manage Tasks' },
      { key: 'crm_view_tasks', label: 'View Tasks' },
      { key: 'crm_view_dashboard', label: 'View Dashboard' },
    ],
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: 'lucide:warehouse',
    permissions: [
      { key: 'inventory_manage_inventory', label: 'Manage Inventory' },
      { key: 'inventory_view_inventory', label: 'View Inventory' },
      { key: 'inventory_manage_warehouse', label: 'Manage Warehouses' },
      { key: 'inventory_view_warehouse', label: 'View Warehouses' },
      { key: 'inventory_manage_stock_transfers', label: 'Manage Stock Transfers' },
      { key: 'inventory_view_stock_transfers', label: 'View Stock Transfers' },
    ],
  },
  {
    key: 'accounting',
    label: 'Accounting',
    icon: 'lucide:calculator',
    permissions: [
      { key: 'accounting_manage_account', label: 'Manage Accounts' },
      { key: 'accounting_view_account', label: 'View Accounts' },
      { key: 'accounting_journal_create', label: 'Create Journals' },
      { key: 'accounting_journal_post', label: 'Post Journals' },
      { key: 'accounting_view_reports', label: 'View Reports' },
    ],
  },
]

// ── Compute all permission keys for admin ──
const allPermKeys = groups.flatMap((g) => g.permissions.map((p) => p.key))

// ── Permission Map (v-model) ──
const permissions = ref<PermissionMap>({
  admin: [...allPermKeys],
  manager: [
    'users_manage_employees',
    'users_view_employees',
    'users_view_customers',
    'users_view_suppliers',
    'hrm_manage_department',
    'hrm_view_department',
    'hrm_manage_payroll',
    'hrm_view_payroll',
    'hrm_manage_leaves',
    'hrm_view_leaves',
    'hrm_manage_attendance',
    'hrm_view_attendance',
    'crm_manage_leads',
    'crm_manage_deals',
    'crm_manage_contacts',
    'crm_view_tasks',
    'crm_view_dashboard',
    'inventory_view_inventory',
    'inventory_view_warehouse',
    'inventory_view_stock_transfers',
    'accounting_view_account',
    'accounting_view_reports',
  ],
  editor: [
    'users_view_employees',
    'users_view_customers',
    'hrm_view_department',
    'hrm_view_payroll',
    'hrm_view_leaves',
    'hrm_view_attendance',
    'crm_manage_leads',
    'crm_manage_contacts',
    'crm_view_tasks',
    'crm_view_dashboard',
    'inventory_view_inventory',
    'inventory_view_warehouse',
    'accounting_view_account',
  ],
  viewer: [
    'users_view_employees',
    'users_view_customers',
    'users_view_suppliers',
    'hrm_view_department',
    'hrm_view_payroll',
    'hrm_view_leaves',
    'hrm_view_attendance',
    'crm_view_tasks',
    'crm_view_dashboard',
    'inventory_view_inventory',
    'inventory_view_warehouse',
    'inventory_view_stock_transfers',
    'accounting_view_account',
    'accounting_view_reports',
  ],
})

const switchPermissions = ref<PermissionMap>({
  admin: [...allPermKeys],
  manager: ['users_view_employees', 'hrm_view_department', 'crm_view_dashboard'],
  editor: ['users_view_employees'],
  viewer: [],
})

const readonlyPermissions = ref<PermissionMap>({
  admin: [...allPermKeys],
  manager: [
    'users_manage_employees',
    'users_view_employees',
    'hrm_manage_department',
    'hrm_view_department',
  ],
  editor: ['users_view_employees', 'hrm_view_department'],
  viewer: ['users_view_employees'],
})

const defaultCode = `<PermissionMatrix
  v-model="permissions"
  :roles="roles"
  :groups="groups" />`

const switchCode = `<PermissionMatrix
  v-model="permissions"
  :roles="roles"
  :groups="groups"
  toggle-mode="switch" />`

const readonlyCode = `<PermissionMatrix
  v-model="permissions"
  :roles="roles"
  :groups="groups"
  readonly />`

const smallCode = `<PermissionMatrix
  v-model="permissions"
  :roles="roles"
  :groups="groups"
  size="sm" />`

// ── Single-Role Editor data ──
const editorPerms = ref<string[]>([
  'users_view_employees',
  'users_view_customers',
  'hrm_view_department',
  'hrm_view_payroll',
  'hrm_view_leaves',
  'crm_view_tasks',
  'crm_view_dashboard',
])

const editorSwitchPerms = ref<string[]>(['users_view_employees', 'hrm_view_department'])

const editorCode = `<PermissionEditor
  v-model="selectedPermissions"
  :groups="groups" />`

const editorSwitchCode = `<PermissionEditor
  v-model="selectedPermissions"
  :groups="groups"
  toggle-mode="switch" />`
</script>

<template>
  <div>
    <h2 class="text-fs-5 font-bold mb-1">Permission Matrix</h2>
    <p class="text-muted-foreground mb-8">
      A role-based permission editor with grouped permissions, search, bulk toggle, and multiple
      display modes.
    </p>

    <div class="space-y-12">
      <!-- Single-Role Permission Editor (top) -->
      <div>
        <h3 class="text-fs-3 font-semibold mb-1">Single-Role Permission Editor</h3>
        <p class="text-muted-foreground text-sm mb-6">
          For when enterprises create their own roles and need to pick permissions. Just pass
          modules and permissions — <code>v-model</code> is a <code>string[]</code> of selected
          keys.
        </p>

        <DemoSection title="Permission Editor (Checkbox)" :code="editorCode">
          <PermissionEditor
            v-model="editorPerms"
            :groups="groups"
            :default-expanded="['users', 'hrm']" />
        </DemoSection>
      </div>

      <DemoSection title="Permission Editor (Switch)" :code="editorSwitchCode">
        <PermissionEditor
          v-model="editorSwitchPerms"
          :groups="groups.slice(0, 3)"
          toggle-mode="switch" />
      </DemoSection>

      <!-- Multi-Role Permission Matrix (below) -->
      <div>
        <h3 class="text-fs-3 font-semibold mb-1">Multi-Role Permission Matrix</h3>
        <p class="text-muted-foreground text-sm mb-6">
          For managing permissions across multiple roles at once in a matrix grid.
        </p>
      </div>

      <DemoSection title="Default (Checkbox)" :code="defaultCode">
        <PermissionMatrix v-model="permissions" :roles="roles" :groups="groups" />
      </DemoSection>

      <DemoSection title="Switch Mode" :code="switchCode">
        <PermissionMatrix
          v-model="switchPermissions"
          :roles="roles"
          :groups="groups.slice(0, 2)"
          toggle-mode="switch" />
      </DemoSection>

      <DemoSection title="Read-Only" :code="readonlyCode">
        <PermissionMatrix
          v-model="readonlyPermissions"
          :roles="roles"
          :groups="groups.slice(0, 2)"
          readonly />
      </DemoSection>

      <DemoSection title="Compact Size" :code="smallCode">
        <PermissionMatrix
          v-model="permissions"
          :roles="roles"
          :groups="groups.slice(0, 3)"
          size="sm" />
      </DemoSection>
    </div>
  </div>
</template>
