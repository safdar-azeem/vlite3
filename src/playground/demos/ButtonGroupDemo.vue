<script setup lang="ts">
import ButtonGroup from '@/components/ButtonGroup.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ButtonGroupDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">ButtonGroup</h2>
      <p class="text-gray-500">Group a series of buttons together on a single line.</p>
    </div>

    <DemoSection title="Attached (Default Mixed)" :code="sourceCode">
      <ButtonGroup>
        <Button size="sm">Years</Button>
        <Button size="sm">Months</Button>
        <Button size="sm">Days</Button>
        <Button size="sm" icon="lucide:settings" />
        <Button size="sm" icon="lucide:arrow-down" />
      </ButtonGroup>
    </DemoSection>
    
    <DemoSection title="Sizes (Icon Only Support)" :code="sourceCode">
      <div class="space-y-4">
        <div class="flex items-center gap-6">
          <label class="w-16 text-sm text-gray-500">Small</label>
          <ButtonGroup>
            <Button size="sm" icon="lucide:align-left" />
            <Button size="sm" icon="lucide:align-center" />
            <Button size="sm" icon="lucide:align-right" />
            <Button size="sm" icon="lucide:align-justify" />
          </ButtonGroup>
        </div>

        <div class="flex items-center gap-6">
          <label class="w-16 text-sm text-gray-500">Medium</label>
          <ButtonGroup>
            <Button size="md" icon="lucide:align-left" />
            <Button size="md" icon="lucide:align-center" />
            <Button size="md" icon="lucide:align-right" />
            <Button size="md" icon="lucide:align-justify" />
          </ButtonGroup>
        </div>

        <div class="flex items-center gap-6">
          <label class="w-16 text-sm text-gray-500">Large</label>
          <ButtonGroup>
            <Button size="lg" icon="lucide:align-left" />
            <Button size="lg" icon="lucide:align-center" />
            <Button size="lg" icon="lucide:align-right" />
            <Button size="lg" icon="lucide:align-justify" />
          </ButtonGroup>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Detached" :code="sourceCode">
      <ButtonGroup :attached="false">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Save</Button>
      </ButtonGroup>
    </DemoSection>

    <DemoSection title="Vertical" :code="sourceCode">
      <ButtonGroup direction="vertical">
        <Button variant="secondary">Top</Button>
        <Button variant="secondary">Middle</Button>
        <Button variant="secondary">Bottom</Button>
      </ButtonGroup>
    </DemoSection>
  </div>
</template>
