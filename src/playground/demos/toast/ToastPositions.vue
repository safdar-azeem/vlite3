<script setup lang="ts">
import { showToast, type ToastPosition } from '@/composables/useNotifications'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ToastPositions.vue?raw'

const triggerToast = (position: ToastPosition, type: 'success' | 'info' | 'error' = 'success') => {
  // Pass undefined for position to use global default
  showToast(`Login Successful`, type, {
    duration: 3000,
    position,
  })
}
</script>

<template>
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
</template>
