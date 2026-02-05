<script setup lang="ts">
import { Navbar, NavbarItem, NavbarGroup } from '@/components/Navbar'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Navbar</h2>
      <p class="text-gray-500">Navigation headers and sidebars.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Top Navigation</h3>
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
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Sidebar Navigation</h3>
      <div class="border rounded-lg overflow-hidden bg-gray-50 h-[300px] flex">
          <Navbar variant="sidebar" position="relative" width="w-48" class="bg-white border-r h-full flex flex-col">
             <template #logo>
                <div class="flex items-center gap-2 font-bold px-4 py-2">
                   <Icon icon="lucide:box" /> Dashboard
                </div>
             </template>
             <template #default>
                <div class="flex-1 py-4">
                   <NavbarGroup orientation="vertical">
                      <NavbarItem icon="lucide:home" label="Overview" active />
                      <NavbarItem icon="lucide:users" label="Team" />
                      <NavbarItem icon="lucide:settings" label="Settings" />
                   </NavbarGroup>
                </div>
             </template>
          </Navbar>
          <div class="p-8 text-gray-400">Main Content</div>
       </div>
    </section>
  </div>
</template>
