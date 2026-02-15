<script setup lang="ts">
import { ref } from 'vue'
import Form from '@/components/Form/Form.vue'
import type { IForm } from '@/components/Form/types'

const values = ref({
  age: 25,
  quantity: 1,
  price: 99.99,
  rating: 3,
  temperature: 20,
})

const schema: IForm[] = [
  {
    name: 'age',
    label: 'Age (Basic)',
    type: 'number',
    placeholder: 'Enter your age',
    required: true,
    min: 0,
    max: 120,
  },
  {
    name: 'quantity',
    label: 'Quantity (Stacked)',
    type: 'number',
    required: true,
    min: 1,
    max: 100,
    props: {
      variant: 'stacked',
      step: 1,
    },
  },
  {
    name: 'price',
    label: 'Price (Currency)',
    type: 'number',
    required: true,
    min: 0,
    props: {
      step: 0.01,
      variant: 'split',
      mode: 'solid',
    },
    addonLeft: '$',
  },
  {
    name: 'rating',
    label: 'Rating (0-5)',
    type: 'number',
    min: 0,
    max: 5,
    props: {
      variant: 'split',
      rounded: 'full',
    },
  },
  {
    name: 'temperature',
    label: 'Temperature (Step 5)',
    type: 'number',
    props: {
      step: 5,
      variant: 'stacked',
      mode: 'ghost',
    },
    addonRight: '°C',
  },
]

const handleSubmit = (payload: any) => {
  console.log('Form submitted:', payload)
  if (payload.values) {
    values.value = payload.values
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h3 class="text-lg font-medium text-gray-900">Number Inputs</h3>
      <p class="text-gray-500">Enhanced number inputs with different variants and modes.</p>
    </div>

    <Form :schema="schema" :values="values" submit-text="Save Changes" @on-submit="handleSubmit" />

    <div class="p-4 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Live Values</h4>
      <pre class="text-xs text-gray-600">{{ values }}</pre>
    </div>
  </div>
</template>
