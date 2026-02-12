<script setup lang="ts">
import { Navbar, NavbarItem, NavbarGroup } from '@/components/Navbar'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import { SidebarMenuItemSchema } from '@/components/SidebarMenu'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'

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
    // Example of mixed mode: Force dropdown on this specific item if needed?
    renderMode: 'popover',
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
        children: [
          { label: 'Website Redesign', to: '/projects/website' },
          { label: 'Mobile App', to: '/projects/app' },
        ],
      },
      { label: 'Archived', to: '/projects/archived', disabled: true },
    ],
  },
  {
    label: 'Team',
    icon: 'lucide:users',
    children: [
      { label: 'Members', to: '/team/members' },
      { label: 'Permissions', to: '/team/permissions' },
    ],
  },
  {
    label: 'Documents',
    icon: 'lucide:file-text',
    // Example of simple action instead of route
    action: () => alert('Documents clicked!'),
  },
  {
    label: 'Settings',
    icon: 'lucide:settings',
    children: [
      { label: 'Account', to: '/settings/account' },
      { label: 'Billing', to: '/settings/billing' },
      { label: 'Notifications', to: '/settings/notifications' },
    ],
  },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Navbar</h2>
      <p class="text-gray-500">Navigation headers and sidebars.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Top Navigation</h3>
      <div class="border rounded-lg overflow-hidden bg-gray-100 h-[200px] relative">
        <Navbar position="absolute" class="w-full bg-white border-b">
          <template #logo>
            <div class="flex items-center gap-2 font-bold text-lg">Builto</div>
          </template>
          <template #left>
            <NavbarGroup>
              <NavbarItem label="Home" active />
              <NavbarItem label="Features" />
            </NavbarGroup>
          </template>
          <template #right>
            <Button size="sm">Get Started</Button>
          </template>
        </Navbar>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Sidebar Navigation</h3>
      <div class="border rounded-lg overflow-hidden bg-gray-50 sm:h-[700px] flex max-sm:flex-col">
        <Navbar
          variant="sidebar"
          mobileBreakpoint="sm"
          position="relative"
          class="bg-white border-r h-full flex flex-col">
          <template #logo>
            <div class="flex items-center gap-2 font-bold">
              <Icon icon="lucide:box" /> Dashboard
            </div>
          </template>
          <template #default>
            <div>
              <SidebarMenu :items="menuItems" :allow-multiple="true" />
            </div>
          </template>
          <template #right>
            <div>
              <Button
                variant="ghost"
                class="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
                icon="lucide:log-out">
                Logout
              </Button>
            </div>
          </template>
        </Navbar>
        <div class="p-8 text-gray-400">Main Content</div>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Configurable Mobile Breakpoint (Large 'lg')</h3>
      <p class="text-sm text-gray-500">
        This navbar switches to mobile mode (hamburger menu) on screens smaller than 'lg' (1024px).
        Try resizing the window to see it switch earlier than the default 'md'.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-100 h-[200px] relative">
        <Navbar position="absolute" mobile-breakpoint="lg" class="w-full bg-white border-b">
          <template #logo>
            <div class="flex items-center gap-2 font-bold text-lg">Large Breakpoint</div>
          </template>
          <template #left>
            <NavbarGroup>
              <NavbarItem label="Menu 1" />
              <NavbarItem label="Menu 2" />
              <NavbarItem label="Menu 3" />
            </NavbarGroup>
          </template>
          <template #right>
            <Button size="sm">Action</Button>
          </template>
        </Navbar>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Configurable Mobile Breakpoint (Small 'sm')</h3>
      <p class="text-sm text-gray-500">
        This navbar stays in desktop mode until the screen is very small ('sm' / 640px).
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-100 h-[200px] relative">
        <Navbar position="absolute" mobile-breakpoint="sm" class="w-full bg-white border-b">
          <template #logo>
            <div class="flex items-center gap-2 font-bold text-lg">Small Breakpoint</div>
          </template>
          <template #left>
            <NavbarGroup>
              <NavbarItem label="Link A" />
              <NavbarItem label="Link B" />
            </NavbarGroup>
          </template>
          <template #right>
            <Button size="sm" variant="outline">Log in</Button>
          </template>
        </Navbar>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Custom Slot Styles</h3>
      <p class="text-sm text-gray-500">
        Using <code>logoClass</code>, <code>contentClass</code>, and <code>footerClass</code> to
        style specific slot containers.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[300px]">
        <Navbar
          variant="sidebar"
          mobileBreakpoint="sm"
          position="relative"
          logoClass="bg-blue-100 text-blue-700 justify-center"
          contentClass="bg-green-50 px-4"
          footerClass="bg-red-50 border-t-2 border-red-200"
          class="bg-white border-r h-full w-64">
          <template #logo>
            <div class="font-bold">Styled Logo Area</div>
          </template>
          <template #default>
            <div class="test-content p-4">
              <p>Content Area (Green bg)</p>
              <p class="text-xs mt-2">
                This area has <code>bg-green-50</code> applied via <code>contentClass</code>.
              </p>
            </div>
          </template>
          <template #right>
            <div class="text-sm">Footer Area (Red bg)</div>
          </template>
        </Navbar>
      </div>
    </section>
  </div>
</template>
