<script setup lang="ts">
import { AppShell } from '@/components/AppShell'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './AppShellDemo.vue?raw'
import { ref } from 'vue'

// Mock Items
const menuItems: SidebarMenuItemSchema[] = [
  {
    label: 'Dashboard',
    icon: 'lucide:layout-dashboard',
    to: '/dashboard',
    badge: 'New',
    badgeClass: 'bg-primary/10 text-primary',
  },
  {
    label: 'Analytics',
    icon: 'lucide:bar-chart-3',
    children: [
      { label: 'Overview', to: '/analytics/overview' },
      { label: 'Performance', to: '/analytics/performance' },
      {
        label: 'Real-time',
        to: '/analytics/realtime',
        badge: 'Live',
        badgeClass: 'bg-green-100 text-green-700',
      },
    ],
  },
  {
    label: 'Projects',
    icon: 'lucide:folder',
    children: [
      {
        label: 'Active Projects',
        children: [{ label: 'Mobile App', to: '/projects/app' }],
      },
    ],
  },
  {
    label: 'Settings',
    icon: 'lucide:settings',
    children: [
      { label: 'Account', to: '/settings/account' },
      { label: 'Billing', to: '/settings/billing' },
    ],
  },
]

const isSidebarCompact = ref(false)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">App Shell</h2>
      <p class="text-gray-500">
        The master orchestrator for complex application layouts (sidebars, dashboards, layout-tabs).
      </p>
    </div>

    <DemoSection title="Dashboard Layout (Floating Panels)" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        The <code>dashboard</code> layout mode provides beautiful floating panels with distinct
        backgrounds, automatically adjusting to flush components on mobile devices.
      </p>
      <div
        class="h-[600px] relative z-0 flex flex-col w-full bg-body rounded-lg overflow-hidden border">
        <AppShell
          variant="sidebar"
          layout-mode="dashboard"
          :class="isSidebarCompact ? 'w-22' : 'w-64'">
          <template #sidebar-header>
            <div
              class="font-bold text-xl flex items-center gap-2"
              :class="isSidebarCompact ? ' justify-center  w-full' : ''">
              <div class="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                V
              </div>
              <span :class="isSidebarCompact ? 'md:hidden' : ''"> Vlite3 </span>
            </div>
          </template>

          <template #sidebar>
            <SidebarMenu :items="menuItems" class="px-2" :compact="isSidebarCompact" />
          </template>

          <template #sidebar-footer>
            <div class="px-4 py-2 opacity-50 text-xs text-center border-t border-border mt-auto">
              v0.9.1
            </div>
          </template>

          <template #header="{ toggle, pageTitle }">
            <div class="h-16 flex items-center justify-between px-6 w-full gap-4">
              <div class="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:menu"
                  class="md:hidden -ml-2 text-muted-foreground hover:text-foreground"
                  @click="toggle" />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:panel-left-open"
                  class="max-md:hidden -ml-2 text-muted-foreground hover:text-foreground"
                  @click="
                    () => {
                      isSidebarCompact = !isSidebarCompact
                    }
                  " />
                <div class="font-semibold text-lg flex items-center gap-2">
                  <Icon icon="lucide:layout" class="w-5 h-5 text-gray-400" />
                  {{ pageTitle || 'Overview' }}
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Input
                  placeholder="Search..."
                  icon="lucide:search"
                  size="sm"
                  class="bg-muted hidden lg:flex w-64 border-none shadow-none focus-visible:ring-1 focus-visible:ring-border" />
                <Avatar
                  size="sm"
                  fallback="SA"
                  class="bg-primary/10 text-primary ml-2 cursor-pointer border border-primary/20" />
              </div>
            </div>
          </template>

          <template #main>
            <div class="p-6 h-full flex flex-col gap-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="bg-muted/30 p-6 rounded-xl border border-border/50 flex flex-col gap-2">
                  <div class="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Metrics {{ i }}
                  </div>
                  <div class="text-2xl font-bold font-mono">1,024</div>
                </div>
              </div>
              <div
                class="flex-1 bg-muted/20 border border-border/50 rounded-xl flex items-center justify-center min-h-[200px]">
                <div class="text-center text-muted-foreground flex flex-col items-center gap-3">
                  <Icon icon="lucide:bar-chart-2" class="w-10 h-10 opacity-20" />
                  <span>Main content area</span>
                </div>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>

    <DemoSection title="Dock Layout Mode (Minimal Vertical)" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        Using <code>layout-mode="dock"</code> to render a compact floating sidebar that aligns
        neatly in the center of the vertical axis.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[500px]">
        <AppShell
          variant="sidebar"
          layout-mode="dock"
          :compact="true"
          class="w-16"
          mobileBreakpoint="md">
          <template #sidebar-header>
            <div
              class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold mt-1">
              V
            </div>
          </template>

          <template #sidebar>
            <SidebarMenu
              :items="menuItems"
              :compact="true"
              :show-tooltip="true"
              render-mode="popover" />
          </template>

          <template #sidebar-footer>
            <Avatar size="xs" fallback="JD" class="bg-primary/20 text-primary mb-1 text-xs" />
          </template>

          <template #header="{ toggle, pageTitle }">
            <div class="h-12 border-b bg-white flex items-center px-4 w-full justify-between">
              <div class="flex items-center gap-2">
                <button class="md:hidden mr-2" @click="toggle">
                  <Icon icon="lucide:menu" class="w-5 h-5 text-gray-500" />
                </button>
                <span class="font-semibold text-sm">{{ pageTitle || 'Settings' }}</span>
              </div>
              <div class="flex gap-2">
                <Button size="xs" variant="ghost" rounded="full" icon="lucide:more-vertical" />
              </div>
            </div>
          </template>

          <template #main>
            <div
              class="p-6 h-full font-mono text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg m-4 flex flex-col justify-center items-center">
              Dock Content Container
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>

    <DemoSection title="Nested Menus as Layout Tabs" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        When using <code>renderNestedTabs="true"</code>, clicking a primary Sidebar navigation item
        that has children creates a tab bar at the top of the <code>main</code> slot layout
        dynamically.
      </p>
      <div class="border rounded-lg overflow-hidden h-[400px] relative z-0 flex flex-col w-full">
        <AppShell
          variant="sidebar"
          layout-mode="classic"
          class="bg-white border-r"
          renderNestedTabs>
          <template #header="{ toggle }">
            <div
              class="h-14 border-b bg-white flex items-center justify-between px-6 w-full shadow-sm">
              <div class="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:menu"
                  class="md:hidden -ml-2"
                  @click="toggle" />
                <div class="font-bold text-lg flex items-center gap-2">TabApp Dynamic Tabs</div>
              </div>
            </div>
          </template>

          <template #sidebar>
            <SidebarMenu :items="menuItems" :default-expanded="['Analytics']" />
          </template>

          <template #main>
            <div class="p-6 h-full bg-gray-50 flex flex-col items-center justify-center">
              <div class="text-4xl text-gray-400 mb-4">👆</div>
              <p class="text-gray-500 text-center max-w-sm">
                Clicking on "Analytics", "Projects", or "Settings" routing will generate tabs
                automatically above this area!
              </p>
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>
  </div>
</template>
