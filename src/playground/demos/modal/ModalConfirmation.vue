<script setup lang="ts">
import { ref } from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalConfirmation.vue?raw'

const showDeleteAccount = ref(false)
const showArchive = ref(false)
</script>

<template>
  <DemoSection title="Confirmation Modal" :code="sourceCode">
    <div class="flex flex-wrap items-center gap-3">
      <!-- Destructive — v-model controlled -->
      <Button variant="danger" icon="lucide:trash-2" @click="showDeleteAccount = true">
        Delete Account
      </Button>

      <ConfirmationModal
        v-model:show="showDeleteAccount"
        title="Delete account permanently?"
        description="This action cannot be undone. All your data, workspaces, and preferences will be permanently removed from our servers."
        confirm-text="Yes, delete my account"
        @confirm="showDeleteAccount = false"
        @cancel="showDeleteAccount = false" />

      <!-- Archive — v-model controlled -->
      <Button variant="warning-light" icon="lucide:archive" @click="showArchive = true">
        Archive Project
      </Button>

      <ConfirmationModal
        v-model:show="showArchive"
        title="Archive this project?"
        description="Archived projects are hidden from the dashboard but can be restored at any time from your settings."
        confirm-text="Archive"
        @confirm="showArchive = false"
        @cancel="showArchive = false" />

      <!-- Inline trigger variant -->
      <ConfirmationModal
        title="Remove team member?"
        description="They will lose access to all shared resources immediately."
        confirm-text="Remove"
        @confirm="() => {}"
        @cancel="() => {}">
        <Button variant="outline" icon="lucide:user-minus">Remove Member</Button>
      </ConfirmationModal>
    </div>
  </DemoSection>
</template>
