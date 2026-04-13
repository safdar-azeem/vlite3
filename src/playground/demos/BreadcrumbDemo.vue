<script setup lang="ts">
import { ref } from 'vue'
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb'
import type { BreadcrumbItemSchema } from '@/components/Breadcrumb'
import DemoSection from '../DemoSection.vue'
import sourceCode from './BreadcrumbDemo.vue?raw'

const basicItems: BreadcrumbItemSchema[] = [
  { label: 'Home', to: '/', icon: 'lucide:home' },
  { label: 'Components', to: '/button' },
  { label: 'Breadcrumb' },
]

const iconItems: BreadcrumbItemSchema[] = [
  { label: 'Home', to: '/', icon: 'lucide:home' },
  { label: 'Settings', icon: 'lucide:settings' },
  { label: 'Profile', icon: 'lucide:user' },
  { label: 'Security', icon: 'lucide:shield' },
]

const longItems: BreadcrumbItemSchema[] = [
  { label: 'Home', to: '/', icon: 'lucide:home' },
  { label: 'Documents' },
  { label: 'Projects' },
  { label: 'Web Development' },
  { label: 'Vue Components' },
  { label: 'Breadcrumb' },
]

const disabledItems: BreadcrumbItemSchema[] = [
  { label: 'Home', to: '/', icon: 'lucide:home' },
  { label: 'Archived', disabled: true },
  { label: 'Current Page' },
]

// ---- Event demo: wizard stepper (no routing needed) ----
const activeStep = ref(0)

const wizardSteps: BreadcrumbItemSchema[] = [
  { label: 'Account', icon: 'lucide:user' },
  { label: 'Profile', icon: 'lucide:pencil' },
  { label: 'Review', icon: 'lucide:check-circle' },
]

function onWizardClick({ index }: { item: BreadcrumbItemSchema; index: number }) {
  activeStep.value = index
}

// ---- Event demo: log all clicks (mixed routing + event) ----
const clickLog = ref<string[]>([])

function onItemClick({ item, index }: { item: BreadcrumbItemSchema; index: number }) {
  clickLog.value.unshift(`[${index}] ${item.label}${item.to ? ` → ${item.to}` : ''}`)
  if (clickLog.value.length > 5) clickLog.value.pop()
}
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Breadcrumb</h2>
      <p class="text-gray-500">
        Displays the path to the current resource using a hierarchy of links.
      </p>
    </div>

    <!-- Default -->
    <DemoSection title="Default" :code="sourceCode">
      <Breadcrumb :items="basicItems" />
    </DemoSection>

    <!-- item-click event: wizard stepper -->
    <DemoSection title="Event Click — Wizard Stepper" :code="sourceCode">
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Listen to <code class="text-xs bg-secondary px-1.5 py-0.5 rounded">@item-click</code> on
          any breadcrumb. Fires for every clickable item regardless of whether it has
          <code class="text-xs bg-secondary px-1.5 py-0.5 rounded">to</code> or
          <code class="text-xs bg-secondary px-1.5 py-0.5 rounded">href</code>. No extra flags
          needed.
        </p>

        <Breadcrumb :items="wizardSteps" variant="pills" @item-click="onWizardClick" />
        <br />
        activeStep:{{ activeStep }}
      </div>
    </DemoSection>

    <!-- item-click event: log all clicks including routed -->
    <DemoSection title="Event Click — Log All (with routing)" :code="sourceCode">
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          Items with <code class="text-xs bg-secondary px-1.5 py-0.5 rounded">to</code> still route
          normally. The event fires in addition — useful for analytics, breadcrumb state sync, etc.
        </p>
        <Breadcrumb :items="basicItems" @item-click="onItemClick" />
        <ul v-if="clickLog.length" class="text-xs text-muted-foreground space-y-0.5">
          <li v-for="(entry, i) in clickLog" :key="i">{{ entry }}</li>
        </ul>
      </div>
    </DemoSection>

    <!-- Variants -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="space-y-5">
        <div>
          <p class="text-sm text-muted-foreground mb-2">Default</p>
          <Breadcrumb :items="basicItems" variant="default" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Contained</p>
          <Breadcrumb :items="basicItems" variant="contained" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Pills</p>
          <Breadcrumb :items="basicItems" variant="pills" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Arrow</p>
          <Breadcrumb :items="basicItems" variant="arrow" />
        </div>
      </div>
    </DemoSection>

    <!-- Separators -->
    <DemoSection title="Separators" :code="sourceCode">
      <div class="space-y-4">
        <div>
          <p class="text-sm text-muted-foreground mb-2">Chevron (default)</p>
          <Breadcrumb :items="basicItems" separator="chevron" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Slash</p>
          <Breadcrumb :items="basicItems" separator="slash" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Dot</p>
          <Breadcrumb :items="basicItems" separator="dot" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Arrow</p>
          <Breadcrumb :items="basicItems" separator="arrow" />
        </div>
      </div>
    </DemoSection>

    <!-- Sizes -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="space-y-4">
        <div>
          <p class="text-sm text-muted-foreground mb-2">Small</p>
          <Breadcrumb :items="basicItems" size="sm" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Medium (default)</p>
          <Breadcrumb :items="basicItems" size="md" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Large</p>
          <Breadcrumb :items="basicItems" size="lg" />
        </div>
      </div>
    </DemoSection>

    <!-- With Icons -->
    <DemoSection title="With Icons" :code="sourceCode">
      <Breadcrumb :items="iconItems" />
    </DemoSection>

    <!-- Collapsed / maxItems -->
    <DemoSection title="Collapsed" :code="sourceCode">
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Long breadcrumbs auto-collapse when
          <code class="text-xs bg-secondary px-1.5 py-0.5 rounded">maxItems</code> is set. Click the
          ellipsis to expand.
        </p>
        <Breadcrumb :items="longItems" :max-items="3" />
      </div>
    </DemoSection>

    <!-- Disabled Item -->
    <DemoSection title="Disabled Item" :code="sourceCode">
      <Breadcrumb :items="disabledItems" />
    </DemoSection>

    <!-- Combined: Variant + Separator -->
    <DemoSection title="Combined" :code="sourceCode">
      <div class="space-y-5">
        <div>
          <p class="text-sm text-muted-foreground mb-2">Contained + Slash</p>
          <Breadcrumb :items="iconItems" variant="contained" separator="slash" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Pills + Dot (Large)</p>
          <Breadcrumb :items="iconItems" variant="pills" separator="dot" size="lg" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground mb-2">Arrow variant (Small)</p>
          <Breadcrumb :items="iconItems" variant="arrow" size="sm" />
        </div>
      </div>
    </DemoSection>

    <!-- Slot Usage -->
    <DemoSection title="Slot Usage" :code="sourceCode">
      <Breadcrumb>
        <BreadcrumbItem label="Home" to="/" icon="lucide:home" />
        <li class="breadcrumb-separator" aria-hidden="true"><span>›</span></li>
        <BreadcrumbItem label="Library" />
        <li class="breadcrumb-separator" aria-hidden="true"><span>›</span></li>
        <BreadcrumbItem label="Current" :is-current="true" />
      </Breadcrumb>
    </DemoSection>
  </div>
</template>
