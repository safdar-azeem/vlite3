<script setup lang="ts">
import { showToast, useNotifications, type ToastPosition } from '@/composables/useNotifications'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ToastFeatures.vue?raw'

const { toast } = useNotifications()

const triggerToast = (position: ToastPosition, type: 'success' | 'info' | 'error' = 'success') => {
  showToast(`Login Successful`, type, {
    duration: 3000,
    position,
  })
}

const triggerActionToast = () => {
  toast('File deleted successfully', {
    description: 'You can undo this action within 5 seconds.',
    action: {
      label: 'Undo',
      onClick: () => toast.success('Undo action clicked!'),
    },
    position: 'bottom-right',
  })
}

const triggerStack = () => {
  // Quickly add multiple toasts to show stacking
  ;['Event Created', 'Email Sent', 'Profile Updated'].forEach((msg, i) => {
    setTimeout(() => {
      toast.success(msg, { description: 'Just now' })
    }, i * 200)
  })
}

const triggerPromise = () => {
  toast.promise(new Promise((resolve) => setTimeout(() => resolve({ name: 'Document' }), 2000)), {
    loading: 'Uploading...',
    success: (data: any) => `${data.name} uploaded successfully`,
    error: 'Upload failed',
  })
}
</script>

<template>
  <DemoSection title="Types & Features" :code="sourceCode">
    <div class="flex flex-wrap gap-4">
      <Button variant="success" @click="triggerToast('bottom-right', 'success')">Success</Button>
      <Button variant="danger" @click="triggerToast('bottom-right', 'error')">Error</Button>
      <Button variant="outline" @click="triggerActionToast">With Action & Desc</Button>
      <Button variant="outline" @click="triggerStack">Trigger Stack</Button>
      <Button variant="outline" @click="triggerPromise">Promise Toast</Button>
    </div>
  </DemoSection>
</template>
