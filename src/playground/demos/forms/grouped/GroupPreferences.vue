<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../../DemoSection.vue'
import sourceCode from './GroupPreferences.vue?raw'

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

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="User Preferences" :code="sourceCode">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 max-w-2xl border border-border rounded-lg p-6 bg-white">
        <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon icon="lucide:settings" class="w-4 h-4 text-primary" />
          Preferences
        </h4>
        <Form
          :schema="preferencesSchema"
          class-name="grid-cols-2"
          submitText="Save Preferences"
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
