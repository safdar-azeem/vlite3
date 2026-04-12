<script setup lang="ts">
import { ref } from 'vue'
import { AppShell } from '@/components/AppShell'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './DashboardLayout.vue?raw'
import { Stats } from '@/components/Stats'
import { LineChart } from '@/components/Chart'
import { revenueData } from '../charts/chart-data'
import { statItems, menuItems } from './shared-data'

const isSidebarCompact = ref(false)
</script>

<template>
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
          <SidebarMenu
            :items="menuItems"
            class="px-2 mt-2"
            :compact="isSidebarCompact"
            :show-compact-labels="true" />
        </template>

        <template #sidebar-footer>
          <div
            class="px-4 py-2 opacity-50 text-xs text-center border-t border-border mt-auto font-mono">
            v0.9.1
          </div>
        </template>

        <template #header="{ toggle, pageTitle }">
          <div class="h-16 flex items-center justify-between px-6 w-full gap-4">
            <div class="flex items-center gap-2">
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
            <Stats
              :items="statItems"
              columns="4"
              variant="solid"
              :attached="true"
              layout="icon-right" />
            <div
              class="flex-1 bg-white border border-border/50 shadow-sm rounded-xl p-6 min-h-[300px]">
              <h3 class="font-medium text-lg mb-6">Audience Growth</h3>
              <LineChart
                :data="revenueData"
                class="h-64 mt-2"
                :show-gradient="true"
                :smooth="true"
                :animated="true" />
            </div>
          </div>
        </template>
      </AppShell>
    </div>
  </DemoSection>
</template>
