<script setup lang="ts">
import { ref } from 'vue'
import { Navbar, NavbarItem, NavbarGroup } from '@/components/Navbar'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Label from '@/components/Label.vue'
import Icon from '@/components/Icon.vue'

const centerPosition = ref<'center' | 'left' | 'right'>('center')
</script>

<template>
  <section class="space-y-8">
     <div class="space-y-2">
      <h2 class="text-xl font-semibold tracking-tight">Navigation</h2>
      <p class="text-sm text-gray-500">
        Navbars, sidebars, and other navigational structures.
      </p>
    </div>

    <!-- Top Navbar Demo -->
    <div class="space-y-4">
       <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Top Navbar</h3>
       
       <div class="border border-border rounded-lg overflow-hidden bg-gray-100 h-[250px] relative flex flex-col">
          <Navbar position="absolute" :center-position="centerPosition" class="w-full bg-body border-b">
             <template #logo>
                <div class="flex items-center gap-2 font-bold text-lg">
                   <div class="w-8 h-8 bg-primary text-primary-fg rounded-md flex items-center justify-center">B</div>
                   Builto
                </div>
             </template>
             
             <template #left>
                <NavbarGroup>
                   <NavbarItem label="Dashboard" active />
                   <NavbarItem label="Projects" />
                   <NavbarItem label="Team" />
                </NavbarGroup>
             </template>
             
             <template #center>
                <div class="w-full max-w-[240px]">
                   <Input placeholder="Search..." icon="lucide:search" size="sm" rounded="full" class="bg-gray-100 border-transparent focus:bg-white" />
                </div>
             </template>
             
             <template #right>
                <NavbarGroup>
                   <Button variant="ghost" size="sm" icon="lucide:bell" rounded="full" />
                   <Button variant="ghost" size="sm" icon="lucide:settings" rounded="full" />
                   <Avatar size="sm" src="https://i.pravatar.cc/150?u=1" />
                </NavbarGroup>
             </template>
          </Navbar>
          
          <div class="flex-1 flex items-center justify-center text-gray-400">
             Content Area
          </div>
       </div>
    </div>
    
    <!-- Sidebar Demo -->
    <div class="space-y-4">
       <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Sidebar Layout</h3>
       
       <div class="border border-border rounded-lg overflow-hidden bg-gray-50 h-[400px] flex">
          <Navbar variant="sidebar" position="relative" width="w-64" class="bg-body border-r h-full flex flex-col">
             <template #logo>
                <div class="flex items-center gap-2 font-bold text-lg px-2">
                   <Icon icon="lucide:hexagon" class="w-6 h-6 text-primary" />
                   Sidebar
                </div>
             </template>
             
             <template #default>
                <div class="flex-1 overflow-y-auto py-4">
                   <NavbarGroup orientation="vertical">
                      <Label class="px-2 mb-2 text-xs uppercase text-gray-500">Main</Label>
                      <NavbarItem icon="lucide:layout-dashboard" label="Dashboard" active />
                      <NavbarItem icon="lucide:users" label="Users" />
                      <NavbarItem icon="lucide:shopping-bag" label="Products" />
                   </NavbarGroup>
                   
                   <div class="my-4 h-px bg-border mx-2"></div>
                   
                   <NavbarGroup orientation="vertical">
                      <Label class="px-2 mb-2 text-xs uppercase text-gray-500">Settings</Label>
                      <NavbarItem icon="lucide:settings" label="General" />
                      <NavbarItem icon="lucide:shield" label="Security" />
                   </NavbarGroup>
                </div>
             </template>
             
             <template #right>
                <div class="mt-auto border-t pt-4">
                   <div class="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                      <Avatar size="sm" fallback="JD" />
                      <div class="flex flex-col text-sm overflow-hidden">
                         <span class="font-medium truncate">John Doe</span>
                         <span class="text-xs text-gray-500 truncate">admin@builto.com</span>
                      </div>
                   </div>
                </div>
             </template>
          </Navbar>
          
           <div class="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
             Main Content
          </div>
       </div>
    </div>

  </section>
</template>
