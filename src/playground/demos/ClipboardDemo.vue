<script setup lang="ts">
import { ref } from 'vue'
import Clipboard from '@/components/Clipboard.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ClipboardDemo.vue?raw'

const apiKey = ref('sk-live-4xT9mNpQr2wZvL8kYj6bFcHdE3aUoGs')
const installCmd = ref('npm install vlite3')
const shareUrl = ref('https://vlite3.dev/components/clipboard')
const lastCopied = ref<string | null>(null)

const onCopy = (text: string) => {
  lastCopied.value = text
}
</script>

<template>
  <div class="flex flex-col w-full space-y-2 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col space-y-2 pb-6 mb-6 border-b border-border/30">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">Clipboard</span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Clipboard</h2>
      <p class="text-lg text-muted-foreground max-w-[70ch]">
        A button that copies any text to the clipboard and shows a brief "Copied!" confirmation.
        Fully customizable — icon-only, labeled, any variant or size, with event callbacks.
      </p>
    </div>

    <!-- ── Default ─────────────────────────────────────────────── -->
    <DemoSection title="Default" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <Clipboard text-to-copy="Hello from vlite3!" />
        <Clipboard text-to-copy="Hello from vlite3!" variant="primary" />
        <Clipboard text-to-copy="Hello from vlite3!" variant="secondary" />
        <Clipboard text-to-copy="Hello from vlite3!" variant="ghost" />
        <Clipboard text-to-copy="Hello from vlite3!" variant="outline-primary" />
      </div>
    </DemoSection>

    <!-- ── Icon Only ───────────────────────────────────────────── -->
    <DemoSection title="Icon Only" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <Clipboard text-to-copy="copied!" as-icon />
        <Clipboard text-to-copy="copied!" as-icon variant="primary" />
        <Clipboard text-to-copy="copied!" as-icon variant="ghost" rounded="md" />
        <Clipboard text-to-copy="copied!" as-icon variant="outline-primary" />
        <Clipboard text-to-copy="copied!" as-icon size="sm" variant="ghost" />
        <Clipboard text-to-copy="copied!" as-icon size="lg" variant="secondary" rounded="xl" />
      </div>
    </DemoSection>

    <!-- ── Sizes ──────────────────────────────────────────────── -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-wrap items-end justify-center gap-4">
        <Clipboard text-to-copy="xs size" size="xs" />
        <Clipboard text-to-copy="sm size" size="sm" />
        <Clipboard text-to-copy="md size" size="md" />
        <Clipboard text-to-copy="lg size" size="lg" />
        <Clipboard text-to-copy="xl size" size="xl" />
      </div>
    </DemoSection>

    <!-- ── Custom Labels & Icons ──────────────────────────────── -->
    <DemoSection title="Custom Labels & Icons" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <Clipboard
          text-to-copy="https://vlite3.dev"
          default-text="Copy Link"
          copied-text="Link Copied!"
          variant="outline-primary"
        />
        <Clipboard
          text-to-copy="npm install vlite3"
          default-text="Copy Install"
          copied-text="Done ✓"
          default-icon="lucide:package"
          copied-icon="lucide:circle-check"
          variant="primary"
        />
        <Clipboard
          text-to-copy="git clone https://github.com/vlite3/vlite3.git"
          default-text="Clone Repo"
          copied-text="Cloned!"
          default-icon="lucide:git-branch"
          copied-icon="lucide:check-circle-2"
          variant="secondary"
        />
      </div>
    </DemoSection>

    <!-- ── States ────────────────────────────────────────────── -->
    <DemoSection title="States" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <Clipboard text-to-copy="active" />
        <Clipboard text-to-copy="disabled" disabled />
        <Clipboard text-to-copy="disabled icon" disabled as-icon />
      </div>
    </DemoSection>

    <!-- ── With Event Callback ────────────────────────────────── -->
    <DemoSection title="With Event Callback" :code="sourceCode">
      <div class="flex flex-col items-center gap-5 w-full">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <Clipboard
            :text-to-copy="installCmd"
            default-text="Copy Command"
            variant="outline-primary"
            @copy="onCopy"
          />
          <Clipboard
            :text-to-copy="shareUrl"
            default-text="Copy URL"
            variant="outline"
            as-icon
            @copy="onCopy"
          />
          <Clipboard
            :text-to-copy="apiKey"
            default-text="Copy Key"
            variant="danger-light"
            default-icon="lucide:key"
            @copy="onCopy"
          />
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <p v-if="lastCopied" class="text-xs text-success font-medium px-3 py-1.5 bg-success/10 rounded-lg border border-success/20">
            ✓ Copied: <span class="font-mono">{{ lastCopied.length > 40 ? lastCopied.slice(0, 40) + '…' : lastCopied }}</span>
          </p>
        </Transition>
      </div>
    </DemoSection>

    <!-- ── Real-world Patterns ────────────────────────────────── -->
    <DemoSection title="Real-world Patterns" :code="sourceCode">
      <div class="flex flex-col gap-6 w-full max-w-2xl">

        <!-- Install command card -->
        <div class="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-foreground">Install via npm</span>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Terminal</span>
          </div>
          <div class="flex items-center gap-3 bg-background rounded-lg border border-border px-4 py-3">
            <span class="font-mono text-sm text-foreground flex-1 select-all">{{ installCmd }}</span>
            <Clipboard :text-to-copy="installCmd" as-icon size="sm" variant="ghost" rounded="md" />
          </div>
        </div>

        <!-- API Key card -->
        <div class="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-foreground">API Secret Key</span>
            <span class="text-xs text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded">Live</span>
          </div>
          <div class="flex items-center gap-3 bg-background rounded-lg border border-border px-4 py-3">
            <code class="font-mono text-sm text-muted-foreground flex-1 truncate">
              {{ apiKey.slice(0, 10) }}••••••••••••••••••••••••••
            </code>
            <Clipboard
              :text-to-copy="apiKey"
              as-icon
              size="sm"
              variant="ghost"
              rounded="md"
              default-icon="lucide:key"
              copied-icon="lucide:check"
            />
          </div>
          <p class="text-xs text-muted-foreground">
            Keep this key secret. Do not share it in public repositories.
          </p>
        </div>

        <!-- Share URL -->
        <div class="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
          <span class="text-sm font-semibold text-foreground">Share this page</span>
          <div class="flex items-center gap-2">
            <div class="flex-1 bg-background rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground truncate font-mono">
              {{ shareUrl }}
            </div>
            <Clipboard
              :text-to-copy="shareUrl"
              default-text="Copy"
              copied-text="Copied!"
              variant="primary"
              size="sm"
              rounded="lg"
            />
          </div>
        </div>

      </div>
    </DemoSection>
  </div>
</template>
