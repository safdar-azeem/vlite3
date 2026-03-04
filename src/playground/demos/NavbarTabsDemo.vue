<script setup lang="ts">
import { NavbarTabs } from '@/components/Navbar'
import type { NavbarTabItem } from '@/components/Navbar'
import DemoSection from '../DemoSection.vue'
import sourceCode from './NavbarTabsDemo.vue?raw'

const settingsTabs: NavbarTabItem[] = [
  { label: 'General', to: '/settings/general', icon: 'lucide:settings' },
  { label: 'Profile', to: '/settings/profile', icon: 'lucide:user' },
  { label: 'Security', to: '/settings/security', icon: 'lucide:shield' },
  { label: 'Notifications', to: '/settings/notifications', icon: 'lucide:bell' },
  { label: 'Billing', to: '/settings/billing', icon: 'lucide:credit-card' },
  { label: 'Integrations', to: '/settings/integrations', icon: 'lucide:plug' },
  { label: 'API Keys', to: '/settings/api-keys', icon: 'lucide:key' },
  { label: 'Audit Log', to: '/settings/audit', icon: 'lucide:file-text' },
  { label: 'Webhooks', to: '/settings/webhooks', icon: 'lucide:webhook' },
  { label: 'Advanced', to: '/settings/advanced', icon: 'lucide:sliders' },
]

const projectTabs: NavbarTabItem[] = [
  { label: 'Overview', to: '/project/overview' },
  { label: 'Issues', to: '/project/issues' },
  { label: 'Pull Requests', to: '/project/prs' },
  { label: 'Actions', to: '/project/actions' },
  { label: 'Projects', to: '/project/boards' },
  { label: 'Wiki', to: '/project/wiki' },
  { label: 'Security', to: '/project/security' },
  { label: 'Insights', to: '/project/insights' },
  { label: 'Settings', to: '/project/settings' },
]

const simpleTabs: NavbarTabItem[] = [
  { label: 'All', to: '/items/all' },
  { label: 'Active', to: '/items/active' },
  { label: 'Archived', to: '/items/archived' },
  { label: 'Disabled', to: '/items/disabled', disabled: true },
]
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-1">
      <h2 class="text-2xl font-bold">NavbarTabs</h2>
      <p class="text-muted-foreground text-sm">
        Router-link driven tab navigation. Overflows horizontally with hidden scrollbar and
        fade-scroll indicators when tabs exceed available width.
      </p>
    </div>

    <!-- Line variant (default) — many tabs to trigger overflow -->
    <DemoSection title="Line Variant — Overflow Scroll" :code="sourceCode">
      <div class="border rounded-lg overflow-hidden bg-background">
        <div class="px-4 pt-2">
          <NavbarTabs :items="settingsTabs" variant="line" />
        </div>
        <div class="p-6 text-sm text-muted-foreground">Page content here.</div>
      </div>
    </DemoSection>

    <!-- Pill variant -->
    <DemoSection title="Pill Variant" :code="sourceCode">
      <div class="border rounded-lg overflow-hidden bg-background p-4 space-y-4">
        <NavbarTabs :items="simpleTabs" variant="pill" />
      </div>
    </DemoSection>

    <!-- Solid variant -->
    <DemoSection title="Solid Variant" :code="sourceCode">
      <div class="border rounded-lg overflow-hidden bg-background p-4">
        <NavbarTabs :items="simpleTabs" variant="solid" />
      </div>
    </DemoSection>

    <!-- Ghost variant -->
    <DemoSection title="Ghost Variant" :code="sourceCode">
      <div class="border rounded-lg overflow-hidden bg-background p-4">
        <NavbarTabs :items="simpleTabs" variant="ghost" />
      </div>
    </DemoSection>

    <!-- Sizes -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="border rounded-lg overflow-hidden bg-background p-4 space-y-4">
        <NavbarTabs :items="simpleTabs" variant="line" size="sm" />
        <NavbarTabs :items="simpleTabs" variant="line" size="md" />
        <NavbarTabs :items="simpleTabs" variant="line" size="lg" />
      </div>
    </DemoSection>

    <!-- With icons -->
    <DemoSection title="With Icons — Many Tabs (Overflow)" :code="sourceCode">
      <div class="border rounded-lg overflow-hidden bg-background">
        <div class="px-4 pt-2">
          <NavbarTabs :items="projectTabs" variant="line" size="md" />
        </div>
        <div class="p-6 text-sm text-muted-foreground">Project content area.</div>
      </div>
    </DemoSection>

    <!-- Constrained width to force overflow on small set -->
    <DemoSection title="Constrained Width (Force Overflow)" :code="sourceCode">
      <div class="border rounded-lg overflow-hidden bg-background w-72">
        <div class="px-2 pt-2">
          <NavbarTabs :items="settingsTabs" variant="line" size="sm" />
        </div>
        <div class="p-4 text-sm text-muted-foreground">Narrow container.</div>
      </div>
    </DemoSection>
  </div>
</template>
