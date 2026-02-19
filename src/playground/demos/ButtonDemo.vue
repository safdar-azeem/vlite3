<script setup lang="ts">
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ButtonDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Button</h2>
      <p class="text-gray-500">
        Triggers an event or action. They let users know what will happen next.
      </p>
    </div>

    <!-- Variants -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </DemoSection>

    <!-- Semantic Variants -->
    <DemoSection title="Semantic / Colors" :code="sourceCode">
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button variant="info">Info</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button variant="info-light">Info Light</Button>
          <Button variant="success-light">Success Light</Button>
          <Button variant="warning-light">Warning Light</Button>
          <Button variant="danger-light">Danger Light</Button>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button variant="outline-info">Outline Info</Button>
          <Button variant="outline-success">Outline Success</Button>
          <Button variant="outline-warning">Outline Warning</Button>
          <Button variant="outline-danger">Outline Danger</Button>
        </div>
      </div>
    </DemoSection>

    <!-- Sizes -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium (Default)</Button>
        <Button size="lg">Large</Button>
      </div>
    </DemoSection>

    <!-- States & Shapes -->
    <DemoSection title="States & Shapes" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-4">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button rounded="full">Rounded Full</Button>
        <Button rounded="none">Rounded None</Button>
      </div>
    </DemoSection>

    <!-- Icons -->
    <DemoSection title="With Icons" :code="sourceCode">
      <div class="flex flex-wrap gap-4">
        <Button icon="lucide:plus">Add New</Button>
        <Button icon-right="lucide:arrow-right">Continue</Button>
        <Button icon="lucide:settings" variant="outline">Settings</Button>
        <Button icon="lucide:trash-2" variant="danger" size="sm" />
        <Button icon="lucide:trash-2" variant="danger" />

        <Button
          variant="secondary"
          icon="https://cdn.prod.website-files.com/666ad77562dfabab1eb27f63/6747850440da96e6bc2d78b3_friso_ai3.webp"
          text="Secondary" />
        <Button variant="secondary" icon="lucide:settings" text="Secondary" />
      </div>
    </DemoSection>
  </div>
</template>
