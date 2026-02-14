<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../../DemoSection.vue'
import sourceCode from './GroupPersonal.vue?raw'

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

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Personal Information" :code="sourceCode">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 max-w-2xl border border-border rounded-lg p-6 bg-white">
        <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon icon="lucide:user" class="w-4 h-4 text-primary" />
          Personal Information
        </h4>
        <Form
          :schema="personalInfoSchema"
          class-name="grid-cols-2"
          submitText="Save Personal Info"
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
