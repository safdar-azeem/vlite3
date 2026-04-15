<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import { Form, type IForm } from '@/components/Form'
import { toast } from '@/composables/useNotifications'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalForm.vue?raw'

const showFormModal = ref(false)

const inviteFormSchema: IForm[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'text',
    required: true,
    placeholder: 'colleague@company.com',
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
  {
    name: 'message',
    label: 'Personal message (optional)',
    type: 'textarea',
    placeholder: 'Add a note to the invitation email...',
    props: { rows: 3 },
  },
]

const handleInviteSubmit = async (payload: any) => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  console.log('Invite sent:', payload)
  toast.success('Invitation sent successfully!')
}
</script>

<template>
  <DemoSection title="Form Integration (Auto-detect)" :code="sourceCode">
    <div class="flex flex-col items-center gap-4">
      <p class="text-sm text-muted-foreground text-center max-w-sm">
        The <code class="text-xs bg-muted/60 px-1 py-0.5 rounded font-mono">Form</code> component
        automatically detects a parent
        <code class="text-xs bg-muted/60 px-1 py-0.5 rounded font-mono">Modal</code> and wires up
        the submit/cancel buttons — no extra configuration needed.
      </p>

      <Button icon="lucide:user-plus" @click="showFormModal = true">Invite Team Member</Button>
    </div>

    <Modal
      v-model:show="showFormModal"
      title="Invite Team Member"
      description="Send an invitation email with a role assignment. The recipient will receive a link to accept.">
      <Form :schema="inviteFormSchema" submitText="Send Invitation" @onSubmit="handleInviteSubmit" />
    </Modal>
  </DemoSection>
</template>
