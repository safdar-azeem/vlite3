<script setup lang="ts">
import { ref } from 'vue'
import { useNotifications, type ToastPosition } from '@/composables/useNotifications'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ToastGlobal.vue?raw'

const { toast, configure } = useNotifications()
const globalPos = ref<ToastPosition>('bottom-right')

const applyGlobalConfig = (pos: ToastPosition) => {
  globalPos.value = pos
  configure({ position: pos })
  toast.info('Global position updated!')
}
</script>

<template>
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
        <Button @click="toast('This uses the global default position')">
          Test Default Toast
        </Button>
      </div>
    </div>
  </DemoSection>
</template>
