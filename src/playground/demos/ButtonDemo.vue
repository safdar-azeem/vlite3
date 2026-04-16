<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import BackButton from '@/components/BackButton.vue'
import Clipboard from '@/components/Clipboard.vue'
import Beacon from '@/components/Beacon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ButtonDemo.vue?raw'

const isLoading = ref(false)
const simulateLoad = () => {
  isLoading.value = true
  setTimeout(() => (isLoading.value = false), 2000)
}
</script>

<template>
  <div class="flex flex-col w-full space-y-2 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col space-y-2 pb-6 mb-6 border-b border-border/30">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">Button</span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Button</h2>
      <p class="text-lg text-muted-foreground max-w-[70ch]">
        A versatile, accessible button component with a comprehensive set of variants, sizes, states,
        icon support, and ripple effects. The building block of every interactive UI.
      </p>
    </div>

    <!-- ── Variants ───────────────────────────────────────────── -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-3 w-full">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </DemoSection>

    <!-- ── Semantic Colors ─────────────────────────────────────── -->
    <DemoSection title="Semantic Colors" :code="sourceCode">
      <div class="flex flex-col items-center gap-5 w-full">
        <!-- Solid -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <Button variant="info">Info</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <!-- Light tints -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <Button variant="info-light">Info Light</Button>
          <Button variant="success-light">Success Light</Button>
          <Button variant="warning-light">Warning Light</Button>
          <Button variant="danger-light">Danger Light</Button>
        </div>
        <!-- Outlined semantic -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline-info">Outline Info</Button>
          <Button variant="outline-success">Outline Success</Button>
          <Button variant="outline-warning">Outline Warning</Button>
          <Button variant="outline-danger">Outline Danger</Button>
        </div>
      </div>
    </DemoSection>

    <!-- ── Sizes ──────────────────────────────────────────────── -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-wrap items-end justify-center gap-3 w-full">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
    </DemoSection>

    <!-- ── Shapes (Rounded) ───────────────────────────────────── -->
    <DemoSection title="Shapes" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-3 w-full">
        <Button rounded="none">None</Button>
        <Button rounded="sm">Small</Button>
        <Button rounded="md">Medium</Button>
        <Button rounded="lg">Large</Button>
        <Button rounded="xl">XL</Button>
        <Button rounded="2xl">2XL</Button>
        <Button rounded="full">Full</Button>
      </div>
    </DemoSection>

    <!-- ── States ─────────────────────────────────────────────── -->
    <DemoSection title="States" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-4 w-full">
        <Button :loading="isLoading" @click="simulateLoad">
          {{ isLoading ? 'Saving…' : 'Click to Load' }}
        </Button>
        <Button loading>Always Loading</Button>
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled icon="lucide:lock">Locked</Button>
      </div>
    </DemoSection>

    <!-- ── With Icons ─────────────────────────────────────────── -->
    <DemoSection title="With Icons" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-3 w-full">
        <!-- Left icon -->
        <Button icon="lucide:plus">Add Item</Button>
        <!-- Right icon -->
        <Button icon-right="lucide:arrow-right" variant="outline">Continue</Button>
        <!-- Both sides -->
        <Button icon="lucide:download" icon-right="lucide:chevron-down" variant="secondary">
          Export
        </Button>
        <!-- Icon-only (no label) — square -->
        <Button icon="lucide:trash-2" variant="danger-light" />
        <Button icon="lucide:settings" variant="ghost" />
        <Button icon="lucide:heart" variant="outline-danger" rounded="full" />
        <!-- Image icon -->
        <Button
          variant="outline"
          icon="https://cdn.prod.website-files.com/666ad77562dfabab1eb27f63/6747850440da96e6bc2d78b3_friso_ai3.webp"
          text="Open AI"
        />
      </div>
    </DemoSection>

    <!-- ── Back Button ────────────────────────────────────────── -->
    <DemoSection title="Back Button" :code="sourceCode">
      <div class="flex flex-col items-center gap-4 w-full">
        <p class="text-sm text-center text-muted-foreground max-w-[480px]">
          A ghost icon button that navigates to the previous page using
          <code class="text-xs bg-muted px-1 py-0.5 rounded">router.back()</code> and falls back to
          <code class="text-xs bg-muted px-1 py-0.5 rounded">/</code> when no history exists.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <BackButton size="xs" />
          <BackButton size="sm" />
          <BackButton size="md" />
          <BackButton size="lg" />
          <BackButton icon="lucide:chevron-left" size="md" />
          <BackButton icon="lucide:undo-2" size="md" />
        </div>
      </div>
    </DemoSection>

    <!-- ── Clipboard ──────────────────────────────────────────── -->
    <DemoSection title="Clipboard" :code="sourceCode">
      <div class="flex flex-col items-center gap-4 w-full">
        <p class="text-sm text-center text-muted-foreground max-w-[480px]">
          Copies text to the clipboard and shows a visual "Copied!" confirmation. Handy for install
          commands, share links, or API keys.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <Clipboard text-to-copy="npm install vlite3" />
          <Clipboard text-to-copy="Hello World" variant="secondary" />
          <Clipboard text-to-copy="Icon only copy" as-icon rounded="full" variant="ghost" />
          <Clipboard
            text-to-copy="https://vlite3.dev"
            default-text="Copy Link"
            copied-text="Link Copied!"
            variant="outline-primary"
          />
        </div>
      </div>
    </DemoSection>

    <!-- ── Button + Beacon ────────────────────────────────────── -->
    <DemoSection title="With Beacons" :code="sourceCode">
      <div class="flex flex-col items-center gap-4 w-full">
        <p class="text-sm text-center text-muted-foreground max-w-[480px]">
          Use the <strong>Beacon</strong> component to draw attention to buttons — for notifications,
          new features, or live status indicators.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 mt-2">
          <div class="relative inline-flex">
            <Button icon="lucide:bell" variant="outline" rounded="full" />
            <Beacon variant="danger" class="absolute -top-0.5 -right-0.5" />
          </div>

          <div class="relative inline-flex">
            <Button icon="lucide:mail" variant="ghost" />
            <Beacon variant="primary" size="sm" class="absolute top-1.5 right-2" />
          </div>

          <div class="relative inline-flex">
            <Button icon="lucide:message-square" variant="secondary">
              Messages
            </Button>
            <Beacon variant="success" class="absolute -top-1 -right-1" />
          </div>

          <Button variant="outline">
            What's New
            <Beacon variant="warning" class="ml-1" />
          </Button>
        </div>
      </div>
    </DemoSection>

    <!-- ── Real-world Usage ───────────────────────────────────── -->
    <DemoSection title="Real-world Patterns" :code="sourceCode">
      <div class="flex flex-col gap-6 w-full max-w-2xl">
        <!-- Toolbar row -->
        <div class="flex flex-wrap justify-between items-center gap-3 p-4 rounded-xl border border-border bg-muted/20">
          <div class="flex gap-2">
            <Button variant="ghost" icon="lucide:bold" size="sm" />
            <Button variant="ghost" icon="lucide:italic" size="sm" />
            <Button variant="ghost" icon="lucide:underline" size="sm" />
            <span class="w-px h-6 bg-border self-center mx-1"></span>
            <Button variant="ghost" icon="lucide:link" size="sm" />
            <Button variant="ghost" icon="lucide:image" size="sm" />
          </div>
          <Button variant="primary" size="sm" icon="lucide:check">Publish</Button>
        </div>

        <!-- Action group -->
        <div class="flex flex-wrap gap-3 p-4 rounded-xl border border-border bg-muted/20">
          <Button variant="outline" icon="lucide:share-2">Share</Button>
          <Button variant="outline" icon="lucide:pencil">Edit</Button>
          <Button variant="danger-light" icon="lucide:trash-2">Delete</Button>
          <Button variant="primary" icon="lucide:save" class="ml-auto">Save Changes</Button>
        </div>

        <!-- Confirm dialog actions -->
        <div class="flex justify-end gap-3 p-4 rounded-xl border border-border bg-muted/20">
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete Account</Button>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
