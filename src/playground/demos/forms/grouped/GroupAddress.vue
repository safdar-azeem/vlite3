<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../../DemoSection.vue'
import sourceCode from './GroupAddress.vue?raw'

const addressSchema: IForm[] = [
  {
    name: 'street',
    label: 'Street Address',
    type: 'text',
    placeholder: '123 Main St',
    itemClass: 'col-span-2',
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'New York',
  },
  {
    name: 'state',
    label: 'State',
    type: 'select',
    options: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
      { label: 'Texas', value: 'TX' },
      { label: 'Florida', value: 'FL' },
    ],
  },
  {
    name: 'zipCode',
    label: 'ZIP Code',
    type: 'text',
    placeholder: '10001',
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    options: [
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
      { label: 'United Kingdom', value: 'UK' },
    ],
  },
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Address Details" :code="sourceCode">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 max-w-2xl border border-border rounded-lg p-6 bg-white">
        <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon icon="lucide:map-pin" class="w-4 h-4 text-primary" />
          Address Details
        </h4>
        <Form
          :schema="addressSchema"
          class-name="grid-cols-2"
          submitText="Save Address"
          @onSubmit="handleSubmit" />
      </div>
      <!-- Results -->
      <div v-if="submittedValues" class="flex-1 max-w-sm">
        <div class="bg-gray-50 border border-border rounded-lg p-6">
          <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Icon icon="lucide:database" class="w-4 h-4 text-gray-600" />
            Collected Data
          </h4>
          <div class="bg-white rounded border border-gray-200 p-3 overflow-auto max-h-[400px]">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
              JSON.stringify(submittedValues, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
