<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Screen } from '@/components/Screen'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ScreenDemo.vue?raw'
import { useGetUsers } from '../composables/useGetUsers'
import Button from '@/components/Button.vue'

// Custom List and Table components specific to the Screen
import UserList from './ScreenDemoComponents/UserList.vue'
import UserTable from './ScreenDemoComponents/UserTable.vue'
import AddUser from './ScreenDemoComponents/AddUser.vue'

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
  <div class="space-y-12 pb-20">
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
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          :data="[]"
          :loading="loading"
          :page-info="result?.pageInfo"
          :refetch="fetchData"
          :list="UserList"
          :table="UserTable"
          show-refresh
          :filter-schema="[
            {
              name: 'user',
              type: 'text',
              label: 'User',
            },
          ]"
          @delete="handleDelete"
          :add-btn="{
            modal: AddUser,
            label: 'Add User',
            modalProps: {
              title: 'Add User',
            },
          }" />
      </div>
    </DemoSection>
  </div>
</template>
