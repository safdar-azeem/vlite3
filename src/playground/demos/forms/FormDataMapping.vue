<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormDataMapping.vue?raw'

// Simulate raw data coming from an API/Database
const rawProductData = {
  id: 'prod_999',
  name: 'Premium Cotton T-Shirt',
  // The API returns an array of full tax objects, but our form just needs the IDs
  taxes: [
    { id: 'tax_1', name: 'VAT (20%)', rate: 20 },
    { id: 'tax_2', name: 'Sales Tax (5%)', rate: 5 },
  ],
  // The API returns a nested structure for sizes, but CustomFields needs a flat structure
  sizes: [
    { size: { id: 'sz_m', name: 'Medium' }, quantity: 15 },
    { size: { id: 'sz_l', name: 'Large' }, quantity: 8 },
  ],
}

const mappingSchema: IForm[] = [
  {
    name: 'name',
    label: 'Product Name',
    type: 'text',
    required: true,
  },
  {
    name: 'taxIds', // The property name in the form's internal state
    mapFrom: 'taxes', // Read from the 'taxes' array in the raw incoming data
    valueKey: 'id', // Smartly extract just the 'id' property from each object in the array
    label: 'Applicable Taxes',
    type: 'multiSelect',
    options: [
      { label: 'VAT (20%)', value: 'tax_1' },
      { label: 'Sales Tax (5%)', value: 'tax_2' },
      { label: 'Import Duty (10%)', value: 'tax_3' },
    ],
    placeholder: 'Select taxes...',
  },
  {
    name: 'inventorySizes', // Internal form state name
    mapFrom: 'sizes', // Read from the 'sizes' array in raw data
    mapTo: 'sizes', // Write back to 'sizes' array in the final submit payload
    label: 'Inventory Sizes',
    type: 'customFields',
    // Format the incoming nested data into the flat structure the custom field expects
    format: (val) => {
      if (!val) return []
      return val.map((s: any) => ({
        sizeId: s.size?.id || s.sizeId,
        quantity: s.quantity,
      }))
    },
    // Transform the form data before submitting it to the API
    transform: (val) => {
      if (!val) return []
      return val.map((s: any) => ({
        sizeId: s.sizeId,
        quantity: Number(s.quantity), // Ensure quantity is a number
      }))
    },
    props: {
      schema: [
        {
          name: 'sizeId',
          label: 'Size',
          type: 'select',
          options: [
            { label: 'Small', value: 'sz_s' },
            { label: 'Medium', value: 'sz_m' },
            { label: 'Large', value: 'sz_l' },
          ],
        },
        {
          name: 'quantity',
          label: 'Quantity',
          type: 'number',
          min: 0,
        },
      ],
      headers: ['Size', 'Quantity'],
    },
  },
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Data Mapping & Formatting" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-6">
          Use <code>mapFrom</code>, <code>mapTo</code>, <code>valueKey</code>, <code>format</code>,
          and <code>transform</code> to intelligently handle complex data structures (like arrays of
          objects) directly from your schema, eliminating the need to manually parse data before and
          after form submission.
        </p>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-2xl">
            <div class="bg-gray-50 border border-border rounded-lg p-4 mb-6">
              <div class="flex items-center gap-2 mb-2">
                <Icon icon="lucide:database" class="w-4 h-4 text-primary" />
                <h4 class="font-semibold text-sm text-gray-800">
                  Raw Incoming Data (Simulated API Response)
                </h4>
              </div>
              <pre
                class="text-xs text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200"
                >{{ JSON.stringify(rawProductData, null, 2) }}</pre
              >
            </div>

            <Form
              :schema="mappingSchema"
              :values="rawProductData"
              submitText="Save Product"
              @onSubmit="handleSubmit" />
          </div>

          <div v-if="submittedValues" class="flex-1 max-w-md">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full sticky top-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
                <h4 class="font-semibold text-green-800">Cleaned & Transformed Payload</h4>
              </div>
              <p class="text-xs text-green-700 mb-3">
                Notice how `inventorySizes` mapped back to `sizes` and quantities were cast to
                Numbers.
              </p>
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
