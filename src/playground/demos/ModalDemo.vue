<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import Button from '@/components/Button.vue'
import { ref } from 'vue'

const showModal = ref(false)
const showScrollModal = ref(false)
const showConfirm = ref(false)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Modal</h2>
      <p class="text-gray-500">Dialogs that interrupt user flow for critical actions or info.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Basic Usage</h3>
      <Button @click="showModal = true">Open Standard Modal</Button>
      
      <Modal v-model:show="showModal" title="Edit Profile" description="Make changes to your profile here.">
         <div class="py-4">
           <p class="text-gray-600">This is the modal content area.</p>
         </div>
         <template #footer="{ close }">
            <div class="flex justify-end gap-2 w-full">
               <Button variant="outline" @click="close">Cancel</Button>
               <Button @click="close">Save</Button>
            </div>
         </template>
      </Modal>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Long Content</h3>
      <Button @click="showScrollModal = true">Open Scrollable Modal</Button>
      <Modal v-model:show="showScrollModal" title="Terms of Service">
         <div class="space-y-4 py-2">
            <p v-for="i in 10" :key="i" class="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
         </div>
      </Modal>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Confirmation Modal</h3>
      <Button variant="danger" @click="showConfirm = true">Delete Account</Button>
      <ConfirmationModal
         v-model:show="showConfirm"
         title="Are you absolutely sure?"
         description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
         confirm-text="Yes, delete account"
         @confirm="showConfirm = false"
         @cancel="showConfirm = false"
      />
    </section>
  </div>
</template>
