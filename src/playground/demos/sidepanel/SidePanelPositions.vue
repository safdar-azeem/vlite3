<script setup lang="ts">
import { ref } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidePanelPositions.vue?raw'

const showRight = ref(false)
const showLeft = ref(false)
</script>

<template>
  <DemoSection title="Positions" :code="sourceCode">
    <div class="flex flex-wrap items-center gap-3">
      <Button icon="lucide:panel-right" @click="showRight = true">Right Panel</Button>
      <Button icon="lucide:panel-left" variant="outline" @click="showLeft = true"
        >Left Panel</Button
      >
    </div>

    <!-- Right panel -->
    <SidePanel
      v-model:show="showRight"
      title="Notifications"
      description="Your latest activity"
      position="right">
      <div class="space-y-3">
        <div
          v-for="n in [
            { icon: '🔔', text: 'New comment on your post', time: '2 min ago', read: false },
            { icon: '✅', text: 'Task Design Review completed', time: '1 hr ago', read: false },
            { icon: '👋', text: 'Jamie joined your workspace', time: '3 hrs ago', read: true },
            { icon: '📦', text: 'Deployment to production done', time: 'Yesterday', read: true },
          ]"
          :key="n.text"
          class="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/30"
          :class="n.read ? 'opacity-60' : 'bg-primary/5'">
          <span class="text-lg leading-none mt-0.5 shrink-0">{{ n.icon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-foreground leading-snug">{{ n.text }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ n.time }}</p>
          </div>
          <div v-if="!n.read" class="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
        </div>
      </div>

      <template #footer="{ close }">
        <Button class="w-full" variant="outline" @click="close">Mark all as read</Button>
      </template>
    </SidePanel>

    <!-- Left panel -->
    <SidePanel v-model:show="showLeft" title="Quick Navigation" position="left">
      <nav class="space-y-1">
        <div
          v-for="item in [
            { icon: 'lucide:home', label: 'Dashboard', active: true },
            { icon: 'lucide:folders', label: 'Projects', active: false },
            { icon: 'lucide:users', label: 'Team', active: false },
            { icon: 'lucide:bar-chart-2', label: 'Analytics', active: false },
            { icon: 'lucide:settings', label: 'Settings', active: false },
          ]"
          :key="item.label"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
          :class="
            item.active
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          ">
          <span class="text-base">
            <!-- Inline icon using a character approximation for demo clarity -->
            {{
              {
                'lucide:home': '🏠',
                'lucide:folders': '📁',
                'lucide:users': '👥',
                'lucide:bar-chart-2': '📊',
                'lucide:settings': '⚙️',
              }[item.icon]
            }}
          </span>
          {{ item.label }}
        </div>
      </nav>

      <template #footer="{ close }">
        <Button class="w-full" @click="close">Close Menu</Button>
      </template>
    </SidePanel>
  </DemoSection>
</template>
