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
            <SidebarMenu :items="menuItems" />
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

    <DemoSection title="Modern Dashboard Layout" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        A floating dashboard style layout with a transparent sidebar and a rounded main content area. We use <code>layout-mode="dashboard"</code>. The current route title is accessible dynamically via <code>page-title</code> in the <code>header</code> slot.
      </p>
      <div class="h-[600px] relative z-0 flex flex-col w-full bg-body rounded-lg overflow-hidden border">
        <Navbar variant="sidebar" layout-mode="dashboard" class="w-64">
          <template #logo>
            <div class="font-bold text-xl flex items-center gap-2 px-6 pt-4 pb-2">
              <div class="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                V
              </div>
              Vlite3
            </div>
          </template>

          <template #default>
            <SidebarMenu :items="menuItems" class="px-2" />
          </template>

          <template #header="{ toggle, pageTitle }">
            <div
              class="h-16 flex items-center justify-between px-6 w-full gap-4">
              <div class="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="lucide:sidebar"
                  class="-ml-2 text-muted-foreground hover:text-foreground"
                  @click="toggle" />
                <div class="font-semibold text-lg flex items-center gap-2">
                  <Icon icon="lucide:layout" class="w-5 h-5 text-gray-400" />
                  {{ pageTitle || 'Overview Defaults' }}
                </div>
                <div class="hidden md:flex text-sm text-gray-400 gap-2 items-center ml-4">
                  <Icon icon="lucide:home" class="w-3.5 h-3.5" /> 
                  <span>/</span> Dashboard <span>/</span> <span class="text-foreground font-medium">Overview</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Input
                  placeholder="Search here..."
                  icon="lucide:search"
                  size="sm"
                  class="bg-muted hidden lg:flex w-64 border-none shadow-none focus-visible:ring-1 focus-visible:ring-border" />
                <Button variant="outline" size="sm" icon="lucide:bell" />
                <Button variant="outline" size="sm" icon="lucide:settings" />
                <Avatar size="sm" fallback="SA" class="bg-primary/10 text-primary ml-2 cursor-pointer border border-primary/20" />
              </div>
            </div>
          </template>

          <template #main>
            <div class="p-6 h-full flex flex-col gap-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="bg-muted/30 p-6 rounded-xl border border-border/50 flex flex-col gap-2">
                  <div class="text-xs text-muted-foreground font-medium uppercase tracking-wider">Metrics {{ i }}</div>
                  <div class="text-2xl font-bold font-mono">1,024</div>
                </div>
              </div>
              
              <div class="flex-1 bg-muted/20 border border-border/50 rounded-xl flex items-center justify-center min-h-[200px]">
                <div class="text-center text-muted-foreground flex flex-col items-center gap-3">
                  <Icon icon="lucide:bar-chart-2" class="w-10 h-10 opacity-20" />
                  <span>Main content area</span>
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
            <SidebarMenu :items="menuItems" :default-expanded="['Analytics']" />
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

    <DemoSection title="Dock Layout (Minimal Floating Sidebar)" :code="sourceCode">
      <p class="text-sm text-gray-500">
        Using <code>layout-mode="dock"</code> to render a compact floating sidebar that only
        takes the height of its content. The sidebar appears as a vertically centered
        icon dock — perfect for minimal dashboards.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[500px]">
        <Navbar
          variant="sidebar"
          layout-mode="dock"
          :compact="true"
          class="w-16"
          mobileBreakpoint="md">
          <template #logo>
            <div
              class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">
              V
            </div>
          </template>

          <template #default>
            <SidebarMenu
              :items="menuItems.slice(0, 4)"
              :compact="true"
              :show-tooltip="true"
              render-mode="popover" />
          </template>

          <template #right>
            <Avatar size="xs" fallback="JD" class="bg-primary/20 text-primary" />
          </template>

          <template #header="{ toggle, pageTitle }">
            <div class="h-12 border-b bg-white flex items-center px-4 w-full">
              <button class="md:hidden mr-4" @click="toggle">
                <Icon icon="lucide:menu" class="w-5 h-5" />
              </button>
              <span class="font-semibold text-sm">{{ pageTitle || 'Dashboard' }}</span>
            </div>
          </template>

          <template #main>
            <div class="p-6">
              <h2 class="text-lg font-bold mb-2">Dock Layout Preview</h2>
              <p class="text-gray-500 text-sm">
                The sidebar is a floating card that sizes itself to its content — not
                full height. It's vertically centered and uses minimal space.
              </p>
            </div>
          </template>
        </Navbar>
      </div>
    </DemoSection>

    ```
  </div>
</template>
