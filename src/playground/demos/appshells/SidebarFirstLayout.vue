<script setup lang="ts">
import { AppShell } from '@/components/AppShell'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import Avatar from '@/components/Avatar.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidebarFirstLayout.vue?raw'
import { Stats } from '@/components/Stats'
import { BarChart } from '@/components/Chart'
import { monthlyBarData } from '../charts/chart-data'
import { statItems, menuItems } from './shared-data'
</script>

<template>
  <DemoSection title="Sidebar-First Layout (Standard)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4 w-full">
      The <code>variant1</code> layout mode is the default and stretches the sidebar down the entire
      vertical axis. The header and main content reside next to it. Perfect for most admin
      interfaces.
    </p>
    <div
      class="h-[600px] relative z-0 flex flex-col w-full bg-body rounded-lg overflow-hidden border shadow-sm">
      <AppShell variant="sidebar" layout-mode="variant1" class="w-64">
        <template #sidebar-header>
          <div class="font-bold text-lg flex items-center gap-3 px-4 py-3.5">
            <div
              class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-inner">
              <Icon icon="lucide:boxes" class="w-5 h-5" />
            </div>
            <span class="tracking-tight">Acme Corp</span>
          </div>
        </template>

        <template #sidebar>
          <SidebarMenu :items="menuItems" class="px-3 pt-1" />
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
            class="h-14 border-b border-border bg-background flex items-center justify-between px-6 w-full gap-4 sticky top-0 z-10 shadow-sm">
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
