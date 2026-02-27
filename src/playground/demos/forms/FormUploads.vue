<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormUploads.vue?raw'

const uploadSchema: IForm[] = [
  {
    name: 'avatar',
    label: 'Avatar Upload',
    type: 'avatarUpload',
    placeholder: 'John Doe',
    required: true,
  },
  {
    name: 'idProof',
    label: 'ID Proof (Input Style)',
    type: 'file',
    required: true,
    maxFileSize: 1,
    placeholder: 'Select ID document',
    props: {
      accept: 'image/*,.pdf',
    },
  },
  {
    name: 'resume',
    label: 'Resume (Dropzone)',
    type: 'fileUploader',
    required: true,
    props: {
      accept: '.pdf,.doc,.docx',
    },
  },
  {
    name: 'gallery',
    label: 'Project Gallery (Multiple Files)',
    type: 'fileUploader',
    maxFiles: 3,
    returnFileObject: true,
    props: {
      multiple: true,
      accept: 'image/*',
    },
  },
  {
    name: 'documents',
    label: 'Document Collection (Custom Fields with File)',
    type: 'customFields',
    props: {
      schema: [
        {
          name: 'title',
          label: 'Document Title',
          type: 'text',
          placeholder: 'e.g. Identity Proof',
        },
        {
          name: 'file',
          label: 'File Attachment',
          type: 'file',
          props: {
            accept: '.pdf,.jpg,.png',
          },
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Business', value: 'business' },
            { label: 'Legal', value: 'legal' },
          ],
        },
      ],
      headers: ['Title', 'File', 'Category'],
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
  <DemoSection title="File Uploads" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Various ways to handle file inputs: Avatar, Standard Input, Dropzone, and Dynamic Lists.
        </p>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="flex-1 max-w-2xl">
            <Form :schema="uploadSchema" submitText="Upload Files" @onSubmit="handleSubmit" />
          </div>

          <div v-if="submittedValues" class="flex-1 max-w-sm">
            <div class="bg-gray-50 border border-border rounded-lg p-4 h-full">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:file-check" class="w-5 h-5 text-gray-600" />
                <h4 class="font-semibold text-gray-800">Files Ready</h4>
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
