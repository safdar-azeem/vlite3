<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormAddons.vue?raw'

const addonSchema: IForm[] = [
  {
    name: 'domain',
    label: 'Website',
    type: 'text',
    placeholder: 'example.com',
    required: true,
    addonLeft: {
      name: 'protocol',
      type: 'select',
      value: 'https://',
      options: [
        { label: 'https://', value: 'https://' },
        { label: 'http://', value: 'http://' },
      ],
      props: {
        class: 'w-24',
      },
    },
    addonRight: {
      type: 'button',
      text: 'Check',
      action: 'checkAvailability',
      props: {
        icon: 'lucide:search',
      },
    },
  },
  {
    name: 'username',
    label: 'Social Handle',
    type: 'text',
    placeholder: 'johndoe',
    addonLeft: {
      name: 'platform',
      type: 'select',
      value: '@twitter',
      options: [
        { label: '@twitter', value: '@twitter' },
        { label: '@github', value: '@github' },
        { label: '@linkedin', value: '@linkedin' },
      ],
      props: {
        class: 'w-28',
      },
    },
  },
  {
    name: 'amount',
    label: 'Price',
    type: 'text',
    placeholder: '0.00',
    addonLeft: {
      name: 'currency',
      type: 'select',
      value: 'USD',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
      ],
      props: {
        class: 'w-20',
      },
    },
    addonRight: '.00',
  },
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}

const handleAddonAction = (action: string) => {
  alert(`Addon action triggered: ${action}`)
}
</script>

<template>
  <DemoSection title="Input Addons (Schema-Driven)" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Use <code>addonLeft</code> and <code>addonRight</code> as objects in your schema to render
          dropdowns or buttons inside input addons. Each addon binds to its own key in form state.
        </p>
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-2xl">
            <Form
              :schema="addonSchema"
              submitText="Submit"
              @onSubmit="handleSubmit"
              @onAddonAction="handleAddonAction" />
          </div>

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
      </div>
    </div>
  </DemoSection>
</template>
