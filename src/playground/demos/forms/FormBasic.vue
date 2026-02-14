<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormBasic.vue?raw'

// Login Form Schema
const loginSchema: IForm[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'john@example.com',
    icon: 'lucide:mail',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    icon: 'lucide:lock',
    required: true,
  },
  {
    name: 'rememberMe',
    label: 'Remember me',
    type: 'switch',
    value: false,
  },
]

// Contact Form Schema
const contactSchema: IForm[] = [
  {
    name: 'image',
    label: 'Avatar',
    type: 'avatarUpload',
    placeholder: 'John Doe',
    required: true,
  },
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'John Doe',
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
    name: 'subject',
    label: 'Subject',
    type: 'select',
    placeholder: 'Select a subject',
    options: [
      { label: 'General Inquiry', value: 'general' },
      { label: 'Support', value: 'support' },
      { label: 'Sales', value: 'sales' },
      { label: 'Partnership', value: 'partnership' },
    ],
    required: true,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Your message...',
    props: { rows: 4 },
    itemClass: 'col-span-2',
    required: true,
  },
]

// Store submitted values for display
const submittedValues = ref<{
  form: string
  values: any
} | null>(null)

const handleSubmit = (form: string, payload: IFormSubmitPayload) => {
  submittedValues.value = {
    form,
    values: payload.values,
  }
}
</script>

<template>
  <DemoSection title="Basic Forms" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <h3 class="text-lg font-semibold mb-1">Login Form</h3>
        <p class="text-sm text-gray-500 mb-4">
          Simple login form with email, password, and remember me.
        </p>
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-md">
            <Form
              :schema="loginSchema"
              submitText="Sign In"
              @onSubmit="(payload) => handleSubmit('Login Form', payload)" />
          </div>
          <!-- Inline Submitted Values -->
          <div
            v-if="submittedValues && submittedValues.form === 'Login Form'"
            class="flex-1 max-w-md">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
                <h4 class="font-semibold text-green-800">Submitted Values</h4>
              </div>
              <div class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
                <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
                  JSON.stringify(submittedValues.values, null, 2)
                }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr class="border-border" />

      <div>
        <h3 class="text-lg font-semibold mb-1">Contact Form</h3>
        <p class="text-sm text-gray-500 mb-4">
          Contact form with dropdown, textarea, and grid layout.
        </p>
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-2xl">
            <Form
              :schema="contactSchema"
              class-name="grid-cols-2"
              submitText="Send Message"
              @onSubmit="(payload) => handleSubmit('Contact Form', payload)" />
          </div>
          <!-- Inline Submitted Values -->
          <div
            v-if="submittedValues && submittedValues.form === 'Contact Form'"
            class="flex-1 max-w-md">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
                <h4 class="font-semibold text-green-800">Submitted Values</h4>
              </div>
              <div class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
                <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
                  JSON.stringify(submittedValues.values, null, 2)
                }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
