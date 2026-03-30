<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { CustomFieldsDisplay } from '@/components/CustomFieldsDisplay'

const sampleFields = ref([
  { key: 'Department', value: 'Engineering' },
  { key: 'Project Code', value: 'PRJ-9823' },
  { key: 'Budget', value: '$45,000' },
  { key: 'Remote Approved', value: true },
  { key: 'Technologies', value: ['Vue', 'TypeScript', 'Tailwind'] },
])

const emptyFields = ref([])
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-10">
    <div>
      <h2 class="text-2xl font-bold mb-2">Custom Fields Display</h2>
      <p class="text-gray-500">
        A versatile component to render dynamic arrays of key-value pairs (custom fields)
        seamlessly, complete with an optional header and multiple layout variants.
      </p>
    </div>

    <DemoSection
      title="List Variant with Header"
      code="<CustomFieldsDisplay title='Project Details' icon='lucide:info' :fields='sampleFields' variant='list' />">
      <div class="max-w-lg w-full">
        <CustomFieldsDisplay
          title="Project Details"
          icon="lucide:info"
          :fields="sampleFields"
          variant="list" />
      </div>
    </DemoSection>

    <DemoSection
      title="Grid Variant with Header"
      code="<CustomFieldsDisplay title='Quick Overview' icon='lucide:zap' :fields='sampleFields' variant='grid' :columns='3' />">
      <CustomFieldsDisplay
        title="Quick Overview"
        icon="lucide:zap"
        :fields="sampleFields"
        variant="grid"
        :columns="3" />
    </DemoSection>

    <DemoSection
      title="Card Variant"
      code="<CustomFieldsDisplay :fields='sampleFields' variant='card' :columns='2' />">
      <CustomFieldsDisplay :fields="sampleFields" variant="card" :columns="2" />
    </DemoSection>

    <DemoSection
      title="Inline Variant"
      code="<CustomFieldsDisplay :fields='sampleFields' variant='inline' />">
      <CustomFieldsDisplay :fields="sampleFields" variant="inline" />
    </DemoSection>

    <DemoSection
      title="Empty State (List Variant)"
      code="<CustomFieldsDisplay title='Empty Properties' icon='lucide:box' :fields='[]' variant='list' empty-text='No custom fields provided' />">
      <div class="max-w-lg w-full">
        <CustomFieldsDisplay
          title="Empty Properties"
          icon="lucide:box"
          :fields="emptyFields"
          variant="list"
          empty-text="No custom fields provided" />
      </div>
    </DemoSection>
  </div>
</template>
