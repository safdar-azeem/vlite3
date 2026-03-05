<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormMultiStepUpdate.vue?raw'

const steps = [
  { id: 1, title: 'Basic Info', icon: 'lucide:info' },
  { id: 2, title: 'Contact', icon: 'lucide:phone' },
  { id: 3, title: 'Settings', icon: 'lucide:settings' },
]

const formData = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  notifications: true,
  theme: 'dark',
})

const schema: IForm[][] = [
  [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      itemClass: 'col-span-2',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      itemClass: 'col-span-2',
    },
  ],
  [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      itemClass: 'col-span-2',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      itemClass: 'col-span-2',
    },
  ],
  [
    {
      name: 'notifications',
      label: 'Enable Notifications',
      type: 'switch',
      itemClass: 'col-span-2',
    },
    {
      name: 'theme',
      label: 'Theme Preference',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      required: true,
      itemClass: 'col-span-2',
    },
  ],
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Multi-Step (Update Mode)" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          When <code>isUpdate</code> is true, the Submit button is available on every step.
          Validation checks all tabs upon submission and automatically navigates back to any tab containing errors.
        </p>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-2xl">
            <div class="p-6 border border-border rounded-xl bg-white shadow-sm">
              <Form
                :schema="schema"
                :values="formData"
                :tabs="steps"
                :isUpdate="true"
                submitText="Save Changes"
                class-name="grid-cols-2"
                @onSubmit="handleSubmit" />
            </div>
          </div>

          <div v-if="submittedValues" class="flex-1 max-w-sm">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
                <h4 class="font-semibold text-green-800">Changes Saved</h4>
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
  </DemoSection>
</template>
