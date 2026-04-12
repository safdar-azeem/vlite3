<script setup lang="ts">
import SidebarFirstLayout from './appshells/SidebarFirstLayout.vue'
import DashboardLayout from './appshells/DashboardLayout.vue'
import ClassicHeaderLayout from './appshells/ClassicHeaderLayout.vue'
import DockLayout from './appshells/DockLayout.vue'
import NestedMenusLayout from './appshells/NestedMenusLayout.vue'
import HeaderShellLayout from './appshells/HeaderShellLayout.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">App Shell</h2>
      <p class="text-gray-500">
        The master orchestrator for complex application layouts (sidebars, dashboards, layout-tabs).
      </p>
    </div>

    <!-- Sidebar First Layout -->
    <SidebarFirstLayout />

    <!-- Dashboard Layout -->
    <DashboardLayout />

    <!-- Classic Header Layout -->
    <ClassicHeaderLayout />

    <!-- Dock Layout -->
    <DockLayout />

    <!-- Header Shell Layout -->
    <HeaderShellLayout />

    <!-- Nested Menus -->
    <NestedMenusLayout />
  </div>
</template>
