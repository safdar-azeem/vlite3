<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import Button from '@/components/Button.vue'
import { ref, defineComponent, h, onMounted } from 'vue'
import ColorsDemo from './ColorsDemo.vue'
import { Form, type IForm } from '@/components/Form'
import { toast } from '@/composables/useNotifications'

const showModal = ref(false)
const showScrollModal = ref(false)
const showConfirm = ref(false)
const showFormModal = ref(false)

// A simple component defined inline to demonstrate the :body prop
const LazyModalContent = defineComponent({
  props: {
    close: { type: Function },
    itemName: { type: String, default: 'Test Item' },
  },
  setup(props) {
    onMounted(() => {
      console.log('[LazyModalContent] Mounted! This only runs when the modal opens.')
    })
    return () =>
      h('div', { class: 'space-y-4' }, [
        h(
          'p',
          { class: 'text-gray-600' },
          `This content is lazily rendered for: ${props.itemName}`
        ),
        h(
          'p',
          { class: 'text-sm text-muted-foreground' },
          'Open the browser console — the "Mounted" log only appears when this modal opens, not when the page loads.'
        ),
        h('div', { class: 'flex justify-end pt-4' }, [
          h(Button, { variant: 'outline', onClick: props.close }, () => 'Close'),
        ]),
      ])
  },
})

// Sample list to demonstrate performance benefit in iterated context
const sampleItems = [
  { id: 1, name: 'Document A' },
  { id: 2, name: 'Document B' },
  { id: 3, name: 'Document C' },
]

// Schema for the Form inside Modal
const modalFormSchema: IForm[] = [
  {
    type: 'fileUploader',
    name: 'files',
    label: 'Upload Files',
    required: true,
    props: {
      multiSelect: true,
    },
  },
  {
    type: 'fileUploader',
    name: 'files',
    label: 'Upload Files',
    required: true,
    props: {
      multiSelect: true,
    },
  },
  {
    type: 'fileUploader',
    name: 'files',
    label: 'Upload Files',
    required: true,
    props: {
      multiSelect: true,
    },
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

  // Note: We DO NOT need to manually close the modal here.
  // The Form component detects the modal context and closes it automatically on success.
}
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Modal</h2>
      <p class="text-gray-500">Dialogs that interrupt user flow for critical actions or info.</p>
    </div>

    <section class="space-y-4 border-b pb-8">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold">Form Integration (Auto-detect)</h3>
        <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">New</span>
      </div>
      <p class="text-sm text-gray-500">
        The <code>Form</code> component automatically detects if it is rendered inside a
        <code>Modal</code>. It will automatically show a "Cancel" button and handle closing the
        modal upon successful submission or cancellation.
      </p>

      <Button @click="showFormModal = true">Open Form Modal</Button>

      <Modal
        v-model:show="showFormModal"
        title="Create New Task"
        description="Fill out the details below. The form handles the modal buttons automatically.">
        <Form :schema="modalFormSchema" submitText="Create Task" @onSubmit="handleFormSubmit" />
      </Modal>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Basic Usage</h3>
      <Button @click="showModal = true">Open Standard Modal</Button>

      <Modal
        v-model:show="showModal"
        title="Edit Profile"
        max-width="max-w-4xl"
        description="Make changes to your profile here.">
        <div class="py-4">
          <ColorsDemo />
        </div>
        <template #footer="{ close }">
          <div class="flex justify-end gap-2 w-full">
            <Button variant="outline" @click="close">Cancel</Button>
            <Button @click="close">Save</Button>
          </div>
        </template>
      </Modal>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Long Content</h3>
      <Button @click="showScrollModal = true">Open Scrollable Modal</Button>
      <Modal v-model:show="showScrollModal" title="Terms of Service">
        <div class="space-y-4 py-2">
          <p v-for="i in 10" :key="i" class="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </Modal>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Lazy Body Component</h3>
      <p class="text-sm text-gray-500">
        Pass a component via <code>:body</code> — it's only instantiated when the modal opens. Ideal
        for lists where each row has a modal.
      </p>

      <Modal title="Lazy Modal" :body="LazyModalContent" :body-props="{ itemName: 'Single Item' }">
        <Button>Open Lazy Modal</Button>
      </Modal>

      <div class="flex gap-2">
        <Modal
          v-for="item in sampleItems"
          :key="item.id"
          :title="`Details: ${item.name}`"
          :body="LazyModalContent"
          :itemName="item.name">
          <Button variant="outline" size="sm">{{ item.name }}</Button>
        </Modal>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Confirmation Modal</h3>
      <Button variant="danger" @click="showConfirm = true">Delete Account</Button>
      <ConfirmationModal
        v-model:show="showConfirm"
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        confirm-text="Yes, delete account"
        @confirm="showConfirm = false"
        @cancel="showConfirm = false" />

      <ConfirmationModal
        title="Remove item?"
        description="This will remove the selected item."
        @confirm="() => {}"
        @cancel="() => {}">
        <Button variant="outline">Delete with Trigger</Button>
      </ConfirmationModal>
    </section>
  </div>
</template>
