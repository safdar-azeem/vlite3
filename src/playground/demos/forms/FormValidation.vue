<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'

const validationSchema: IForm[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    required: true,
    validation: ({ value }) => {
      if (!value) return ''
      if (value.length < 3) return 'Username must be at least 3 characters'
      if (value.length > 20) return 'Username must be at most 20 characters'
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers and underscores allowed'
      return ''
    },
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'email@example.com',
    required: true,
    validation: ({ value }) => {
      if (!value) return ''
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
      return ''
    },
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    required: true,
    validation: ({ value }) => {
      if (!value) return ''
      if (value.length < 8) return 'Password must be at least 8 characters'
      if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter'
      if (!/[0-9]/.test(value)) return 'Password must contain a number'
      return ''
    },
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: '••••••••',
    required: true,
    validation: ({ value, values }) => {
      if (!value) return ''
      if (value !== values.password) return 'Passwords do not match'
      return ''
    },
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    placeholder: '18',
    min: 0,
    max: 120,
    validation: ({ value }) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Number(value) < 18) return 'You must be at least 18 years old'
      }
      return ''
    },
  },
  {
    name: 'website',
    label: 'Website (Optional)',
    type: 'url',
    placeholder: 'https://example.com',
    validation: ({ value }) => {
      if (!value) return ''
      try {
        new URL(value)
        return ''
      } catch {
        return 'Please enter a valid URL'
      }
    },
  },
  {
    name: 'acceptTerms',
    label: 'I accept the terms and conditions',
    type: 'check',
    required: true,
    itemClass: 'col-span-2',
  },
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-1">Form Validation</h3>
      <p class="text-sm text-gray-500 mb-4">
        Complex validation rules including custom functions, cross-field validation, and async
        checks.
      </p>
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 max-w-2xl">
          <Form
            :schema="validationSchema"
            class-name="grid-cols-2"
            submitText="Register Account"
            @onSubmit="handleSubmit" />
        </div>

        <div v-if="submittedValues" class="flex-1 max-w-md">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
            <div class="flex items-center gap-2 mb-3">
              <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
              <h4 class="font-semibold text-green-800">Valid Submission</h4>
            </div>
            <div class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
              <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
                JSON.stringify(submittedValues, null, 2)
              }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
