<script setup lang="ts">
import { ref } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidePanelScrollable.vue?raw'

const showPanel = ref(false)
</script>

<template>
  <DemoSection title="Long / Scrollable Content" :code="sourceCode">
    <Button icon="lucide:scroll-text" @click="showPanel = true">Open Release Notes</Button>

    <SidePanel
      v-model:show="showPanel"
      title="Release Notes"
      description="What's new in v3.4.0"
      size="md">
      <div class="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <!-- Section 1 -->
        <div>
          <h4 class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">✦</span>
            New Features
          </h4>
          <ul class="space-y-2 pl-1">
            <li class="flex gap-2">
              <span class="text-emerald-500 shrink-0 mt-0.5">+</span>
              <span><strong class="text-foreground">SidePanel</strong> now supports a <code class="text-xs bg-muted/60 px-1 rounded font-mono">:body</code> prop for lazy-loaded content.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-emerald-500 shrink-0 mt-0.5">+</span>
              <span><strong class="text-foreground">Modal</strong> body scrolls independently — the header and footer stay fixed.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-emerald-500 shrink-0 mt-0.5">+</span>
              <span>New <strong class="text-foreground">ButtonGroup</strong> <code class="text-xs bg-muted/60 px-1 rounded font-mono">direction="vertical"</code> prop.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-emerald-500 shrink-0 mt-0.5">+</span>
              <span>Dark-mode scroll track colour now matches the surface token.</span>
            </li>
          </ul>
        </div>

        <!-- Section 2 -->
        <div>
          <h4 class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold">✎</span>
            Improvements
          </h4>
          <ul class="space-y-2 pl-1">
            <li class="flex gap-2">
              <span class="text-amber-500 shrink-0 mt-0.5">~</span>
              <span>Overlay opacity reduced from 0.32 → 0.20 for a lighter feel on large screens.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-amber-500 shrink-0 mt-0.5">~</span>
              <span>Escape-key handling now deregisters correctly when multiple overlays are stacked.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-amber-500 shrink-0 mt-0.5">~</span>
              <span><strong class="text-foreground">Form</strong> inside Modal automatically zeroes bottom padding to avoid double-spacer.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-amber-500 shrink-0 mt-0.5">~</span>
              <span>Transition duration tweaked: 80 ms open / 120 ms close for a snappier feel.</span>
            </li>
          </ul>
        </div>

        <!-- Section 3 -->
        <div>
          <h4 class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-500 text-[10px] font-bold">✕</span>
            Bug Fixes
          </h4>
          <ul class="space-y-2 pl-1">
            <li class="flex gap-2">
              <span class="text-red-400 shrink-0 mt-0.5">-</span>
              <span>Fixed <code class="text-xs bg-muted/60 px-1 rounded font-mono">document.body.overflow</code> not being restored when a panel unmounts while open.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-red-400 shrink-0 mt-0.5">-</span>
              <span>Fixed blink animation on modal close button triggering during submit.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-red-400 shrink-0 mt-0.5">-</span>
              <span>Corrected left-panel rounded corner class (was <code class="text-xs bg-muted/60 px-1 rounded font-mono">rounded-r-lg</code>, now consistent with right variant).</span>
            </li>
          </ul>
        </div>

        <!-- Section 4 -->
        <div>
          <h4 class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">▲</span>
            Breaking Changes
          </h4>
          <ul class="space-y-2 pl-1">
            <li class="flex gap-2">
              <span class="text-blue-400 shrink-0 mt-0.5">!</span>
              <span>The <code class="text-xs bg-muted/60 px-1 rounded font-mono">mobileMenuVariant</code> prop has been moved to <strong class="text-foreground">Navbar</strong> — it no longer exists on SidePanel directly.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-blue-400 shrink-0 mt-0.5">!</span>
              <span>The <code class="text-xs bg-muted/60 px-1 rounded font-mono">@onOpen</code> event payload was removed — it is now a bare event with no argument.</span>
            </li>
          </ul>
        </div>

        <!-- Footer note -->
        <p class="border-t border-border/40 pt-4 text-xs text-muted-foreground/70">
          Full changelog at
          <span class="text-primary underline underline-offset-2 cursor-pointer">github.com/vlite3/releases</span>
          · Released 14 Apr 2026
        </p>
      </div>

      <template #footer="{ close }">
        <Button class="w-full" @click="close">Got it</Button>
      </template>
    </SidePanel>
  </DemoSection>
</template>
