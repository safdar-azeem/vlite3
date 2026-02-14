<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormAdvanced.vue?raw'

const advancedSchema: IForm[] = [
  {
    name: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    options: [
      { label: 'Credit Card', value: 'credit' },
      { label: 'PayPal', value: 'paypal' },
      { label: 'Bank Transfer', value: 'bank' },
    ],
    required: true,
  },
  // Credit card fields - only shown when credit card selected
  {
    name: 'cardNumber',
    label: 'Card Number',
    type: 'text',
    placeholder: '4242 4242 4242 4242',
    when: ({ values }) => values.paymentMethod === 'credit',
    required: true,
  },
  {
    name: 'cardExpiry',
    label: 'Expiry Date',
    type: 'text',
    placeholder: 'MM/YY',
    when: ({ values }) => values.paymentMethod === 'credit',
    required: true,
  },
  {
    name: 'cardCvc',
    label: 'CVC',
    type: 'text',
    placeholder: '123',
    when: ({ values }) => values.paymentMethod === 'credit',
    required: true,
  },
  // PayPal field - only shown when PayPal selected
  {
    name: 'paypalEmail',
    label: 'PayPal Email',
    type: 'email',
    placeholder: 'paypal@example.com',
    when: ({ values }) => values.paymentMethod === 'paypal',
    required: true,
    itemClass: 'col-span-2',
  },
  // Bank fields - only shown when bank selected
  {
    name: 'bankName',
    label: 'Bank Name',
    type: 'text',
    placeholder: 'Enter bank name',
    when: ({ values }) => values.paymentMethod === 'bank',
    required: true,
  },
  {
    name: 'accountNumber',
    label: 'Account Number',
    type: 'text',
    placeholder: 'Enter account number',
    when: ({ values }) => values.paymentMethod === 'bank',
    required: true,
  },
  // Pricing with updateValues
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    value: 1,
    min: 1,
    max: 100,
    updateValues: ({ values }) => {
      const price = 29.99
      return {
        subtotal: (values.quantity || 0) * price,
        total: (values.quantity || 0) * price * 1.1, // 10% tax
      }
    },
  },
  {
    name: 'subtotal',
    label: 'Subtotal',
    type: 'text',
    addonLeft: '$',
    disabled: true,
    value: 29.99,
  },
  {
    name: 'total',
    label: 'Total (incl. 10% tax)',
    type: 'text',
    addonLeft: '$',
    disabled: true,
    value: 32.99,
    itemClass: 'col-span-2',
  },
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Advanced Logic" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Conditional fields (show/hide based on values) and dynamic value updates.
        </p>
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-2xl">
            <Form
              :schema="advancedSchema"
              class-name="grid-cols-2"
              submitText="Process Payment"
              @onSubmit="handleSubmit" />
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
