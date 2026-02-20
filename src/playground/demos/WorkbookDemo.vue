<script setup lang="ts">
import { ref } from 'vue'
import { Workbook, WorkbookSheet, AddButtonPosition } from '@/components/Workbook'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import { Dropdown } from '@/components/Dropdown'
import Switch from '@/components/Switch.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './WorkbookDemo.vue?raw'

// --- Demo 1: Basic Usage ---
const activeSheet1 = ref('1')
const sheets1 = ref<WorkbookSheet[]>([
  { id: '1', title: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { id: '2', title: 'Projects', icon: 'lucide:folder-kanban' },
  { id: '3', title: 'Settings', icon: 'lucide:settings' },
])

const handleAdd1 = () => {
  const newId = Date.now().toString()
  sheets1.value.push({ id: newId, title: 'New Sheet', icon: 'lucide:file' })
  activeSheet1.value = newId
}

// --- Demo 2: Full Featured (Editable, Draggable, Attached) ---
const activeSheet2 = ref('doc1')
const sheets2 = ref<WorkbookSheet[]>([
  { id: 'doc1', title: 'Project Proposal.docx', icon: 'lucide:file-text' },
  { id: 'sheet1', title: 'Budget 2024.xlsx', icon: 'lucide:sheet' },
  { id: 'pres1', title: 'Q1 Review.pptx', icon: 'lucide:presentation' },
])
const addButtonPos = ref<AddButtonPosition>('attached')
const allowIconChange = ref(true)

const handleAdd2 = () => {
  const newId = Date.now().toString()
  sheets2.value.push({ id: newId, title: 'Untitled', icon: 'lucide:file' })
  activeSheet2.value = newId
}

const handleDelete2 = (id: string) => {
  const idx = sheets2.value.findIndex((t) => t.id === id)
  if (idx !== -1) {
    sheets2.value.splice(idx, 1)
    // Select nearest
    if (activeSheet2.value === id && sheets2.value.length > 0) {
      activeSheet2.value = sheets2.value[Math.max(0, idx - 1)].id
    }
  }
}

const handleDuplicate2 = (id: string) => {
  const original = sheets2.value.find((t) => t.id === id)
  if (original) {
    const newId = Date.now().toString()
    const newSheet = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
    }
    sheets2.value.push(newSheet)
    activeSheet2.value = newId
  }
}

// --- Demo 3: Overflow Handling ---
const activeSheet3 = ref('1')
const sheets3 = ref<WorkbookSheet[]>(
  Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    title: `Sheet ${i + 1}`,
    icon: 'lucide:file',
  }))
)

const handleAdd3 = () => {
  const newId = String(sheets3.value.length + 1)
  sheets3.value.push({ id: newId, title: `Sheet ${newId}`, icon: 'lucide:file' })
  activeSheet3.value = newId
}

// --- Demo 4: Slots & Custom Content ---
// Removed as it was identical logic
</script>

<template>
  <div class="space-y-12">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Workbook</h2>
      <p class="mt-2 text-gray-500">
        Dynamic, Excel-like workbook with drag & drop, renaming, and overflow support.
      </p>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Basic Usage</h3>
      </div>
      <div class="p-6 border rounded-xl bg-white shadow-sm overflow-hidden">
        <Workbook
          v-model="activeSheet1"
          v-model:sheets="sheets1"
          :editable="false"
          :draggable="false"
          add-button-position="fixed-right"
          @add="handleAdd1">
          <div
            class="p-8 bg-gray-50/50 rounded-lg border border-dashed text-center text-gray-500 mt-4 h-32 flex items-center justify-center">
            Content for sheet:
            <strong class="ml-1 text-gray-700">{{ activeSheet1 }}</strong>
          </div>
        </Workbook>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Full Interactive (Draggable, Editable)</h3>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Add Button:</span>
          <Dropdown
            :selected="addButtonPos"
            :options="[
              { label: 'Fixed Right', value: 'fixed-right' },
              { label: 'Attached', value: 'attached' },
            ]"
            @onSelect="(opt) => (addButtonPos = opt.value)" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Allow Icon Change:</span>
          <Switch v-model="allowIconChange" />
        </div>
      </div>
      <div class="p-6 border rounded-xl bg-white shadow-sm overflow-hidden">
        <Workbook
          v-model="activeSheet2"
          confirmDelete
          :editable="true"
          :draggable="true"
          @add="handleAdd2"
          @delete="handleDelete2"
          v-model:sheets="sheets2"
          :add-button-position="addButtonPos"
          :allow-icon-change="allowIconChange"
          @duplicate="handleDuplicate2">
          <template #left-addons>
            <div
              class="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold mr-2 ml-1 shadow-sm">
              B
            </div>
          </template>

          <template #right-addons>
            <Button size="xs" variant="ghost" icon="lucide:more-horizontal" />
          </template>

          <div class="mt-4 border rounded-lg h-64 bg-white relative">
            <div class="border-b p-2 flex gap-2">
              <Button size="xs" variant="ghost" icon="lucide:bold" />
              <Button size="xs" variant="ghost" icon="lucide:italic" />
              <Button size="xs" variant="ghost" icon="lucide:align-left" />
            </div>
            <div class="p-8 text-gray-500">
              Editing document:
              <span class="text-primary font-medium">{{
                sheets2.find((t) => t.id === activeSheet2)?.title
              }}</span>
              <p class="mt-2 text-sm text-gray-400">
                Try renaming the sheet by double-clicking it!
              </p>
            </div>
          </div>
        </Workbook>
      </div>
    </div>
  </div>

  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Overflow Handling</h3>
    </div>
    <div class="p-6 border rounded-xl bg-white shadow-sm overflow-hidden">
      <Workbook
        v-model="activeSheet3"
        v-model:sheets="sheets3"
        :editable="true"
        add-button-position="attached"
        @add="handleAdd3">
        <div
          class="p-8 bg-gray-50/50 rounded-lg border border-dashed text-center text-gray-500 mt-4">
          Selected: {{ activeSheet3 }}
        </div>
      </Workbook>
    </div>
  </div>
</template>
