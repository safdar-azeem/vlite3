<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalScrollable.vue?raw'

const showScrollModal = ref(false)
const accepted = ref(false)
</script>

<template>
  <DemoSection title="Long / Scrollable Content" :code="sourceCode">
    <Button icon="lucide:scroll-text" @click="showScrollModal = true">View Terms of Service</Button>

    <Modal v-model:show="showScrollModal" title="Terms of Service" max-width="max-w-xl">
      <div class="space-y-5 py-1 text-sm text-muted-foreground leading-relaxed">
        <p>
          Please read these Terms of Service carefully before using our platform. By accessing or
          using the service you agree to be bound by these terms.
        </p>

        <div>
          <h4 class="text-sm font-semibold text-foreground mb-1.5">1. Acceptance of Terms</h4>
          <p>
            By creating an account or using any feature of the platform you acknowledge that you
            have read, understood, and agree to these terms. If you do not agree, please discontinue
            use immediately.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground mb-1.5">2. Use of the Service</h4>
          <p>
            You may use the service only for lawful purposes and in accordance with these Terms. You
            agree not to misuse the service, attempt to gain unauthorised access, or transmit harmful
            or offensive content.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground mb-1.5">3. Privacy &amp; Data</h4>
          <p>
            Our Privacy Policy explains how we collect, use, and share information. Your data is
            processed on servers located within the jurisdiction you selected during sign-up and is
            never sold to third parties.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground mb-1.5">
            4. Intellectual Property
          </h4>
          <p>
            All content, trademarks, and intellectual property on the platform belong to us or our
            licensors. You retain ownership of the content you submit, but grant us a worldwide,
            royalty-free licence to host and display it.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground mb-1.5">5. Termination</h4>
          <p>
            We reserve the right to suspend or terminate your access at any time if you violate
            these terms. Upon termination your data will be retained for 30 days before permanent
            deletion, unless you request earlier removal.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground mb-1.5">6. Limitation of Liability</h4>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect,
            incidental, or consequential damages arising out of your use of the service.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-foreground mb-1.5">7. Changes to Terms</h4>
          <p>
            We may update these terms from time to time. Continued use of the service after changes
            become effective constitutes your acceptance of the revised terms.
          </p>
        </div>

        <p class="text-xs text-muted-foreground/70 pt-1">Last updated: January 2026</p>
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-between w-full gap-3">
          <label class="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="accepted"
              class="rounded border-border accent-primary" />
            I have read and accept the terms
          </label>
          <div class="flex gap-2 shrink-0">
            <Button variant="outline" @click="close">Decline</Button>
            <Button :disabled="!accepted" @click="close" icon="lucide:check">Accept</Button>
          </div>
        </div>
      </template>
    </Modal>
  </DemoSection>
</template>
