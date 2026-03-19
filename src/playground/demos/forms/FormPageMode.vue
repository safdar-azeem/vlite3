<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormPageMode.vue?raw'

const employeeSchema: IForm[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'john@example.com',
    icon: 'lucide:mail',
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

const handleBack = () => {
  alert('Back navigation triggered! In a real app, this returns to the list view.')
}

const handleSubmit = (payload: IFormSubmitPayload) => {
  console.log('Form saved:', payload)
  alert('Resource successfully saved!')
}
</script>

<template>
  <DemoSection title="Full-Page Layout Mode" :code="sourceCode">
    <div class="space-y-4">
      <p class="text-sm text-gray-500">
        Enterprise applications often use a dedicated page layout for editing resources. By passing
        <code>isPage="true"</code>, the form generates a sticky top header with the title, back
        navigation, and primary actions.
      </p>

      <div
        class="border-4 border-dashed border-gray-200 rounded-xl bg-gray-50 p-4 lg:p-10 relative h-[600px] overflow-hidden flex flex-col">
        <div
          class="bg-background rounded-lg shadow-xl overflow-y-auto border border-border h-full w-full flex flex-col relative">
          <div class="flex-1 p-6">
            <Form
              :schema="employeeSchema"
              isPage
              pageTitle="Edit Enterprise Resource"
              submitText="Save Resource"
              class-name="grid-cols-1!"
              @onBack="handleBack"
              @onSubmit="handleSubmit">
            </Form>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
