<script setup lang="ts">
import Button from '@/components/Button.vue'
import BackButton from '@/components/BackButton.vue'
import Clipboard from '@/components/Clipboard.vue'
import Beacon from '@/components/Beacon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ButtonDemo.vue?raw'
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-col space-y-2 pb-6 mb-8 border-b border-border/30">
      <h2 class="text-3xl font-bold tracking-tight text-foreground">Button</h2>
      <p class="text-base text-muted-foreground w-full max-w-[800px]">
        Triggers an event or action. They let users know what will happen next.
      </p>
    </div>

    <div class="flex flex-col w-full gap-2">
      <DemoSection title="Variants" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </DemoSection>

      <DemoSection title="Semantic Colors" :code="sourceCode">
        <div class="flex flex-col items-center justify-center gap-5 w-full">
          <div class="flex flex-wrap items-center justify-center gap-3">
            <Button variant="info">Info</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <Button variant="info-light">Info Light</Button>
            <Button variant="success-light">Success Light</Button>
            <Button variant="warning-light">Warning Light</Button>
            <Button variant="danger-light">Danger Light</Button>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline-info">Outline Info</Button>
            <Button variant="outline-success">Outline Success</Button>
            <Button variant="outline-warning">Outline Warning</Button>
            <Button variant="outline-danger">Outline Danger</Button>
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Sizes" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button size="sm">Small</Button>
          <Button size="md">Medium (Default)</Button>
          <Button size="lg">Large</Button>
        </div>
      </DemoSection>

      <DemoSection title="States & Shapes" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-3 w-full">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button rounded="full">Rounded Full</Button>
          <Button rounded="none">Rounded None</Button>
        </div>
      </DemoSection>

      <DemoSection title="With Icons" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-3 w-full">
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
        <div class="flex flex-col items-center justify-center gap-4 w-full">
          <p class="text-[13px] text-center text-muted-foreground w-full max-w-[500px] mb-2">
            A ghost, rounded icon button that navigates to the previous page. Falls back to
            <code class="text-xs bg-muted/60 px-1 py-0.5 rounded text-foreground font-mono">/</code> if there is no history.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3 w-full">
            <BackButton size="xs" />
            <BackButton size="sm" />
            <BackButton size="md" />
            <BackButton size="lg" />
            <BackButton icon="lucide:chevron-left" size="md" />
            <BackButton icon="lucide:undo-2" size="md" />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Clipboard" :code="sourceCode">
        <div class="flex flex-col items-center justify-center gap-4 w-full">
          <p class="text-[13px] text-center text-muted-foreground w-full max-w-[500px] mb-2">
            A button that copies text to the clipboard and provides visual feedback.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3 w-full">
            <Clipboard text-to-copy="npm install vlite3" />
            <Clipboard text-to-copy="Hello World" variant="secondary" />
            <Clipboard text-to-copy="Icon only copy" as-icon rounded="full" variant="ghost" />
            <Clipboard
              text-to-copy="Custom text"
              default-text="Copy Link"
              copied-text="Link Copied!"
              variant="outline-primary" />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="With Beacons" :code="sourceCode">
        <div class="flex flex-col items-center justify-center gap-4 w-full">
          <p class="text-[13px] text-center text-muted-foreground w-full max-w-[500px] mb-2">
            Use the <strong>Beacon</strong> component to indicate new notifications or status updates on buttons.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-6 w-full mt-2">
            <div class="relative inline-flex">
              <Button icon="lucide:bell" variant="outline" rounded="full" />
              <Beacon variant="danger" class="absolute top-0 right-0" />
            </div>
            
            <div class="relative inline-flex">
              <Button icon="lucide:mail" variant="ghost" />
              <Beacon variant="primary" size="sm" class="absolute top-1.5 right-2" />
            </div>

            <Button>
              Updates
              <Beacon variant="success" class="ml-2" />
            </Button>
          </div>
        </div>
      </DemoSection>
    </div>
  </div>
</template>
