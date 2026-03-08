<script setup lang="ts">
import { ref } from 'vue'
import { ExportData } from '@/components/ExportData'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ExportDataDemo.vue?raw'

const users = ref([
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    address: { city: 'New York', country: 'USA' },
    status: 'active',
    balance: 1250.5,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    address: { city: 'London', country: 'UK' },
    status: 'inactive',
    balance: 340.0,
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    address: { city: 'Paris', country: 'France' },
    status: 'active',
    balance: 8900.25,
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice@example.com',
    address: { city: 'Berlin', country: 'France' },
    status: 'pending',
    balance: 0,
  },
])

const exportFields = [
  { field: 'id', title: 'User ID' },
  { field: 'firstName', title: 'First Name' },
  { field: 'lastName', title: 'Last Name' },
  { field: 'email', title: 'Email Address' },
  { field: 'address.city', title: 'City' },
  { field: 'address.country', title: 'Country' },
  { field: 'status', title: 'Account Status', format: (val: string) => val.toUpperCase() },
  { field: 'balance', title: 'Balance', format: (val: number) => `$${val.toFixed(2)}` },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">ExportData</h2>
      <p class="text-gray-500">
        A flexible component to export tables and arrays to CSV, JSON, and Excel formats natively.
        It supports dot-notation paths and custom formatting functions.
      </p>
    </div>

    <DemoSection title="Basic Export" :code="sourceCode">
      <div class="bg-gray-50/50 p-6 rounded-xl border border-dashed flex gap-4">
        <ExportData
          :data="users"
          title="Users Report"
          filename="users_export_2025"
          :fields="exportFields"
          :formats="['csv', 'excel', 'json']" />

        <ExportData
          :data="users"
          title="Quick CSV Export"
          buttonText="Download CSV"
          buttonIcon="lucide:file-down"
          :fields="exportFields"
          :formats="['csv']" />
      </div>
    </DemoSection>
  </div>
</template>
