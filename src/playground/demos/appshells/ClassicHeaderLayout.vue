<script setup lang="ts">
import { AppShell } from '@/components/AppShell'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ClassicHeaderLayout.vue?raw'
import { Stats } from '@/components/Stats'
import { BarChart } from '@/components/Chart'
import { monthlyBarData } from '../charts/chart-data'
import { statItems } from './shared-data'
</script>

<template>
  <DemoSection title="Classic Layout (Top Navigation)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4 w-full">
      Using <code>variant="header"</code> with <code>layout-mode="variant4"</code> renders a top
      navigation bar instead of a sidebar. This is perfect for consumer-facing apps or less complex
      admin tools.
    </p>
    <div
      class="border rounded-lg overflow-hidden flex flex-col h-[500px] relative z-0 bg-body shadow-sm">
      <AppShell variant="header" layout-mode="variant4" class="bg-white border-b sticky top-0 z-50">
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
            <Stats
              :items="statItems.slice(0, 3)"
              columns="3"
              variant="outline"
              layout="title-top-icon-bottom-right" />
            <div
              class="flex-1 bg-white border border-border/50 shadow-sm rounded-xl p-6 min-h-[300px]">
              <h3 class="font-medium text-lg mb-6">Activity Overview</h3>
              <BarChart :data="monthlyBarData" class="w-full h-64" :show-grid="true" />
            </div>
          </div>
        </template>
      </AppShell>
    </div>
  </DemoSection>
</template>
