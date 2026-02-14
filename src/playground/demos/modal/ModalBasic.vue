<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalBasic.vue?raw'

const showModal = ref(false)
</script>

<template>
  <DemoSection title="Basic Usage" :code="sourceCode">
    <Button @click="showModal = true">Open Standard Modal</Button>

    <Modal
      v-model:show="showModal"
      title="Edit Profile"
      max-width="max-w-4xl"
      description="Make changes to your profile here.">
      <div class="py-4 space-y-4">
        <!-- Replaced ColorsDemo with placeholder to simpler dependence -->
        <div class="p-4 bg-gray-50 rounded border border-gray-100">
          <h4 class="font-medium text-gray-900 mb-2">Profile Settings</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value="safdar_azeem" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <select
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option>Administrator</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <template #footer="{ close }">
        <div class="flex justify-end gap-2 w-full">
          <Button variant="outline" @click="close">Cancel</Button>
          <Button @click="close">Save</Button>
        </div>
      </template>
    </Modal>
  </DemoSection>
</template>
