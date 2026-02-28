<script setup lang="ts">
import DemoSection from '../DemoSection.vue'
import { Button, Input, FilePicker, Dropdown, Form, type IForm, $t } from '../../'
import sourceCode from './I18nDemo.vue?raw'
import { ref } from 'vue'

// Form schema demonstrating i18n translation properties
const formSchema: IForm[] = [
  {
    name: 'branchName',
    type: 'text',
    required: true,
    // Standard fallbacks
    label: 'Branch Name',
    placeholder: 'Enter branch name',
    // i18n Translation Keys
    labelI18n: 'common.words.name',
    placeholderI18n: 'hrm.branch.form.namePlaceholder',
  },
  {
    name: 'manager',
    type: 'select',
    // Standard fallbacks
    label: 'Manager',
    placeholder: 'Select manager',
    // i18n Translation Keys
    labelI18n: 'hrm.branch.form.managerLabel',
    placeholderI18n: 'hrm.branch.form.managerPlaceholder',
    options: [
      { label: 'John Doe', value: 'john', labelI18n: 'common.words.name' },
      { label: 'Jane Smith', value: 'jane', labelI18n: 'common.words.name' },
    ],
  },
  {
    name: 'documents',
    type: 'customFields',
    label: 'Documents',
    labelI18n: 'upload.selectFile', // Reusing a key for demonstration
    props: {
      schema: [
        {
          name: 'title',
          label: 'Title',
          labelI18n: 'common.words.name', // Table header will use this
          type: 'text',
        },
      ],
    },
  },
]

const dropdownOptions = [
  {
    label: 'General Settings',
    labelI18n: 'dropdown.settings.label',
    description: 'Manage your general preferences',
    descriptionI18n: 'dropdown.settings.description',
    value: 'settings',
  },
  {
    label: 'Security & Privacy',
    labelI18n: 'dropdown.security.label',
    subtitle: 'High Priority',
    subtitleI18n: 'dropdown.security.subtitle',
    value: 'security',
  },
]
const selectedDropdown = ref('settings')

// Direct utility usage outside of template
const directTranslation = $t('dashboard.welcome')
const missingTranslation = $t('some.missing.key')
</script>

<template>
  <div class="space-y-10">
    <div>
      <h2 class="text-2xl font-bold mb-2">i18n (Internationalization)</h2>
      <p class="text-gray-500">
        Demonstrates how components resolve translation keys automatically using the globally
        registered <code>t</code> function in <code>vlite3</code>.
      </p>
      <div class="mt-4 p-4 border border-border rounded-lg bg-indigo-50 text-sm text-indigo-900">
        <strong>Note:</strong> In this playground, a mock dictionary translates matched keys to
        Spanish to visually demonstrate the replacement. Check <code>main.ts</code> to see the
        setup.
      </div>
    </div>

    <DemoSection title="Component Props" :code="sourceCode">
      <div class="space-y-6 max-w-md">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Button (textI18n)</label>
          <div>
            <Button text="Fallback Text" textI18n="common.buttons.save" icon="lucide:save" />
          </div>
        </div>

        <div class="space-y-2">
          <Input
            label="Fallback Label"
            labelI18n="common.words.name"
            placeholder="Fallback Placeholder"
            placeholderI18n="hrm.branch.form.namePlaceholder" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700"
            >Dropdown Options (I18n Properties)</label
          >
          <Dropdown v-model="selectedDropdown" :options="dropdownOptions" class="w-full">
            <template #trigger="{ selectedLabel }">
              <Button
                variant="outline"
                class="w-full justify-between!"
                iconRight="lucide:chevron-down">
                {{ selectedLabel }}
              </Button>
            </template>
          </Dropdown>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">FilePicker Dropzone</label>
          <FilePicker textI18n="upload.dragDropText" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">FilePicker Input Variant</label>
          <FilePicker variant="input" placeholderI18n="upload.selectFile" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Schema-Driven Forms" :code="sourceCode">
      <div class="max-w-md p-6 border border-border bg-white rounded-lg shadow-sm">
        <Form :schema="formSchema" submitText="Submit" />
      </div>
    </DemoSection>

    <DemoSection title="$t Utility Usage" :code="sourceCode">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          You can use <code>$t()</code> directly in your scripts to resolve translations for
          non-component text.
        </p>

        <div class="p-4 bg-gray-50 border border-border rounded-md space-y-2">
          <div class="flex gap-2 items-center">
            <span class="font-semibold text-sm w-32">Resolved Key:</span>
            <span class="text-sm bg-white px-2 py-1 rounded border border-gray-200">{{
              directTranslation
            }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <span class="font-semibold text-sm w-32">Missing Key:</span>
            <span class="text-sm bg-white px-2 py-1 rounded border border-gray-200 text-gray-500">{{
              missingTranslation
            }}</span>
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
