<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormGrouped.vue?raw'

const personalInfoSchema: IForm[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'John',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john@example.com',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
  },
]

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

const preferencesSchema: IForm[] = [
  {
    name: 'notifications',
    label: 'Email Notifications',
    type: 'switch',
    value: true,
  },
  {
    name: 'newsletter',
    label: 'Subscribe to Newsletter',
    type: 'switch',
    value: false,
  },
  {
    name: 'theme',
    label: 'Theme',
    type: 'select',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'System', value: 'system' },
    ],
    value: 'system',
  },
  {
    name: 'language',
    label: 'Language',
    type: 'select',
    options: [
      { label: 'English', value: 'en' },
      { label: 'Spanish', value: 'es' },
      { label: 'French', value: 'fr' },
    ],
    value: 'en',
  },
]

const groupedValues = ref<any>({})

const handleGroupSubmit = (group: string, payload: IFormSubmitPayload) => {
  groupedValues.value[group] = payload.values
}
</script>

<template>
  <DemoSection title="Grouped Forms" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Multiple form sections handled independently or together.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Personal Info -->
          <div class="border border-border rounded-lg p-6 bg-white">
            <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="lucide:user" class="w-4 h-4 text-primary" />
              Personal Information
            </h4>
            <Form
              :schema="personalInfoSchema"
              class-name="grid-cols-2"
              submitText="Save Personal Info"
              @onSubmit="(p) => handleGroupSubmit('personal', p)" />
          </div>

          <!-- Address -->
          <div class="border border-border rounded-lg p-6 bg-white">
            <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="lucide:map-pin" class="w-4 h-4 text-primary" />
              Address Details
            </h4>
            <Form
              :schema="addressSchema"
              class-name="grid-cols-2"
              submitText="Save Address"
              @onSubmit="(p) => handleGroupSubmit('address', p)" />
          </div>

          <!-- Preferences -->
          <div class="border border-border rounded-lg p-6 bg-white">
            <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="lucide:settings" class="w-4 h-4 text-primary" />
              Preferences
            </h4>
            <Form
              :schema="preferencesSchema"
              class-name="grid-cols-2"
              submitText="Save Preferences"
              @onSubmit="(p) => handleGroupSubmit('preferences', p)" />
          </div>

          <!-- Results -->
          <div class="bg-gray-50 border border-border rounded-lg p-6">
            <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="lucide:database" class="w-4 h-4 text-gray-600" />
              Collected Data
            </h4>
            <div class="bg-white rounded border border-gray-200 p-3 overflow-auto max-h-[400px]">
              <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
                JSON.stringify(groupedValues, null, 2)
              }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
