<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalScrollable.vue?raw'

const showScrollModal = ref(false)
</script>

<template>
  <DemoSection title="Long Content" :code="sourceCode">
    <Button @click="showScrollModal = true">Open Scrollable Modal</Button>
    <Modal v-model:show="showScrollModal" title="Terms of Service">
      <div class="space-y-4 py-2">
        <p v-for="i in 10" :key="i" class="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </Modal>
  </DemoSection>
</template>
