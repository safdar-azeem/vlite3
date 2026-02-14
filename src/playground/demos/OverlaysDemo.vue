<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import { Dropdown } from '@/components/Dropdown'
import Modal from '@/components/Modal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import Tooltip from '@/components/Tooltip.vue'
import SidePanel from '@/components/SidePanel.vue'
import Input from '@/components/Input.vue'
import Avatar from '@/components/Avatar.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './OverlaysDemo.vue?raw'

const dropdownValue = ref('1')
const showModal = ref(false)
const showConfirm = ref(false)
const showSidePanel = ref(false)
</script>

<template>
  <DemoSection title="Overlays & Popups" :code="sourceCode">
    <div class="space-y-2">
      <h2 class="text-xl font-semibold tracking-tight">Overlays & Popups</h2>
      <p class="text-sm text-gray-500">
        Components that appear on top of other content.
      </p>
    </div>

    <div class="flex flex-wrap gap-4 items-center">
      <!-- Dropdown -->
      <Dropdown
        @on-select="(props) => { dropdownValue = props?.value }"
        :options="[
          { value: '1', label: 'Profile', icon: 'lucide:user' },
          { value: '2', label: 'Billing', icon: 'lucide:credit-card' },
          { value: '3', label: 'Settings', icon: 'lucide:settings' },
          { value: '4', label: 'Logout', icon: 'lucide:log-out', disabled: true },
        ]"
        :selected="dropdownValue"
      >
        <template #trigger>
          <Button variant="outline" icon-right="lucide:chevron-down">Options Menu</Button>
        </template>
      </Dropdown>

      <!-- Tooltip -->
      <Tooltip content="Tooltip content helps users">
        <Button variant="secondary">Hover for Tooltip</Button>
      </Tooltip>

      <!-- Modal Trigger -->
      <Button @click="showModal = true">Standard Modal</Button>
      
      <!-- Confirmation Trigger -->
      <Button variant="danger" @click="showConfirm = true">Delete Action</Button>

      <!-- SidePanel Trigger -->
      <Button variant="primary" @click="showSidePanel = true">Open Side Panel</Button>
    </div>

    <!-- Modals (Hidden by default) -->
    <Modal v-model:show="showModal" title="Edit Profile" description="Make changes to your profile here.">
       <div class="space-y-4 py-2">
          <Input label="Name" placeholder="John Doe" />
          <Input label="Email" placeholder="john@example.com" />
       </div>
       <template #footer="{ close }">
          <div class="flex justify-end gap-2 w-full">
             <Button variant="outline" @click="close">Cancel</Button>
             <Button @click="close">Save Changes</Button>
          </div>
       </template>
    </Modal>

    <ConfirmationModal
       v-model:show="showConfirm"
       title="Delete Item?"
       description="This action cannot be undone. Are you sure you want to proceed?"
       confirm-text="Yes, Delete"
       @confirm="showConfirm = false"
       @cancel="showConfirm = false"
    />

    <SidePanel
       v-model:show="showSidePanel"
       title="Notifications"
       description="Manage your notification preferences."
       position="right"
    >
       <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg flex items-start gap-3">
             <Avatar size="sm" fallback="Sys" />
             <div>
                <p class="text-sm font-medium">System Update</p>
                <p class="text-xs text-gray-500">Your system was updated successfully.</p>
             </div>
          </div>
          <Input label="Quick Note" type="textarea" :rows="3" placeholder="Add a note..." />
       </div>
       <template #footer="{ close }">
          <Button class="w-full" @click="close">Done</Button>
       </template>
    </SidePanel>

  </DemoSection>
</template>
