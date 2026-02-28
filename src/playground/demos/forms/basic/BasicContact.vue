<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../../DemoSection.vue'
import sourceCode from './BasicContact.vue?raw'

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
    type: 'multiSelect',
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

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Contact Form" :code="sourceCode">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 max-w-2xl">
        <Form
          :values="{
            avatar: '',
            name: 'safdar',
            email: 'safdar@gmail.com',
            subject: 'general',
            message: 'hello',
            __typename: 'Form',
          }"
          :schema="contactSchema"
          class-name="grid-cols-2"
          submitText="Send Message"
          @onSubmit="handleSubmit" />
      </div>
      <!-- Inline Submitted Values -->
      <div v-if="submittedValues" class="flex-1 max-w-md">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
          <div class="flex items-center gap-2 mb-3">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
            <h4 class="font-semibold text-green-800">Submitted Values</h4>
          </div>
          <div class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
              JSON.stringify(submittedValues, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
