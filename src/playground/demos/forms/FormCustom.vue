<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormCustom.vue?raw'

const customFieldsSchema: IForm[] = [
  {
    name: 'projectName',
    label: 'Project Name',
    type: 'text',
    placeholder: 'My Awesome Project',
    required: true,
    itemClass: 'col-span-2',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe your project...',
    props: { rows: 2 },
    itemClass: 'col-span-2',
  },
  {
    name: 'socialLinks',
    label: 'Social Media Links',
    type: 'customFields',
    itemClass: 'col-span-2',
    props: {
      schema: [
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          options: [
            { label: 'Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'Website', value: 'website' },
          ],
        },
        {
          name: 'url',
          label: 'URL',
          type: 'url',
          placeholder: 'https://',
        },
      ],
      headers: ['Platform', 'URL'],
    },
    value: [],
  },
  {
    name: 'teamMembers',
    label: 'Team Members',
    type: 'customFields',
    itemClass: 'col-span-2',
    props: {
      schema: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'John Doe',
        },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { label: 'Developer', value: 'developer' },
            { label: 'Designer', value: 'designer' },
            { label: 'Manager', value: 'manager' },
            { label: 'QA', value: 'qa' },
          ],
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'email@example.com',
        },
      ],
      headers: ['Name', 'Role', 'Email'],
    },
    value: [],
  },
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Custom Fields (Repeater)" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Dynamic list of fields (repeater / array fields) allowing users to add multiple entries.
        </p>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-3xl">
            <Form
              :schema="customFieldsSchema"
              class-name="grid-cols-2"
              submitText="Save Project"
              @onSubmit="handleSubmit" />
          </div>

          <div v-if="submittedValues" class="flex-1 max-w-sm">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full sticky top-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:database" class="w-5 h-5 text-gray-600" />
                <h4 class="font-semibold text-gray-800">Project Data</h4>
              </div>
              <div class="bg-white rounded border border-gray-200 p-3 overflow-auto max-h-[500px]">
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
