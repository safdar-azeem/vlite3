<script setup lang="ts">
import Beacon from '@/components/Beacon.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './BeaconDemo.vue?raw'
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-col space-y-2 pb-6 mb-8 border-b border-border/30">
      <h2 class="text-3xl font-bold tracking-tight text-foreground">Beacon</h2>
      <p class="text-base text-muted-foreground w-full max-w-[800px]">
        A pulsating beacon that attracts attention. Used to indicate new updates, notifications, or features.
      </p>
    </div>

    <div class="flex flex-col w-full gap-2">
      <DemoSection title="Variants" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-6 w-full">
          <Beacon variant="primary" />
          <Beacon variant="danger" />
          <Beacon variant="warning" />
          <Beacon variant="success" />
          <Beacon variant="info" />
        </div>
      </DemoSection>

      <DemoSection title="Sizes" :code="sourceCode">
        <div class="flex flex-wrap items-end justify-center gap-6 w-full">
          <Beacon size="sm" />
          <Beacon size="md" />
          <Beacon size="lg" />
        </div>
      </DemoSection>

      <DemoSection title="Examples" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-6 w-full">
          <div class="relative inline-flex">
            <Button icon="lucide:bell" variant="outline" rounded="full" />
            <Beacon variant="danger" class="absolute top-0 right-0" />
          </div>

          <div class="relative inline-flex">
            <Button>
              Inbox
              <Beacon variant="primary" class="ml-2" />
            </Button>
          </div>
          
          <div class="relative inline-flex">
            <div class="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center gap-4">
              <Beacon variant="success" />
              <span class="text-sm font-medium">System Operational</span>
            </div>
          </div>
        </div>
      </DemoSection>
    </div>
  </div>
</template>
