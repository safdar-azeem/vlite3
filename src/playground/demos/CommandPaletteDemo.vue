<script setup lang="ts">
import { ref, h } from 'vue'
import NavbarCommandPalette, {
  type CommandPlateSchema,
} from '@/components/NavbarCommandPalette.vue'
import DemoSection from '../DemoSection.vue'
import Button from '@/components/Button.vue'
import CheckBox from '@/components/CheckBox.vue'
import sourceCode from './CommandPaletteDemo.vue?raw'

const AddUserModal = {
  props: ['close', 'role'],
  setup(props: any) {
    return () =>
      h('div', { class: 'p-4 flex flex-col gap-4' }, [
        h('p', `Adding a new user with role: ${props.role || 'User'}`),
        h('div', { class: 'flex justify-end' }, [
          h(Button, { onClick: props.close }, () => 'Close Modal'),
        ]),
      ])
  },
}

const showConditionalItem = ref(true)

const menuItems: CommandPlateSchema[] = [
  {
    label: 'Theme & Style',
    icon: 'lucide:palette',
    children: [
      { label: 'Colors', to: '/colors', icon: 'lucide:palette' },
      { label: 'Theme Toggle', to: '/themetoggle', icon: 'lucide:sun' },
    ],
  },
  {
    label: 'Core',
    icon: 'lucide:box',
    children: [
      { label: 'Button', to: '/button', icon: 'lucide:mouse-pointer-2' },
      { label: 'Badge', to: '/badge', icon: 'lucide:tag' },
    ],
  },
  {
    label: 'Add User',
    icon: 'lucide:user-plus',
    modalBody: AddUserModal,
    modalProps: {
      title: 'Add New User',
      description: 'This is a dynamically loaded modal body from Command Palette.',
      role: 'Administrator',
    },
  },
  {
    label: 'Conditional Item',
    icon: 'lucide:eye-off',
    show: () => showConditionalItem.value,
    action: () => alert('You clicked the conditional item!'),
  },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Command Palette</h2>
      <p class="text-gray-500">
        Global search overlay with dynamic modal and conditional item support.
      </p>
    </div>

    <DemoSection title="Interactive Demo" :code="sourceCode">
      <div class="flex flex-col gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <CheckBox v-model="showConditionalItem" label="Show Conditional Item in Palette" />
        <p class="text-sm text-gray-500 mt-2">
          Toggle the checkbox above to dynamically show or hide the "Conditional Item" inside the
          palette. Press
          <kbd class="px-1 py-0.5 border rounded bg-white font-mono text-xs">Ctrl+J</kbd> /
          <kbd class="px-1 py-0.5 border rounded bg-white font-mono text-xs">Cmd+J</kbd> or click
          the trigger below.
        </p>
      </div>

      <div class="p-8 border rounded-lg bg-white flex items-center justify-center">
        <NavbarCommandPalette
          :items="menuItems"
          placeholder="Search commands or add user..."
          shortcutKey="j" />
      </div>
    </DemoSection>
  </div>
</template>
