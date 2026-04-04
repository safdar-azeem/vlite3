<script setup lang="ts">
import Button from '@/components/Button.vue'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ButtonDemo.vue?raw'
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4 pb-8 border-b border-border/50">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Button</h2>
      <p class="text-lg text-muted-foreground w-full max-w-[80%]">
        Triggers an event or action. They let users know what will happen next.
      </p>
    </div>

    <DemoSection title="Variants" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </DemoSection>

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

    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium (Default)</Button>
        <Button size="lg">Large</Button>
      </div>
    </DemoSection>

    <DemoSection title="States & Shapes" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-4">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button rounded="full">Rounded Full</Button>
        <Button rounded="none">Rounded None</Button>
      </div>
    </DemoSection>

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

    <DemoSection title="Back Button" :code="sourceCode">
      <p class="text-sm text-muted-foreground mb-4">
        A ghost, rounded icon button that navigates to the previous page. Falls back to
        <code class="text-xs bg-muted px-1 py-0.5 rounded">/</code> if there is no history.
      </p>
      <div class="flex flex-wrap items-center gap-4">
        <BackButton size="xs" />
        <BackButton size="sm" />
        <BackButton size="md" />
        <BackButton size="lg" />
        <BackButton icon="lucide:chevron-left" size="md" />
        <BackButton icon="lucide:undo-2" size="md" />
      </div>
    </DemoSection>

    <DemoSection title="Copy Button" :code="sourceCode">
      <p class="text-sm text-muted-foreground mb-4">
        A button that copies text to the clipboard and provides visual feedback.
      </p>
      <div class="flex flex-wrap items-center gap-4">
        <CopyButton text-to-copy="npm install vlite3" />
        <CopyButton text-to-copy="Hello World" variant="secondary" />
        <CopyButton text-to-copy="Icon only copy" as-icon rounded="full" variant="ghost" />
        <CopyButton
          text-to-copy="Custom text"
          default-text="Copy Link"
          copied-text="Link Copied!"
          variant="outline-primary" />
      </div>
    </DemoSection>
  </div>
</template>
