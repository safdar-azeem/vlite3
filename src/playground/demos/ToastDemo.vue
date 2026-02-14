<script setup lang="ts">
import { ref } from 'vue'
import { showToast, useNotifications, type ToastPosition } from '@/composables/useNotifications'
import Button from '@/components/Button.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ToastDemo.vue?raw'

const { toast, configure } = useNotifications()

// Global Config State for Demo
const globalPos = ref<ToastPosition>('bottom-right')

const applyGlobalConfig = (pos: ToastPosition) => {
  globalPos.value = pos
  configure({ position: pos })
  toast.info('Global position updated!')
}

const triggerToast = (position: ToastPosition, type: 'success' | 'info' | 'error' = 'success') => {
  // Pass undefined for position to use global default
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
  <div class="space-y-10">
    <!-- Ensure the global provider is present for the demo -->
    <ToastNotification />

    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Toast Notification</h2>
      <p class="text-gray-500">Global notification system with stacked layout and animations.</p>
    </div>

    <DemoSection title="Global Configuration" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50 space-y-4">
        <p class="text-sm text-gray-500">Set the default position for all future toasts.</p>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="pos in ['top-left', 'top-right', 'bottom-left', 'bottom-right']"
            :key="pos"
            :variant="globalPos === pos ? 'primary' : 'outline'"
            size="sm"
            @click="applyGlobalConfig(pos as ToastPosition)">
            {{ pos }}
          </Button>
        </div>
        <div class="pt-4 border-t">
          <Button @click="showToast('This uses the global default position')">
            Test Default Toast
          </Button>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Positions" :code="sourceCode">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
        <Button @click="triggerToast('top-left')">Top Left</Button>
        <Button @click="triggerToast('top-center')">Top Center</Button>
        <Button @click="triggerToast('top-right')">Top Right</Button>

        <Button @click="triggerToast('bottom-left', 'info')">Bottom Left</Button>
        <Button @click="triggerToast('bottom-center', 'info')">Bottom Center</Button>
        <Button @click="triggerToast('bottom-right', 'info')">Bottom Right</Button>
      </div>
    </DemoSection>

    <DemoSection title="Types & Features" :code="sourceCode">
      <div class="flex flex-wrap gap-4">
        <Button variant="success" @click="triggerToast('bottom-right', 'success')">Success</Button>
        <Button variant="danger" @click="triggerToast('bottom-right', 'error')">Error</Button>
        <Button variant="outline" @click="triggerActionToast">With Action & Desc</Button>
        <Button variant="outline" @click="triggerStack">Trigger Stack</Button>
        <Button variant="outline" @click="triggerPromise">Promise Toast</Button>
      </div>
    </DemoSection>
  </div>
</template>
