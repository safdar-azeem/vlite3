<script setup lang="ts">
import { Navbar, NavbarItem, NavbarGroup } from '@/components/Navbar'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import { SidebarMenuItemSchema } from '@/components/SidebarMenu'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './NavbarDemo.vue?raw'

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

    <DemoSection title="App Layout Mode (Full Structure)" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        Pass <code>header</code> and <code>main</code> slots to transform the Navbar into a
        full-page layout wrapper.
      </p>
      <div class="border rounded-lg overflow-hidden h-[500px] relative z-0 flex flex-col w-full">
        <Navbar variant="sidebar" class="bg-white border-r">
          <template #header="{ toggle }">
            <div
              class="h-16 border-b bg-white flex items-center justify-between px-6 w-full shadow-sm">
              <div class="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:menu"
                  class="md:hidden -ml-2"
                  @click="toggle" />
                <div class="font-bold text-lg flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded bg-primary text-white flex items-center justify-center">
                    B
                  </div>
                  Builto
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Input
                  placeholder="Search..."
                  icon="lucide:search"
                  size="sm"
                  rounded="full"
                  class="bg-gray-100 hidden sm:flex w-64" />
                <Button variant="ghost" size="sm" icon="lucide:bell" rounded="full" />
                <Avatar size="sm" fallback="JD" class="bg-primary/20 text-primary" />
              </div>
            </div>
          </template>

          <template #default>
            <SidebarMenu :items="menuItems" class="pt-3" />
          </template>

          <template #main>
            <div class="p-6 h-full bg-gray-50">
              <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  class="bg-white p-6 rounded-xl border shadow-sm h-32 flex flex-col justify-center items-center text-gray-400">
                  Card 1
                </div>
                <div
                  class="bg-white p-6 rounded-xl border shadow-sm h-32 flex flex-col justify-center items-center text-gray-400">
                  Card 2
                </div>
                <div
                  class="bg-white p-6 rounded-xl border shadow-sm h-32 flex flex-col justify-center items-center text-gray-400 md:col-span-2 lg:col-span-1">
                  Card 3
                </div>
              </div>
            </div>
          </template>
        </Navbar>
      </div>
    </DemoSection>

    <DemoSection title="Nested Menus as Layout Tabs" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        When using <code>renderNestedTabs="true"</code>, clicking a primary Sidebar navigation item
        that has children won't expand downwards. Instead, its children are instantly extracted and
        rendered dynamically at the top of the <code>main</code> slot layout as a tab bar.
      </p>
      <div class="border rounded-lg overflow-hidden h-[500px] relative z-0 flex flex-col w-full">
        <Navbar variant="sidebar" class="bg-white border-r" renderNestedTabs>
          <template #header="{ toggle }">
            <div
              class="h-16 border-b bg-white flex items-center justify-between px-6 w-full shadow-sm">
              <div class="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:menu"
                  class="md:hidden -ml-2"
                  @click="toggle" />
                <div class="font-bold text-lg flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded bg-primary text-white flex items-center justify-center">
                    T
                  </div>
                  TabApp
                </div>
              </div>
            </div>
          </template>

          <template #default>
            <SidebarMenu :items="menuItems" :default-expanded="['Analytics']" class="pt-2" />
          </template>

          <template #main>
            <div class="p-6 h-full bg-gray-50 flex flex-col items-center justify-center">
              <div class="text-4xl text-gray-400 mb-4">👆</div>
              <p class="text-gray-500 text-center max-w-sm">
                Clicking on "Analytics", "Projects", or "Team" will route their children up to the
                Navbar layout tabs automatically!
              </p>
            </div>
          </template>
        </Navbar>
      </div>
    </DemoSection>

    <DemoSection title="Top Navigation" :code="sourceCode">
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
    </DemoSection>

    <DemoSection title="Sidebar Navigation" :code="sourceCode">
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
        <div class="p-8 text-gray-400 flex-1">Main Content</div>
      </div>
    </DemoSection>

    <DemoSection title="Configurable Mobile Breakpoint (Large 'lg')" :code="sourceCode">
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
    </DemoSection>

    <DemoSection title="Configurable Mobile Breakpoint (Small 'sm')" :code="sourceCode">
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
    </DemoSection>

    <DemoSection title="Custom Slot Styles" :code="sourceCode">
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
          rightClass="bg-red-50 border-t-2 border-red-200"
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
    </DemoSection>

    <DemoSection title="Header Variant Custom Styles" :code="sourceCode">
      <p class="text-sm text-gray-500">
        Using <code>logoClass</code>, <code>contentClass</code>, and <code>rightClass</code> on a
        Header variant.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[200px]">
        <Navbar
          variant="header"
          position="relative"
          logoClass="bg-purple-100 text-purple-700 px-4 rounded-r-lg"
          contentClass="bg-orange-50 border border-orange-200 rounded-lg p-1 flex-1 flex justify-center"
          rightClass="bg-pink-100 text-pink-700 px-4 rounded-l-lg"
          class="bg-white border-b w-full">
          <template #logo>
            <div class="font-bold">Styled Header</div>
          </template>
          <template #center>
            <div class="text-sm">Centered Content (Orange)</div>
          </template>
          <template #right>
            <div class="text-sm font-semibold">Right (Pink)</div>
          </template>
        </Navbar>
      </div>
    </DemoSection>

    <DemoSection title="Mobile Trigger Customization" :code="sourceCode">
      <p class="text-sm text-gray-500">
        Using <code>mobileTriggerClass</code> to style the default button, or providing a custom
        <code>mobile-trigger</code> slot. Resize window to see mobile view.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[200px]">
        <Navbar
          variant="sidebar"
          mobileBreakpoint="xl"
          logoClass="bg-blue-100"
          rightClass="bg-red-50"
          mobileTriggerClass="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          class="bg-white border-r h-full w-64">
          <template #logo>
            <div class="font-bold">Mobile Trigger Demo</div>
          </template>
          <template #default>
            <div class="p-4 text-sm">
              Resize window to &lt; xl to see the yellow mobile trigger.
            </div>
          </template>
        </Navbar>
      </div>
    </DemoSection>

    <DemoSection title="Mobile Menu: Dropdown Variant" :code="sourceCode">
      <p class="text-sm text-gray-500">
        Using <code>mobileMenuVariant="dropdown"</code> to show a full-width dropdown instead of a
        side panel on mobile. Resize window to see the effect.
      </p>
      <div
        class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[400px] relative z-0">
        <Navbar
          variant="header"
          mobile-menu-variant="dropdown"
          mobileBreakpoint="xl"
          class="bg-white border-b w-full relative z-20">
          <template #logo>
            <div class="font-bold text-xl">Dropdown Menu</div>
          </template>
          <template #left>
            <NavbarGroup>
              <NavbarItem label="Products" />
              <NavbarItem label="Solutions" />
              <NavbarItem label="Resources" />
            </NavbarGroup>
          </template>
          <template #right>
            <Button size="sm">Sign In</Button>
          </template>
          <template #mobile-menu>
            <div class="flex flex-col p-2 space-y-2">
              <NavbarItem label="Products" />
              <NavbarItem label="Solutions" />
              <NavbarItem label="Resources" />
            </div>
          </template>
        </Navbar>

        <div class="p-8 text-gray-400 bg-gray-50 flex-1 z-10 relative">
          Page Content under the navbar. The dropdown should overlay this.
        </div>
      </div>
    </DemoSection>

    ```
  </div>
</template>
