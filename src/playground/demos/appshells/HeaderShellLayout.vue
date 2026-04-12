<script setup lang="ts">
import { ref } from 'vue'
import { AppShell } from '@/components/AppShell'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './HeaderShellLayout.vue?raw'
import { Stats } from '@/components/Stats'
import { BarChart } from '@/components/Chart'
import { monthlyBarData } from '../charts/chart-data'
import { statItems, menuItems } from './shared-data'

const isSidebarCompact = ref(false)
</script>

<template>
  <DemoSection title="Header-Shell Layout (Flush Sidebar + Floating Content)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      The <code>variant5</code> layout mode has the sidebar flush against the left, top, and
      bottom edges. The header and main content sit inside a floating rounded card panel to the
      right. Supports compact sidebar toggle.
    </p>
    <div
      class="h-[600px] relative z-0 flex flex-col w-full bg-body rounded-lg overflow-hidden border shadow-sm">
      <AppShell
        variant="sidebar"
        layout-mode="variant5"
        :class="isSidebarCompact ? 'w-22' : 'w-64'">
        <template #sidebar-header>
          <div
            class="font-bold text-lg flex items-center gap-3 px-2 py-1"
            :class="isSidebarCompact ? 'justify-center w-full px-0' : ''">
            <div
              class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-inner shrink-0">
              <Icon icon="lucide:boxes" class="w-5 h-5" />
            </div>
            <span v-if="!isSidebarCompact" class="tracking-tight">Acme Corp</span>
          </div>
        </template>

        <template #sidebar>
          <SidebarMenu
            :items="menuItems"
            class="px-3 py-2"
            :compact="isSidebarCompact"
            :show-compact-labels="true" />
        </template>

        <template #sidebar-footer>
          <div
            class="p-4 bg-muted/40 mt-auto flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
            :class="isSidebarCompact ? 'justify-center px-2' : ''">
            <Avatar size="sm" fallback="JD" class="bg-blue-100 text-blue-700 font-medium" />
            <template v-if="!isSidebarCompact">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">Jane Doe</p>
                <p class="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
              <Icon icon="lucide:chevrons-up-down" class="w-4 h-4 text-muted-foreground" />
            </template>
          </div>
        </template>

        <template #header="{ toggle, pageTitle }">
          <div class="h-14 flex items-center justify-between px-6 w-full gap-4">
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
              <div class="font-semibold text-sm flex items-center gap-2">
                {{ pageTitle || 'Overview' }}
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Input
                placeholder="Search..."
                icon="lucide:search"
                size="sm"
                class="bg-muted hidden lg:flex w-56 border-none shadow-none focus-visible:ring-1 focus-visible:ring-border rounded-full" />
              <Button
                variant="ghost"
                size="sm"
                icon="lucide:bell"
                class="text-muted-foreground rounded-full h-8 w-8 p-0" />
              <Avatar
                size="sm"
                fallback="JD"
                class="bg-primary/10 text-primary cursor-pointer border border-primary/20 hover:bg-primary/20 transition-colors" />
            </div>
          </div>
        </template>

        <template #main>
          <div class="h-full flex flex-col gap-6">
            <Stats :items="statItems.slice(0, 3)" columns="3" variant="shadow" />
            <div
              class="flex-1 bg-white border border-border shadow-sm rounded-xl p-4 min-h-[300px]">
              <h3 class="font-medium text-lg mb-4">Monthly Revenue</h3>
              <BarChart :data="monthlyBarData" class="h-64" />
            </div>
          </div>
        </template>
      </AppShell>
    </div>
  </DemoSection>
</template>
