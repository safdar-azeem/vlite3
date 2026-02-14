<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import { Form, type IForm } from '@/components/Form'
import { toast } from '@/composables/useNotifications'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalForm.vue?raw'

const showFormModal = ref(false)

const modalFormSchema: IForm[] = [
  {
    type: 'fileUploader',
    name: 'files',
    label: 'Upload Files',
    required: true,
    props: { multiSelect: true },
  },
  {
    name: 'title',
    label: 'Task Title',
    type: 'text',
    required: true,
    placeholder: 'Enter task title',
  },
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
    required: true,
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    type: 'date',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Add details...',
    props: { rows: 3 },
  },
]

const handleFormSubmit = async (payload: any) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log('Form submitted from modal:', payload)
  toast.success('Task created successfully!')
}
</script>

<template>
  <DemoSection title="Form Integration (Auto-detect)" :code="sourceCode">
    <div class="flex items-center gap-2 mb-2">
      <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">New</span>
    </div>
    <p class="text-sm text-gray-500">
      The <code>Form</code> component automatically detects if it is rendered inside a
      <code>Modal</code>. It will automatically show a "Cancel" button and handle closing the modal
      upon successful submission.
    </p>

    <Button @click="showFormModal = true">Open Form Modal</Button>

    <Modal
      v-model:show="showFormModal"
      title="Create New Task"
      description="Fill out the details below. The form handles the modal buttons automatically.">
      <Form :schema="modalFormSchema" submitText="Create Task" @onSubmit="handleFormSubmit" />
    </Modal>
  </DemoSection>
</template>
