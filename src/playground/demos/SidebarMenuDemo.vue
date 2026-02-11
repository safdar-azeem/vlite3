<script setup lang="ts">
import { ref } from 'vue'
import { SidebarMenu } from '@/components/SidebarMenu'
import { SidebarMenuItemSchema } from '@/components/SidebarMenu/types'
import Button from '@/components/Button.vue'
import CheckBox from '@/components/CheckBox.vue'

// Demo Configuration
const allowMultiple = ref(true)
const variant = ref<'default' | 'ghost'>('default')
const renderMode = ref<'tree' | 'popover'>('tree')
const compact = ref(false)

const toggleVariant = () => {
  variant.value = variant.value === 'default' ? 'ghost' : 'default'
}
const toggleMode = () => {
  renderMode.value = renderMode.value === 'tree' ? 'popover' : 'tree'
}
const toggleCompact = () => {
  compact.value = !compact.value
}

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
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b pb-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Sidebar Menu</h2>
        <p class="text-gray-500">A recursive, accessible navigation menu with smooth animations.</p>
      </div>
      <div class="flex items-center gap-4">
        <CheckBox v-model="allowMultiple" label="Allow Multiple Expanded" />
        <Button size="sm" variant="outline" @click="toggleMode"> Mode: {{ renderMode }} </Button>
        <Button size="sm" variant="outline" @click="toggleVariant"> Variant: {{ variant }} </Button>
        <Button size="sm" variant="outline" @click="toggleCompact">
          Compact: {{ compact ? 'On' : 'Off' }}
        </Button>
      </div>
    </div>

    <!-- Layout Simulation -->
    <div class="flex h-[600px] border rounded-xl overflow-hidden bg-white shadow-sm">
      <!-- Sidebar -->
      <div
        class="border-r bg-gray-50/50 flex flex-col transition-all duration-300"
        :class="compact ? 'w-20' : 'w-64'">
        <div class="p-4 border-b h-16 flex items-center font-bold text-lg px-6">Acme Inc.</div>

        <div class="flex-1 overflow-y-auto p-3">
          <SidebarMenu
            :items="menuItems"
            :allow-multiple="allowMultiple"
            :variant="variant"
            :render-mode="renderMode"
            :compact="compact" />
        </div>

        <div class="p-4 border-t bg-gray-50">
          <div class="flex items-center gap-3">
            <div
              class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              U
            </div>
            <div class="text-sm">
              <div class="font-medium">User Name</div>
              <div class="text-gray-500 text-xs">user@example.com</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col bg-white">
        <div class="h-16 border-b flex items-center px-6 text-gray-400 text-sm">Header</div>
        <div class="flex-1 p-8 flex items-center justify-center text-gray-400 bg-gray-50/20">
          <div class="text-center space-y-2">
            <div class="text-4xl">👋</div>
            <p>Select an item from the sidebar to see active states.</p>
            <p class="text-xs text-gray-400">(Routing is simulated in this demo)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
