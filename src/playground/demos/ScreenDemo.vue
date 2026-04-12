<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { Screen } from '@/components/Screen'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ScreenDemo.vue?raw'
import { useGetUsers } from '../composables/useGetUsers'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'

// Lazy Loading custom heavy components specific to the Screen
const UserList = defineAsyncComponent(() => import('./ScreenDemoComponents/UserList.vue'))
const UserTable = defineAsyncComponent(() => import('./ScreenDemoComponents/UserTable.vue'))
const AddUser = defineAsyncComponent(() => import('./ScreenDemoComponents/AddUser.vue'))

const { result, loading, refetch } = useGetUsers()

const fetchData = (payload?: any) => {
  console.log('payload :>> ', payload)
  const params = payload || {
    pagination: { page: 1, limit: 10 },
    filter: { search: '' },
  }
  refetch(params)
}

onMounted(() => {
  fetchData()
})

const handleAdd = () => {
  alert('Open Add Modal')
}

const handleDelete = (items: any[]) => {
  console.log('Items to delete:', items)
  alert(`Deleted ${items.length} item(s) successfully!`)
  // Re-fetch data after successful deletion
  fetchData()
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Screen Component</h2>
      <p class="text-gray-500">
        A high-level page wrapper that automatically manages Title, Search, Pagination, Add Actions,
        and effortlessly toggles between custom Table and List child components. View state is
        persisted.
      </p>
    </div>

    <DemoSection title="Screen Default Usage" :code="sourceCode">
      <div class="">
        <Screen
          name="users-directory-demo"
          title="Users Directory"
          info="This screen allows you to manage system users. You can switch between list and table views."
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          :data="result?.users"
          :loading="loading"
          :page-info="result?.pageInfo"
          :refetch="fetchData"
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
            {
              name: 'user',
              type: 'text',
              label: 'User',
            },
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
            { field: 'name', title: 'Name', required: true },
            { field: 'email', title: 'Email Address', required: true },
            { field: 'role', title: 'Role' },
            { field: 'status', title: 'Account Status' },
          ]"
          :import-schema="[
            { field: 'id', title: 'ID', required: true },
            { field: 'name', title: 'Name', required: true },
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
          @delete="handleDelete"
          :add-btn="{
            modal: AddUser,
            label: 'Add User',
            modalProps: {
              title: 'Add User',
            },
          }">
        </Screen>
      </div>
    </DemoSection>
  </div>
</template>
