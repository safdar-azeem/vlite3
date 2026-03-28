<script setup lang="ts">
import { shallowRef } from 'vue'
import { Kanban, type KanbanColumn, type KanbanLoadDataResult } from '@/components/Kanban'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './KanbanDemo.vue?raw'

// --- Demo 1: Auto-Calculation (Recommended Flat Array) ---
const columnsFlat = shallowRef<KanbanColumn[]>([
	{ id: 'todo', title: 'To Do' },
	{ id: 'in-progress', title: 'In Progress' },
	{ id: 'done', title: 'Done' },
])

const flatData = shallowRef([
	{ id: 't1', title: 'Task 1', status: 'todo', position: 1024 },
	{ id: 't2', title: 'Task 2', status: 'todo', position: 2048 },
	{ id: 't3', title: 'Task 3', status: 'in-progress', position: 1024 },
])

const handleItemMoved = (itemId: string, newStatus: string, newPosition: number, item: any) => {
	console.log(`🚀 API Sync: Update Item ${itemId}`, { status: newStatus, position: newPosition })
	console.log(`Optimistic local item is already updated:`, item)
}

// --- Demo 2: Lazy Loading ---
const columnsLazy = shallowRef<KanbanColumn[]>([
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

// --- Demo 3: Slots (Legacy grouped data usage) ---
const columnsSlots = shallowRef<KanbanColumn[]>([
	{ id: 'ideas', title: 'Ideas' },
	{ id: 'drafts', title: 'Drafts' },
])

const dataSlots = shallowRef({
	ideas: [
		{ id: 'idea1', title: 'Add dark mode' },
		{ id: 'idea2', title: 'Improve accessibility' },
	],
	drafts: [{ id: 'draft1', title: 'Release notes v2.0' }],
})

const handleAddTask = (columnId: string | number) => {
	alert(`Trigger add task for column: ${columnId}`)
}

// --- Demo 4: Disabled Board & Disabled Items ---
// The "Archived" column has disabled:true — nothing can enter or leave it.
// In the "Active" column, items whose `locked` flag is true cannot be moved.
const columnsDisabled = shallowRef<KanbanColumn[]>([
	{ id: 'active', title: 'Active' },
	{ id: 'archived', title: 'Archived', disabled: true },
])

const disabledData = shallowRef([
	{ id: 'd1', title: 'Normal Task — drag me freely', status: 'active', position: 1024, locked: false },
	{ id: 'd2', title: 'Locked Item — cannot be moved', status: 'active', position: 2048, locked: true },
	{ id: 'd3', title: 'Another Normal Task', status: 'active', position: 3072, locked: false },
	{ id: 'd4', title: 'Archived Task A', status: 'archived', position: 1024, locked: false },
	{ id: 'd5', title: 'Archived Task B', status: 'archived', position: 2048, locked: false },
])

// Item-level disable predicate: items with locked:true cannot be dragged
const isItemDisabled = (item: any): boolean => item.locked === true
</script>

<template>
	<div class="space-y-12 pb-20">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">Kanban</h2>
			<p class="mt-2 text-gray-500">
				Production-ready drag and drop boards with pagination, intelligent positioning, and lazy loading.
			</p>
		</div>

		<DemoSection title="Smart Board (Flat Array & Auto Calculate)" :code="sourceCode">
			<div class="h-[500px]">
				<Kanban 
					:raw-data="flatData" 
					group-key="status"
					position-key="position"
					:columns="columnsFlat" 
					@item-moved="handleItemMoved"
				>
					<template #item="{ item }">
						<div
							class="bg-body p-3 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing hover:border-primary transition-colors flex flex-col gap-2">
							<h4 class="font-medium text-sm text-foreground">{{ item.title }}</h4>
							<div class="flex justify-between items-center text-xs text-muted-foreground">
								<span>{{ item.status }}</span>
								<span class="font-mono bg-muted/50 px-1 py-0.5 rounded">Pos: {{ item.position }}</span>
							</div>
						</div>
					</template>
				</Kanban>
			</div>
			<p class="mt-4 text-sm text-muted-foreground italic">
				Try dragging tasks. Check the console to see the exact API payload. The Kanban handles fractional indexing math internally!
			</p>
		</DemoSection>

		<DemoSection title="With Prepend & Append Slots" :code="sourceCode">
			<div class="h-[500px]">
				<Kanban
					:columns="columnsSlots"
					v-model:data="dataSlots"
					group="slots-group">
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
					group="lazy-kanban">
					<template #item="{ item }">
						<div
							class="bg-body p-3 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing hover:border-primary transition-colors">
							<h4 class="font-medium text-sm text-foreground">{{ item.title }}</h4>
						</div>
					</template>
				</Kanban>
			</div>
			<p class="mt-4 text-sm text-muted-foreground italic">
				Scroll to the bottom of the Backlog or Review columns to trigger lazy loading of the next page. Notice the minimal spinner at the bottom without shifting existing items.
			</p>
		</DemoSection>

		<!-- Demo 4: Disabled Board Column & Disabled Individual Items -->
		<DemoSection title="Disabled Board & Disabled Items" :code="sourceCode">
			<div class="h-[500px]">
				<Kanban
					:raw-data="disabledData"
					group-key="status"
					position-key="position"
					:columns="columnsDisabled"
					:is-item-disabled="isItemDisabled"
					group="disabled-kanban"
					@item-moved="handleItemMoved">
					<template #item="{ item, isDisabled }">
						<div
							:class="[
								'bg-body p-3 rounded-lg shadow-sm border transition-colors flex flex-col gap-1',
								isDisabled
									? 'border-border opacity-60 cursor-not-allowed select-none'
									: 'border-border cursor-grab active:cursor-grabbing hover:border-primary',
							]">
							<h4 class="font-medium text-sm text-foreground">{{ item.title }}</h4>
							<div class="flex gap-2 items-center text-xs text-muted-foreground">
								<span
									v-if="item.locked"
									class="inline-flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-medium">
									🔒 Locked
								</span>
							</div>
						</div>
					</template>
				</Kanban>
			</div>
			<p class="mt-4 text-sm text-muted-foreground italic">
				The <strong>Archived</strong> column is fully locked — items cannot be dragged in or out (board-level).
				The <strong>"Locked Item"</strong> in Active cannot be dragged at all (item-level).
				All other tasks are freely movable between non-disabled columns.
			</p>
		</DemoSection>
	</div>
</template>
