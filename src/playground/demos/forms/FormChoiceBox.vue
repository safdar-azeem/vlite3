<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormChoiceBox.vue?raw'

const schema: IForm[] = [
  {
    name: 'plan',
    label: 'Select a Subscription Plan',
    type: 'choiceBox',
    required: true,
    options: [
      {
        label: 'Basic',
        value: 'basic',
        description: 'Good for individuals and small teams.',
        icon: 'lucide:box',
        badge: 'Free',
      },
      {
        label: 'Professional',
        value: 'pro',
        description: 'Advanced features for growing businesses.',
        icon: 'lucide:zap',
        badge: 'Popular',
      },
      {
        label: 'Enterprise',
        value: 'enterprise',
        description: 'Custom solutions for large organizations.',
        icon: 'lucide:building-2',
      },
    ],
    props: {
      grid: 3,
      gap: 4,
    },
  },
  {
    name: 'features',
    label: 'Additional Features',
    type: 'choiceBox',
    options: [
      {
        label: 'Analytics Dashboard',
        value: 'analytics',
        description: 'Get deep insights into your usage.',
        icon: 'lucide:bar-chart-2',
      },
      {
        label: 'Priority Support',
        value: 'support',
        description: '24/7 dedicated support team.',
        icon: 'lucide:headset',
      },
      {
        label: 'Advanced Security',
        value: 'security',
        description: 'Enhanced data protection and compliance.',
        icon: 'lucide:shield-check',
      },
      {
        label: 'Custom Domain',
        value: 'domain',
        description: 'Use your own branded domain name.',
        icon: 'lucide:globe',
        disabled: true,
        badge: 'Coming Soon'
      },
    ],
    props: {
      multiple: true,
      grid: 2,
      gap: 4,
    },
  },
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="ChoiceBox Form Integration" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Integrate the highly visual <code>ChoiceBox</code> component directly into your form schema. Supports both single and multiple selections.
        </p>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-4xl">
            <Form :schema="schema" submitText="Save Preferences" @onSubmit="handleSubmit" />
          </div>

          <div v-if="submittedValues" class="flex-1 max-w-sm">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full sticky top-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
                <h4 class="font-semibold text-green-800">Submitted Values</h4>
              </div>
              <div class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-[500px]">
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
