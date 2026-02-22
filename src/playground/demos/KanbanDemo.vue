<script setup lang="ts">
import { ref } from 'vue'
import { Kanban, type KanbanColumn, type KanbanLoadDataResult } from '@/components/Kanban'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './KanbanDemo.vue?raw'

// --- Demo 1: Basic ---
const columns = ref<KanbanColumn[]>([
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
])

const data = ref({
  todo: Array.from({ length: 10 }).map((_, i) => ({
    id: `t${i}`,
    title: `Task Todo ${i + 1}`,
    status: 'Pending',
  })),
  'in-progress': Array.from({ length: 5 }).map((_, i) => ({
    id: `i${i}`,
    title: `Task In Progress ${i + 1}`,
    status: 'Active',
  })),
  done: Array.from({ length: 3 }).map((_, i) => ({
    id: `d${i}`,
    title: `Task Done ${i + 1}`,
    status: 'Completed',
  })),
})

// --- Demo 2: Lazy Loading ---
const columnsLazy = ref<KanbanColumn[]>([
  { id: 'backlog', title: 'Backlog' },
  { id: 'review', title: 'Review' },
])

const loadData = async (columnId: string | number, page: number): Promise<KanbanLoadDataResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = Array.from({ length: 10 }).map((_, i) => ({
        id: `${columnId}-p${page}-${i}`,
        title: `Task ${columnId} - Page ${page} - #${i + 1}`,
      }))
      resolve({
        items,
        pageInfo: {
          currentPage: page,
          totalPages: 3,
          totalItems: 30,
        },
      })
    }, 1000)
  })
}

// --- Demo 3: Slots ---
const columnsSlots = ref<KanbanColumn[]>([
  { id: 'ideas', title: 'Ideas' },
  { id: 'drafts', title: 'Drafts' },
])

const dataSlots = ref({
  ideas: [
    { id: 'idea1', title: 'Add dark mode' },
    { id: 'idea2', title: 'Improve accessibility' },
  ],
  drafts: [{ id: 'draft1', title: 'Release notes v2.0' }],
})

const handleChange = (e: any) => {
  console.log('Kanban changed:', e)
}

const handleAddTask = (columnId: string | number) => {
  alert(`Trigger add task for column: ${columnId}`)
}
</script>

<template>
  <div class="space-y-12 pb-20">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Kanban</h2>
      <p class="mt-2 text-gray-500">
        Production-ready drag and drop boards with pagination and lazy loading.
      </p>
    </div>

    <DemoSection title="Basic Kanban (Static Data)" :code="sourceCode">
      <div class="h-[500px]">
        <Kanban :columns="columns" v-model:data="data" @change="handleChange">
          <template #item="{ item }">
            <div
              class="bg-body p-3 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing hover:border-primary transition-colors">
              <h4 class="font-medium text-sm text-foreground">{{ item.title }}</h4>
              <div class="mt-2 text-xs text-muted-foreground">{{ item.status }}</div>
            </div>
          </template>
        </Kanban>
      </div>
    </DemoSection>

    <DemoSection title="With Prepend & Append Slots" :code="sourceCode">
      <div class="h-[500px]">
        <Kanban
          :columns="columnsSlots"
          v-model:data="dataSlots"
          group="slots-group"
          @change="handleChange">
          <template #prepend-item="{ column }">
            <div class="mb-3 px-1">
              <Button
                variant="outline"
                size="sm"
                class="w-full border-dashed text-muted-foreground hover:text-foreground hover:border-primary"
                icon="lucide:plus"
                @click="handleAddTask(column.id)">
                Add Task
              </Button>
            </div>
          </template>

          <template #item="{ item }">
            <div
              class="bg-body p-3 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing hover:border-primary transition-colors">
              <h4 class="font-medium text-sm text-foreground">{{ item.title }}</h4>
            </div>
          </template>

          <template #append-item="{ items }">
            <div
              class="mt-4 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
              End of list ({{ items.length }} items)
            </div>
          </template>
        </Kanban>
      </div>
    </DemoSection>

    <DemoSection title="Lazy Loaded Columns (Infinite Scroll)" :code="sourceCode">
      <div class="h-[500px]">
        <Kanban
          :columns="columnsLazy"
          :load-data="loadData"
          group="lazy-kanban"
          @change="handleChange">
          <template #item="{ item }">
            <div
              class="bg-body p-3 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing hover:border-primary transition-colors">
              <h4 class="font-medium text-sm text-foreground">{{ item.title }}</h4>
            </div>
          </template>
        </Kanban>
      </div>
      <p class="mt-4 text-sm text-muted-foreground italic">
        Scroll to the bottom of the Backlog or Review columns to trigger lazy loading of the next
        page. Notice the minimal spinner at the bottom without shifting existing items.
      </p>
    </DemoSection>
  </div>
</template>
