<script setup lang="ts">
import { AppShell } from '@/components/AppShell'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import Avatar from '@/components/Avatar.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './DockLayout.vue?raw'
import { menuItems } from './shared-data'
</script>

<template>
  <DemoSection title="Dock Layout Mode (Minimal Vertical)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Using <code>layout-mode="dock"</code> to render a compact floating sidebar that aligns
      neatly in the center of the vertical axis.
    </p>
    <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[500px] shadow-sm">
      <AppShell variant="sidebar" layout-mode="dock" :compact="true" class="w-16" mobileBreakpoint="md">
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
            render-mode="popover"
            class="mt-4 gap-2 px-2" />
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
</template>
