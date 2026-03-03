<script setup lang="ts">
import { ref } from 'vue'
import {
  ImportData,
  type ImportField,
  type ImportBatchPayload,
  type ImportBatchResult,
} from '@/components/ImportData'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ImportDataDemo.vue?raw'

const importFields: ImportField[] = [
  {
    field: 'firstName',
    title: 'First Name',
    required: true,
    matchings: ['name', 'first name', 'fname'],
  },
  { field: 'lastName', title: 'Last Name', matchings: ['last name', 'lname', 'surname'] },
  {
    field: 'email',
    title: 'Email Address',
    required: true,
    matchings: ['email', 'mail', 'email address'],
  },
  { field: 'phone', title: 'Phone Number', matchings: ['phone', 'mobile', 'contact', 'telephone'] },
  { field: 'role', title: 'User Role', expectedType: 'string', defaultValue: 'User' },
  { field: 'address.city', title: 'City', matchings: ['city', 'location', 'town'] },
  { field: 'address.country', title: 'Country', matchings: ['country', 'nation'] },
]

const importedUsers = ref<any[]>([])

const handleProcessBatch = async (payload: ImportBatchPayload): Promise<ImportBatchResult> => {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  const result: ImportBatchResult = {
    processed: payload.data.length,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  }

  payload.data.forEach((row, index) => {
    // Artificial logic based on user choices
    if (payload.options.existing === 'skip' && index % 5 === 0) {
      result.skipped++
    } else if (payload.options.existing === 'replace' && index % 4 === 0) {
      result.updated++
    } else if (!row.email) {
      result.failed++
      result.errors.push({ record: String(index + 1), message: 'Missing email address.' })
    } else {
      result.created++
      importedUsers.value.push(row)
    }
  })

  return result
}
</script>

<template>
  <div class="space-y-12 pb-20">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">ImportData</h2>
      <p class="text-gray-500">
        A production-grade, multi-step CSV importer with built-in mapping, conflict resolution,
        chunking, and validation.
      </p>
    </div>

    <DemoSection title="Standard Importer" :code="sourceCode">
      <div class="bg-gray-50/50 p-6 rounded-xl border border-dashed border-gray-300">
        <ImportData
          title="Import Users"
          buttonText="Import CSV Data"
          buttonIcon="lucide:upload-cloud"
          :fields="importFields"
          :batchSize="50"
          :processBatch="handleProcessBatch" />

        <div v-if="importedUsers.length > 0" class="mt-8">
          <h4 class="font-medium text-lg mb-2">Imported Results ({{ importedUsers.length }})</h4>
          <div class="bg-white border rounded-lg max-h-64 overflow-y-auto">
            <pre class="text-xs p-4">{{ JSON.stringify(importedUsers, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
