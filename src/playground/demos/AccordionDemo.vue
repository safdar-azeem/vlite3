<script setup lang="ts">
import { ref, h } from 'vue'
import { Accordion } from '@/components/Accordion'
import Switch from '@/components/Switch.vue'
import Label from '@/components/Label.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './AccordionDemo.vue?raw'

// --- Data Schemas ---

const basicItems = [
  {
    id: '1',
    title: 'What is Builto?',
    icon: 'lucide:info',
    content:
      'Builto is a powerful component library built with Vue 3 and Tailwind CSS, designed for speed and flexibility.',
  },
  {
    id: '2',
    title: 'Is it accessible?',
    content:
      'Yes. It adheres to the WAI-ARIA design pattern, with proper roles and keyboard navigation support.',
  },
  {
    id: '3',
    title: 'Can I customize the styling?',
    content:
      'Absolutely. You can use props for variants or override classes directly using the pass-through prop system.',
  },
]

const iconItems = [
  {
    id: 'feature-1',
    title: 'User Management',
    icon: 'lucide:users',
    content: 'Manage users, roles, and permissions efficiently.',
  },
  {
    id: 'feature-2',
    title: 'Analytics',
    icon: 'lucide:bar-chart',
    content: 'View real-time statistics and growth reports.',
  },
  {
    id: 'feature-3',
    title: 'Settings',
    icon: 'lucide:settings',
    content: 'Configure your application preferences and integrations.',
  },
]

// State for interactive demo
const allowMultiple = ref(false)
const interactiveValue = ref(['1'])

// --- Custom Body Component Demo ---
const CustomBodyComponent = {
  props: ['item', 'close'],
  setup(props: any) {
    return () =>
      h(
        'div',
        {
          class: 'p-4 bg-primary/5 rounded-md border border-primary/10',
        },
        [
          h('div', { class: 'font-bold text-primary mb-2' }, 'Custom Body Component'),
          h(
            'p',
            { class: 'text-sm text-gray-600 mb-3' },
            `This content is rendered dynamically. Item ID: ${props.item.id}`
          ),
          h(
            'button',
            {
              class: 'text-xs font-bold text-primary hover:underline cursor-pointer',
              onClick: props.close,
            },
            'Close (via prop)'
          ),
        ]
      )
  },
}

const bodyComponentItems = [
  {
    id: 'custom-1',
    title: 'Click to see Custom Component',
    bodyComponent: CustomBodyComponent,
  },
  {
    id: 'custom-2',
    title: 'Another Custom Item',
    bodyComponent: CustomBodyComponent,
  },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <div class="space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Accordion</h2>
      <p class="text-gray-500 text-lg">
        A vertically stacked set of interactive headings that each reveal a section of content.
      </p>
    </div>

    <DemoSection title="Layouts & Variants" :code="sourceCode">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">
            Default (Detached)
          </h4>
          <Accordion :items="basicItems" />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">Attached Group</h4>
          <Accordion :items="basicItems" attached />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">
            Solid Variant (Trigger Bg)
          </h4>
          <Accordion :items="basicItems" variant="solid" />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">
            Outline (Attached)
          </h4>
          <Accordion :items="basicItems" variant="outline" attached />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">Separated</h4>
          <Accordion :items="basicItems" variant="separated" />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">
            Ghost (Minimal)
          </h4>
          <Accordion :items="basicItems" variant="ghost" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="New Features: Numbering & Icons" :code="sourceCode">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">
            With Numbering (show-index)
          </h4>
          <Accordion :items="basicItems" variant="outline" show-index attached />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">
            Icon Primary Variant
          </h4>
          <Accordion :items="basicItems" variant="separated" icon-variant="primary" />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">
            Dynamic Icon (Solid -> Primary)
          </h4>
          <Accordion
            :items="basicItems"
            variant="solid"
            open-icon="lucide:minus"
            close-icon="lucide:plus"
            icon-variant="solid"
            active-icon-variant="primary" />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase tracking-wider">Outline Icons</h4>
          <Accordion :items="basicItems" variant="ghost" icon-variant="outline" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Interactive Playground" :code="sourceCode">

      <div class="p-6 border rounded-xl space-y-6 bg-gray-50/50">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <Switch v-model="allowMultiple" />
            <Label>Allow Multiple Open</Label>
          </div>
          <div class="text-sm text-gray-500">
            Model Value:
            <span class="font-mono text-primary">{{ interactiveValue }}</span>
          </div>
        </div>

        <div class="bg-body p-6 rounded-lg border shadow-sm">
          <Accordion
            v-model="interactiveValue"
            :items="basicItems"
            :allow-multiple="allowMultiple"
            variant="outline"
            attached />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Advanced: Scoped Slots" :code="sourceCode">
      <p class="text-gray-500">Fully customize the trigger or content using slots.</p>

      <div class="max-w-2xl border rounded-lg p-4 bg-white">
        <Accordion
          :items="[
            {
              id: 'custom',
              title: 'Ignored Title',
              disabled: false,
            },
          ]"
          variant="outline">
          <template #trigger="{ toggle, open }">
            <div
              class="flex items-center gap-4 w-full p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              @click="toggle">
              <div
                class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span class="font-bold text-lg">IMG</span>
              </div>
              <div class="flex-1 text-left">
                <h5 class="font-bold text-gray-900">Custom Trigger Layout</h5>
                <p class="text-xs text-gray-500">Click anywhere on this row</p>
              </div>
              <div
                class="px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                :class="open ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'">
                {{ open ? 'Active' : 'Inactive' }}
              </div>
            </div>
          </template>

          <template #content>
            <div class="p-6 bg-gray-50 rounded-b-lg border-t border-dashed">
              <div class="grid grid-cols-2 gap-4">
                <div class="h-20 bg-white rounded border"></div>
                <div class="h-20 bg-white rounded border"></div>
                <div class="col-span-2 text-center text-sm text-gray-500 pt-2">
                  Custom Complex Content via Slot
                </div>
              </div>
            </div>
          </template>
        </Accordion>
      </div>
    </DemoSection>

    <DemoSection title="Size Variants" :code="sourceCode">

      <div class="space-y-8 max-w-3xl">
        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase">Small (size="sm")</h4>
          <Accordion :items="basicItems" size="sm" variant="outline" attached />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase">Medium (Default)</h4>
          <Accordion :items="basicItems" size="md" variant="outline" attached />
        </div>

        <div class="space-y-3">
          <h4 class="font-medium text-sm text-gray-500 uppercase">Large (size="lg")</h4>
          <Accordion :items="basicItems" size="lg" variant="outline" attached />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Body Component prop" :code="sourceCode">
      <p class="text-gray-500">
        Pass a component definition directly to the item object to render it in the body.
      </p>

      <div class="max-w-2xl">
        <Accordion :items="bodyComponentItems" variant="outline" />
      </div>
    </DemoSection>
  </div>
</template>
