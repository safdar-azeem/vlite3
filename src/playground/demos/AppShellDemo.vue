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

    <!-- Sidebar First Layout -->
    <DemoSection title="Sidebar-First Layout (Standard)" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        The <code>sidebar-first</code> layout mode is the default and stretches the sidebar down the
        entire vertical axis. The header and main content reside next to it. Perfect for most admin
        interfaces.
      </p>
      <div
        class="h-[600px] relative z-0 flex flex-col w-full bg-body rounded-lg overflow-hidden border shadow-sm">
        <AppShell variant="sidebar" layout-mode="sidebar-first" class="w-64">
          <template #sidebar-header>
            <div class="font-bold text-lg flex items-center gap-3 px-2 py-1">
              <div
                class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-inner">
                <Icon icon="lucide:boxes" class="w-5 h-5" />
              </div>
              <span class="tracking-tight">Acme Corp</span>
            </div>
          </template>

          <template #sidebar>
            <SidebarMenu :items="menuItems" class="px-3 py-2" />
          </template>

          <template #sidebar-footer>
            <div
              class="p-4 bg-muted/20 border-t border-border mt-auto flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <Avatar size="sm" fallback="JD" class="bg-blue-100 text-blue-700 font-medium" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">Jane Doe</p>
                <p class="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
              <Icon icon="lucide:chevrons-up-down" class="w-4 h-4 text-muted-foreground" />
            </div>
          </template>

          <template #header="{ toggle, pageTitle }">
            <div
              class="h-14 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6 w-full gap-4 sticky top-0 z-10 shadow-sm">
              <div class="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:menu"
                  class="md:hidden -ml-2 text-muted-foreground hover:text-foreground"
                  @click="toggle" />
                <div class="font-semibold text-sm flex items-center gap-2">
                  {{ pageTitle || 'Overview' }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:bell"
                  class="text-muted-foreground rounded-full h-8 w-8 p-0" />
              </div>
            </div>
          </template>

          <template #main>
            <div class="p-6 h-full flex flex-col gap-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-24 rounded-xl border border-border bg-card shadow-sm p-4 flex flex-col justify-center">
                  <div class="text-sm font-medium text-muted-foreground">Stat {{ i }}</div>
                  <div class="text-2xl font-bold mt-1">{{ 100 * i }}</div>
                </div>
              </div>
              <div
                class="flex-1 border-2 border-dashed border-border/60 rounded-xl flex items-center justify-center bg-muted/5">
                <p class="text-muted-foreground text-sm flex items-center gap-2">
                  <Icon icon="lucide:layout-template" class="w-4 h-4" />
                  Main workspace content
                </p>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>

    <!-- Dashboard Layout -->
    <DemoSection title="Dashboard Layout (Floating Panels)" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        The <code>dashboard</code> layout mode provides beautiful floating panels with distinct
        backgrounds, automatically adjusting to flush components on mobile devices.
      </p>
      <div
        class="h-[600px] relative z-0 flex flex-col w-full bg-body rounded-lg overflow-hidden border shadow-sm">
        <AppShell
          variant="sidebar"
          layout-mode="dashboard"
          :class="isSidebarCompact ? 'w-22' : 'w-64'">
          <template #sidebar-header>
            <div
              class="font-bold text-xl flex items-center gap-2"
              :class="isSidebarCompact ? ' justify-center w-full' : ''">
              <div class="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                V
              </div>
              <span :class="isSidebarCompact ? 'hidden' : ''" class="tracking-tight">Vlite3</span>
            </div>
          </template>

          <template #sidebar>
            <SidebarMenu :items="menuItems" class="px-2" :compact="isSidebarCompact" />
          </template>

          <template #sidebar-footer>
            <div
              class="px-4 py-2 opacity-50 text-xs text-center border-t border-border mt-auto font-mono">
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
                <div class="font-semibold text-lg flex items-center gap-2 text-foreground/90">
                  <Icon icon="lucide:layout" class="w-5 h-5 text-gray-400" />
                  {{ pageTitle || 'Overview' }}
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Input
                  placeholder="Search..."
                  icon="lucide:search"
                  size="sm"
                  class="bg-muted hidden lg:flex w-64 border-none shadow-none focus-visible:ring-1 focus-visible:ring-border rounded-full" />
                <Avatar
                  size="sm"
                  fallback="SA"
                  class="bg-primary/10 text-primary ml-2 cursor-pointer border border-primary/20 hover:bg-primary/20 transition-colors" />
              </div>
            </div>
          </template>

          <template #main>
            <div class="p-6 h-full flex flex-col gap-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="bg-white p-6 rounded-xl border border-border/50 flex flex-col gap-2 shadow-sm transition-transform hover:-translate-y-1 duration-200">
                  <div class="flex items-center justify-between text-muted-foreground">
                    <span class="text-xs font-medium uppercase tracking-wider"
                      >Metrics {{ i }}</span
                    >
                    <Icon icon="lucide:activity" class="w-4 h-4 opacity-50" />
                  </div>
                  <div class="text-3xl font-bold font-mono tracking-tighter mt-2">1,024</div>
                  <div class="text-xs text-green-500 font-medium flex items-center gap-1 mt-1">
                    <Icon icon="lucide:trending-up" class="w-3 h-3" />
                    +12% from last month
                  </div>
                </div>
              </div>
              <div
                class="flex-1 bg-white border border-border/50 shadow-sm rounded-xl flex items-center justify-center min-h-[200px]">
                <div class="text-center text-muted-foreground flex flex-col items-center gap-3">
                  <div
                    class="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                    <Icon icon="lucide:bar-chart-2" class="w-8 h-8 opacity-40 text-primary" />
                  </div>
                  <span class="font-medium text-lg text-foreground/70">Main content area</span>
                  <span class="text-sm">This panel floats within the dashboard space</span>
                </div>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>

    <!-- Classic Header Layout -->
    <DemoSection title="Classic Layout (Top Navigation)" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        Using <code>variant="header"</code> with <code>layout-mode="classic"</code> renders a top
        navigation bar instead of a sidebar. This is perfect for consumer-facing apps or less
        complex admin tools.
      </p>
      <div
        class="border rounded-lg overflow-hidden flex flex-col h-[500px] relative z-0 bg-body shadow-sm">
        <AppShell
          variant="header"
          layout-mode="classic"
          class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
          <template #mobile-trigger="{ toggle }">
            <div class="flex items-center gap-4 px-2">
              <div
                class="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                V
              </div>
              <button
                class="md:hidden flex items-center text-gray-500 hover:text-gray-900 transition-colors p-1"
                @click="toggle">
                <Icon icon="lucide:menu" class="w-6 h-6" />
              </button>
            </div>
          </template>

          <template #left>
            <div
              class="max-md:hidden flex items-center gap-3 pr-6 border-r border-border/50 text-sm font-semibold h-6">
              <div
                class="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-sm">
                V
              </div>
              <span>Platform</span>
            </div>
          </template>

          <template #center>
            <div class="flex max-md:flex-col items-center gap-1 md:px-4 py-2 w-full">
              <Button
                variant="ghost"
                size="sm"
                class="max-md:w-full justify-start max-md:text-left bg-muted/50 font-medium text-foreground"
                >Overview</Button
              >
              <Button
                variant="ghost"
                size="sm"
                class="max-md:w-full justify-start max-md:text-left text-muted-foreground hover:text-foreground"
                >Customers</Button
              >
              <Button
                variant="ghost"
                size="sm"
                class="max-md:w-full justify-start max-md:text-left text-muted-foreground hover:text-foreground"
                >Settings</Button
              >
            </div>
          </template>

          <template #right>
            <div class="flex items-center gap-3 px-2">
              <Input
                placeholder="Search..."
                icon="lucide:search"
                size="sm"
                class="bg-muted hidden lg:flex w-48 border-none shadow-none focus-visible:ring-1 focus-visible:ring-border rounded-full h-8" />
              <Button
                size="sm"
                variant="outline"
                class="hidden md:flex rounded-full px-4 h-8 text-xs font-medium border-border/70"
                >Upgrade</Button
              >
              <Avatar
                size="sm"
                fallback="U"
                class="bg-primary/10 text-primary cursor-pointer border border-primary/20 hover:bg-primary/20 transition-colors" />
            </div>
          </template>

          <template #main>
            <div class="h-full bg-gray-50/50 flex flex-col p-6 w-full max-w-5xl mx-auto space-y-6">
              <div class="flex justify-between items-center">
                <div>
                  <h1 class="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
                  <p class="text-muted-foreground text-sm mt-1">
                    Here's what's happening with your store today.
                  </p>
                </div>
                <Button class="rounded-full shadow-sm">
                  <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              </div>
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-32 rounded-xl bg-white border border-border/50 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between text-muted-foreground">
                    <span class="text-sm font-medium">Metric {{ i }}</span>
                    <Icon icon="lucide:arrow-up-right" class="w-4 h-4 text-green-500" />
                  </div>
                  <div class="text-3xl font-bold tracking-tight">$45,231</div>
                </div>
              </div>
              <div
                class="flex-1 bg-white border border-border/50 shadow-sm rounded-xl min-h-[300px] flex items-center justify-center">
                <div class="text-center">
                  <div
                    class="mx-auto w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                    <Icon icon="lucide:inbox" class="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 class="text-lg font-medium">No recent activity</h3>
                  <p class="text-sm text-muted-foreground mt-1 max-w-sm">
                    When you have new data, it will appear here in detailed charts.
                  </p>
                </div>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>

    <!-- Dock Layout -->
    <DemoSection title="Dock Layout Mode (Minimal Vertical)" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        Using <code>layout-mode="dock"</code> to render a compact floating sidebar that aligns
        neatly in the center of the vertical axis.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[500px] shadow-sm">
        <AppShell variant="sidebar" layout-mode="dock" :compact="true" mobileBreakpoint="md">
          <template #sidebar-header>
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold mt-2 shadow-sm">
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
            <Avatar
              size="sm"
              fallback="JD"
              class="bg-indigo-100 text-indigo-700 mb-2 border-2 border-white shadow-sm ring-1 ring-black/5" />
          </template>

          <template #header="{ toggle, pageTitle }">
            <div
              class="h-14 border-b bg-white flex items-center px-6 w-full justify-between shadow-sm/50">
              <div class="flex items-center gap-3">
                <button
                  class="md:hidden mr-2 p-1.5 rounded-md hover:bg-muted text-gray-500 transition-colors"
                  @click="toggle">
                  <Icon icon="lucide:menu" class="w-5 h-5" />
                </button>
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                  <span class="font-semibold text-base">{{ pageTitle || 'Settings' }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  rounded="full"
                  icon="lucide:more-vertical"
                  class="text-muted-foreground" />
              </div>
            </div>
          </template>

          <template #main>
            <div class="p-8 h-full font-sans flex flex-col">
              <div class="w-full max-w-2xl mx-auto space-y-6">
                <div>
                  <h2 class="text-xl font-semibold">General Options</h2>
                  <p class="text-sm text-muted-foreground mt-1">
                    Configure your workspace preferences and notifications.
                  </p>
                </div>
                <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
                  <div class="p-4 border-b flex justify-between items-center">
                    <div>
                      <div class="font-medium text-sm">Theme Preferences</div>
                      <div class="text-xs text-muted-foreground mt-0.5">
                        Choose your preferred interface theme.
                      </div>
                    </div>
                    <Button size="sm" variant="outline">System</Button>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <div>
                      <div class="font-medium text-sm">Email Notifications</div>
                      <div class="text-xs text-muted-foreground mt-0.5">Receive daily digests.</div>
                    </div>
                    <div
                      class="w-10 h-6 bg-indigo-500 rounded-full relative cursor-pointer shadow-inner">
                      <div
                        class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>

    <!-- Nested Menus -->
    <DemoSection title="Nested Menus as Layout Tabs" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        When using <code>renderNestedTabs="true"</code>, clicking a primary Sidebar navigation item
        that has children creates a tab bar at the top of the <code>main</code> slot layout
        dynamically.
      </p>
      <div
        class="border rounded-lg overflow-hidden h-[500px] relative z-0 flex flex-col w-full shadow-sm">
        <AppShell
          variant="sidebar"
          layout-mode="classic"
          class="bg-white border-r"
          renderNestedTabs>
          <template #sidebar-header>
            <div class="font-bold text-lg flex items-center gap-2 px-2 py-3 border-b">
              <div
                class="w-7 h-7 rounded-md bg-teal-500 text-white flex items-center justify-center">
                <Icon icon="lucide:hexagon" class="w-4 h-4" />
              </div>
              <span class="tracking-tight">TabFlow UI</span>
            </div>
          </template>

          <template #header="{ toggle }">
            <div
              class="h-14 border-b bg-white flex items-center justify-between px-6 w-full shadow-sm/30 sticky top-0 z-10">
              <div class="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:menu"
                  class="md:hidden -ml-2 hover:bg-muted/50"
                  @click="toggle" />
                <div class="font-semibold text-sm flex items-center gap-2 text-foreground/80">
                  Application
                </div>
              </div>
              <Avatar
                size="xs"
                fallback="A"
                class="bg-teal-100 text-teal-700 font-bold ml-2 cursor-pointer border border-teal-200" />
            </div>
          </template>

          <template #sidebar>
            <SidebarMenu :items="menuItems" :default-expanded="['Analytics']" class="p-2" />
          </template>

          <template #main>
            <div
              class="p-8 h-full bg-slate-50/50 flex flex-col items-center justify-center border-l">
              <div
                class="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mb-6 rotate-3">
                <Icon icon="lucide:panel-top" class="w-8 h-8 text-teal-500" />
              </div>
              <h3 class="text-xl font-semibold text-slate-800 mb-2">Dynamic Layout Tabs</h3>
              <p class="text-slate-500 text-center max-w-sm text-sm leading-relaxed">
                Notice the tab bar at the very top of this view? Clicking on "Analytics",
                "Projects", or "Settings" in the sidebar keeps the parent active and shows siblings
                as horizontal tabs!
              </p>
              <div class="mt-8 flex gap-3">
                <div
                  class="px-4 py-2 bg-white rounded-lg border shadow-sm text-xs font-medium text-slate-600 flex items-center gap-2">
                  <Icon icon="lucide:arrow-left" class="w-3 h-3" /> Try clicking Analytics
                </div>
              </div>
            </div>
          </template>
        </AppShell>
      </div>
    </DemoSection>
  </div>
</template>
