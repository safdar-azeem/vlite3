<script setup lang="ts">
import { Navbar, NavbarItem, NavbarGroup } from '@/components/Navbar'
import Avatar from '@/components/Avatar.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './NavbarDemo.vue?raw'

</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Navbar</h2>
      <p class="text-gray-500">Standalone horizontal navigation bars.</p>
    </div>

    <!-- 1. Standard Top Navigation -->
    <DemoSection title="Standard Top Navigation" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        A horizontal top bar utilizing the <code>left</code>, <code>center</code>, and
        <code>right</code> slots to organize content. The search bar is centered.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-100 h-[250px] relative z-0">
        <Navbar position="absolute" class="w-full bg-white border-b relative z-20">
          <template #logo>
            <div class="flex items-center gap-2 font-bold text-lg">Builto</div>
          </template>
          
          <template #left>
            <NavbarGroup>
              <NavbarItem label="Home" active />
              <NavbarItem label="Features" />
              <NavbarItem label="Pricing" />
            </NavbarGroup>
          </template>

          <template #center>
            <Input
              placeholder="Search..."
              icon="lucide:search"
              size="sm"
              class="hidden sm:flex w-64 bg-muted border-none shadow-none focus-visible:ring-1 focus-visible:ring-border" />
          </template>

          <template #right>
            <div class="flex items-center gap-3">
              <Button size="sm" variant="ghost" class="hidden sm:flex">Log In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </template>
        </Navbar>
        
        <div class="p-8 text-gray-400 bg-gray-50 flex-1 h-full pt-20">
          Page content sitting underneath the absolutely positioned navbar.
        </div>
      </div>
    </DemoSection>

    <!-- 2. Mobile Menu Dropdown Variant -->
    <DemoSection title="Mobile Menu Dropdown Variant" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        Using <code>mobile-menu-variant="dropdown"</code> to show a full-width dropdown instead of a
        drawer on mobile. Resize window to see the effect.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[300px] relative z-0">
        <Navbar
          mobile-menu-variant="dropdown"
          mobileBreakpoint="xl"
          class="bg-white border-b w-full relative z-20">
          <template #logo>
            <div class="font-bold text-xl flex gap-2 items-center">
              <div class="w-6 h-6 rounded bg-primary text-white flex items-center justify-center">B</div> 
              Brand
            </div>
          </template>

          <template #left>
            <NavbarGroup>
              <NavbarItem label="Products" />
              <NavbarItem label="Solutions" />
              <NavbarItem label="Resources" />
            </NavbarGroup>
          </template>

          <template #right>
            <Button size="sm" variant="outline" class="mr-2 hidden sm:flex">Sign In</Button>
            <Avatar size="sm" fallback="JD" class="bg-primary/20 text-primary cursor-pointer border border-primary/20" />
          </template>
          
          <template #mobile-menu>
            <div class="flex flex-col p-2 space-y-2">
              <NavbarItem label="Products" />
              <NavbarItem label="Solutions" />
              <NavbarItem label="Resources" />
            </div>
          </template>
        </Navbar>

        <div class="p-8 text-gray-400 bg-gray-50 flex-1 z-10 relative">
          If the window is below 'xl', the hamburger icon will trigger a standard dropdown covering this space.
        </div>
      </div>
    </DemoSection>

    <!-- 3. Glass & Underline Variants -->
    <DemoSection title="Glass Overlay & Underline Items" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        Using the <code>glass</code> prop for a blurred background and <code>variant="underline"</code> on NavbarItems to create tab-style links.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-50 h-[250px] relative">
        <Navbar position="absolute" glass class="w-full border-b backdrop-blur-md bg-white/60">
          <template #logo>
            <div class="flex items-center gap-2 font-bold text-lg text-indigo-900">App</div>
          </template>

          <template #left>
            <NavbarGroup>
              <NavbarItem label="Dashboard" active variant="underline" />
              <NavbarItem label="Settings" variant="underline" />
            </NavbarGroup>
          </template>
          
          <template #right>
            <Button size="sm" icon="lucide:arrow-right" class="rounded-full px-4">Continue</Button>
          </template>
        </Navbar>
      </div>
    </DemoSection>

    <!-- 4. Breakpoint Adjustments -->
    <DemoSection title="Custom Mobile Trigger Breakpoint" :code="sourceCode">
      <p class="text-sm text-gray-500 mb-4">
        We force this navbar to show the mobile trigger much sooner by using <code>mobileBreakpoint="lg"</code>.
        It also demonstrates overriding the slot styles with <code>logoClass</code> and a custom <code>mobile-trigger</code> slot.
      </p>
      <div class="border rounded-lg overflow-hidden bg-gray-50 flex flex-col h-[200px] relative z-0">
        <Navbar
          mobileBreakpoint="lg"
          position="relative"
          logoClass="bg-purple-100 text-purple-700 px-4 items-center justify-center min-w-32"
          class="bg-white border-b w-full relative z-20">
          
          <template #logo>
            <div class="font-bold">Styled Header</div>
          </template>

          <!-- Custom Trigger logic mapped from scoped toggles -->
          <template #mobile-trigger="{ isOpen, toggle }">
             <button class="p-2 mr-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200" @click="toggle">
               <Icon :icon="isOpen ? 'lucide:x' : 'lucide:menu'" class="w-5 h-5"/>
             </button>
          </template>

          <template #left>
             <NavbarItem label="You shouldn't see me under LG" />
          </template>

          <template #right>
             <Button variant="outline" size="sm">Action</Button>
          </template>
        </Navbar>
      </div>
    </DemoSection>

  </div>
</template>
