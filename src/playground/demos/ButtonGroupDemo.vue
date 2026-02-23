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

    <DemoSection title="Attached (Default)" :code="sourceCode">
      <ButtonGroup>
        <Button>Years</Button>
        <Button>Months</Button>
        <Button>Days</Button>
        <Button icon="lucide:trash-2" />
      </ButtonGroup>
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
