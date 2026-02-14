<script setup lang="ts">
import { ref } from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalConfirmation.vue?raw'

const showConfirm = ref(false)
</script>

<template>
  <DemoSection title="Confirmation Modal" :code="sourceCode">
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
  </DemoSection>
</template>
