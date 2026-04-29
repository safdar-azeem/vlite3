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
    <Button icon="lucide:edit" @click="showModal = true">Edit Profile</Button>

    <Modal
      v-model:show="showModal"
      title="Edit Profile"
      description="Update your personal information. Changes will be reflected across the platform."
      max-width="max-w-2xl">
      <div class="space-y-5 py-2">
        <!-- Avatar row -->
        <div class="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/40">
          <div
            class="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xl shrink-0">
            SA
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground">Profile Photo</p>
            <p class="text-xs text-muted-foreground mt-0.5">PNG or JPG up to 2 MB</p>
          </div>
          <Button size="sm" variant="outline" icon="lucide:upload">Upload</Button>
        </div>

        <!-- Name fields -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-foreground">First Name</label>
            <input
              type="text"
              value="Safdar"
              class="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-foreground">Last Name</label>
            <input
              type="text"
              value="Azeem"
              class="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
        </div>

        <!-- Email + Role -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value="safdar@example.com"
              class="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-foreground">Role</label>
            <select
              class="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
              <option>Administrator</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>

        <!-- Bio -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-foreground">Bio</label>
          <textarea
            rows="3"
            class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            placeholder="Tell your team a little about yourself..."></textarea>
        </div>
      </div>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2 w-full">
          <Button variant="secondary" @click="close">Cancel</Button>
          <Button icon="lucide:check" @click="close">Save Changes</Button>
        </div>
      </template>
    </Modal>
  </DemoSection>
</template>
