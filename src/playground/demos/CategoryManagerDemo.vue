<script setup lang="ts">
import { ref } from 'vue'
import { CategoryManager, type CategoryItem } from '@/components/CategoryManager'
import type { IForm } from '@/components/Form'
import DemoSection from '../DemoSection.vue'
import Icon from '@/components/Icon.vue'
import sourceCode from './CategoryManagerDemo.vue?raw'

const categoryData = ref<CategoryItem[]>([
  {
    id: 'cat-1',
    title: 'Electronics',
    icon: 'lucide:cpu',
    children: [
      {
        id: 'cat-1-1',
        title: 'Computers',
        icon: 'lucide:monitor',
        children: [
          { id: 'cat-1-1-1', title: 'Laptops', icon: 'lucide:laptop', children: [] },
          { id: 'cat-1-1-2', title: 'Desktops', icon: 'lucide:pc-case', children: [] },
        ],
      },
      { id: 'cat-1-2', title: 'Smartphones', icon: 'lucide:smartphone', children: [] },
    ],
  },
  {
    id: 'cat-2',
    title: 'Clothing & Apparel',
    icon: 'lucide:shirt',
    children: [
      { id: 'cat-2-1', title: 'Men', icon: 'lucide:user', children: [] },
      { id: 'cat-2-2', title: 'Women', icon: 'lucide:user', children: [] },
    ],
  },
])

// Custom form schema for the Advanced Edit modal
const customFormSchema: IForm[] = [
  {
    name: 'title',
    label: 'Category Name',
    type: 'text',
    required: true,
    placeholder: 'Enter name...',
  },
  {
    name: 'icon',
    label: 'Category Icon',
    type: 'iconPicker',
  },
  {
    name: 'color',
    label: 'Label Color',
    type: 'color',
    value: '#6366f1',
  },
  {
    name: 'isActive',
    label: 'Is Active',
    type: 'switch',
    value: true,
  },
]

const eventLog = ref<any[]>([])

const logEvent = (type: string, payload: any) => {
  eventLog.value.unshift({ type, payload, time: new Date().toLocaleTimeString() })
  if (eventLog.value.length > 5) eventLog.value.pop()
}
</script>

<template>
  <div class="space-y-12 pb-20">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Category Manager</h2>
      <p class="mt-2 text-gray-500 max-w-2xl">
        A highly reusable, collapsible, and production-ready component for managing nested
        hierarchical data structures. Features inline creation for fast additions, drag-and-drop
        reordering, and integrated advanced form schemas for deeper CRUD operations.
      </p>
    </div>

    <DemoSection title="Hierarchy & Inline Creation" :code="sourceCode">
      <div class="flex flex-col xl:flex-row gap-6">
        <div class="flex-1 w-full max-w-2xl">
          <p class="text-sm text-gray-500 mb-4">
            Use the right-side hover actions to quick-add subcategories (➕), or edit Details (⚙️).
            Drag handles (⋮⋮) allow free reordering at all tree levels. Nodes seamlessly align
            without wasting space if they lack subcategories.
          </p>
          <CategoryManager
            size="md"
            v-model="categoryData"
            :formSchema="customFormSchema"
            @onAdd="(item) => logEvent('Added', item)"
            @onEdit="(item) => logEvent('Edited', item)"
            @onDelete="(item) => logEvent('Deleted', item)"
            @onReorder="() => logEvent('Reordered', 'Tree hierarchy updated')" />
        </div>

        <div class="w-full xl:w-80! flex flex-col gap-4">
          <div class="bg-card border border-border rounded-lg p-4 h-[300px] flex flex-col">
            <h4
              class="font-medium text-sm flex items-center gap-2 mb-3 border-b border-border pb-2">
              <Icon icon="lucide:activity" class="w-4 h-4 text-primary" />
              Event Log
            </h4>
            <div class="flex-1 overflow-y-auto space-y-2 text-xs">
              <div v-if="eventLog.length === 0" class="text-muted-foreground text-center mt-10">
                Perform an action to see events.
              </div>
              <div
                v-for="(log, i) in eventLog"
                :key="i"
                class="bg-muted/30 p-2 rounded border border-border/50">
                <div class="flex justify-between font-semibold text-primary mb-1">
                  <span>{{ log.type }}</span>
                  <span class="text-muted-foreground">{{ log.time }}</span>
                </div>
                <pre class="text-muted-foreground truncate">{{ log.payload }}</pre>
              </div>
            </div>
          </div>

          <div
            class="bg-card border border-border rounded-lg p-4 flex-1 flex flex-col min-h-[300px]">
            <h4
              class="font-medium text-sm flex items-center gap-2 mb-3 border-b border-border pb-2">
              <Icon icon="lucide:code" class="w-4 h-4 text-primary" />
              Current State Payload
            </h4>
            <div class="flex-1 overflow-y-auto bg-body p-2 rounded">
              <pre class="text-xs text-muted-foreground">{{
                JSON.stringify(categoryData, null, 2)
              }}</pre>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
