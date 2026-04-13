<script setup lang="ts">
import { AppShell } from '@/components/AppShell'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import Avatar from '@/components/Avatar.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './NestedMenusLayout.vue?raw'
import { menuItems } from './shared-data'
</script>

<template>
  <DemoSection title="Nested Menus as Layout Tabs" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4 w-full">
      When using <code>renderNestedTabs="true"</code>, clicking a primary Sidebar navigation item
      that has children creates a tab bar at the top of the <code>main</code> slot layout
      dynamically.
    </p>
    <div
      class="border rounded-lg overflow-hidden h-[500px] relative z-0 flex flex-col w-full shadow-sm">
      <AppShell variant="sidebar" layout-mode="variant4" class="bg-white border-r" renderNestedTabs>
        <template #sidebar-header>
          <div class="font-bold text-lg flex items-center gap-2 px-2 py-3 border-b">
            <div class="w-7 h-7 rounded-md bg-teal-500 text-white flex items-center justify-center">
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
          <div class="p-8 h-full bg-slate-50/50 flex flex-col items-center justify-center border-l">
            <div
              class="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mb-6 rotate-3">
              <Icon icon="lucide:panel-top" class="w-8 h-8 text-teal-500" />
            </div>
            <h3 class="text-xl font-semibold text-slate-800 mb-2">Dynamic Layout Tabs</h3>
            <p class="text-slate-500 text-center max-w-sm text-sm leading-relaxed">
              Notice the tab bar at the very top of this view? Clicking on "Analytics", "Projects",
              or "Settings" in the sidebar keeps the parent active and shows siblings as horizontal
              tabs!
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
</template>
