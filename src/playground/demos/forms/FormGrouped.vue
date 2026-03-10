<script setup lang="ts">
import GroupPersonal from './grouped/GroupPersonal.vue'
import GroupAddress from './grouped/GroupAddress.vue'
import GroupPreferences from './grouped/GroupPreferences.vue'
import Form from '@/components/Form/Form.vue'
import { IForm } from '@/components/Form'

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
    required: true,
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
    required: true,
    options: [
      { label: 'English', value: 'en' },
      { label: 'Spanish', value: 'es' },
      { label: 'French', value: 'fr' },
    ],
    value: '',
  },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-2">Grouped Forms</h3>
      <p class="text-sm text-gray-500 mb-6">Multiple form sections handled together.</p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Form
          :schema="[personalInfoSchema, addressSchema, preferencesSchema]"
          :groups-headings="['Personal Information', 'Address Details', 'Preferences']"
          class-name="grid-cols-2"
          submitText="Save Personal Info" />
      </div>
    </div>
  </div>
</template>
