<script setup lang="ts">
import { ref, computed } from 'vue'
import {
	Heatmap,
	type HeatmapDataPoint,
	type HeatmapColorScheme,
} from '@/components/Heatmap'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'
import { Dropdown } from '@/components/Dropdown'


const colorScheme = ref<HeatmapColorScheme>('github')
const showLegend = ref(true)
const showLabels = ref(false)
const interactive = ref(true)

const responsive = ref(true)
const minValue = ref<number | undefined>(undefined)
const maxValue = ref<number | undefined>(undefined)
const containerWidth = ref(800)
const containerHeight = ref(400)

const generateRandomData = (
	count: number,
	maxVal: number = 10,
): HeatmapDataPoint[] => {
	const data: HeatmapDataPoint[] = []
	for (let i = 0; i < count; i++) {
		data.push({
			x: i % 7,
			y: Math.floor(i / 7),
			value: Math.floor(Math.random() * maxVal),
		})
	}
	return data
}

const generateSequentialData = (days: number): HeatmapDataPoint[] => {
	const data: HeatmapDataPoint[] = []
	const today = new Date()
	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(today)
		date.setDate(date.getDate() - i)
		data.push({
			x: i,
			y: 0,
			value: Math.floor(Math.random() * 10),
			date: date.toISOString(),
			tooltip: `${date.toLocaleDateString()}: ${Math.floor(Math.random() * 10)} activities`,
		})
	}
	return data
}

const generateActivityData = (): HeatmapDataPoint[] => {
	const data: HeatmapDataPoint[] = []
	const today = new Date()
	const sixMonthsAgo = new Date(today)
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

	let currentDate = new Date(sixMonthsAgo)
	let weekIndex = 0

	while (currentDate <= today) {
		const dayOfWeek = currentDate.getDay()
		const value = Math.floor(Math.random() * 5)
		const dateStr = currentDate.toISOString()

		data.push({
			x: weekIndex,
			y: dayOfWeek,
			value,
			date: dateStr,
			tooltip: `${currentDate.toLocaleDateString()}: ${value} tasks completed`,
		})

		currentDate.setDate(currentDate.getDate() + 1)
		if (dayOfWeek === 6) {
			weekIndex++
		}
	}

	return data
}

const generateHabitData = (): HeatmapDataPoint[] => {
	const data: HeatmapDataPoint[] = []
	const today = new Date()
	const itemsPerRow = 5

	for (let i = 89; i >= 0; i--) {
		const date = new Date(today)
		date.setDate(date.getDate() - i)
		const x = i % itemsPerRow
		const y = Math.floor(i / itemsPerRow)
		const value = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0

		data.push({
			x,
			y,
			value,
			date: date.toISOString(),
			completed: value > 0,
			tooltip: `${date.toLocaleDateString()}: ${value > 0 ? `${value} completion(s)` : 'No activity'}`,
		})
	}

	return data
}

const randomData = ref(generateRandomData(42, 10))
const sequentialData = ref(generateSequentialData(90))
const activityData = ref(generateActivityData())
const habitData = ref(generateHabitData())

const refreshData = (type: 'random' | 'sequential' | 'activity' | 'habit') => {
	if (type === 'random') {
		randomData.value = generateRandomData(42, 10)
	} else if (type === 'sequential') {
		sequentialData.value = generateSequentialData(90)
	} else if (type === 'activity') {
		activityData.value = generateActivityData()
	} else if (type === 'habit') {
		habitData.value = generateHabitData()
	}
}

const handleCellClick = (cell: any, event: MouseEvent) => {
	console.log('Cell clicked:', cell)
}

const handleCellHover = (cell: any, event: MouseEvent) => {
	if (cell) {
		console.log('Cell hovered:', cell)
	}
}

const customTooltipFormatter = (cell: any, dataPoint: HeatmapDataPoint) => {
	if (dataPoint.date) {
		const date = new Date(dataPoint.date)
		return `${date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})}: ${cell.value} activities`
	}
	return `Value: ${cell.value} at (${cell.x}, ${cell.y})`
}

const customColorScheme = ref([
	'#f0f0f0',
	'#c6e48b',
	'#7bc96f',
	'#239a3b',
	'#196127',
])
</script>

<template>
	<div class="space-y-10">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold">Heatmap</h2>
			<p class="text-gray-500">
				Interactive heatmap component for visualizing data intensity
				across a grid or sequential layout.
			</p>
		</div>

		<!-- Controls -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Configuration</h3>
			<div
				class="p-6 border rounded-xl bg-gray-50/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div>
					<Label>Color Scheme</Label>
					<Dropdown
						:selected="colorScheme"
						:options="[
							{ label: 'GitHub', value: 'github' },
							{ label: 'Green', value: 'green' },
							{ label: 'Blue', value: 'blue' },
							{ label: 'Red', value: 'red' },
							{ label: 'Purple', value: 'purple' },
							{ label: 'Orange', value: 'orange' },
							{ label: 'Grayscale', value: 'grayscale' },
						]"
						@onSelect="(opt) => (colorScheme = opt.value)" />
				</div>

				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							v-model="showLegend"
							id="showLegend"
							class="rounded" />
						<Label
							for="showLegend"
							class="cursor-pointer"
							>Show Legend</Label
						>
					</div>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							v-model="showLabels"
							id="showLabels"
							class="rounded" />
						<Label
							for="showLabels"
							class="cursor-pointer"
							>Show Labels</Label
						>
					</div>
				</div>


			</div>
		</section>

		<!-- Demo 1: GitHub-style Activity Heatmap -->
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">
					GitHub-style Activity Heatmap
				</h3>
				<Button
					size="sm"
					variant="outline"
					icon="lucide:refresh-cw"
					@click="refreshData('activity')">
					Refresh
				</Button>
			</div>
			<div class="p-6 border rounded-xl bg-white h-[300px]">
				<Heatmap
					:data="activityData"
					layout="grid"
					:color-config="{ scheme: colorScheme }"
					:grid-config="
						responsive
							? { rows: 7, gap: 3 }
							: { rows: 7, cellSize: 12, gap: 3 }
					"
					:tooltip-config="{
						enabled: true,
						formatter: customTooltipFormatter,
					}"
					:show-legend="showLegend"
					:show-labels="showLabels"
					:interactive="interactive"
					:responsive="responsive"
					@cell-click="handleCellClick"
					@cell-hover="handleCellHover" />
			</div>
		</section>

		<!-- Demo 2: 90-Day Habit Progress -->
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">90-Day Habit Progress</h3>
				<Button
					size="sm"
					variant="outline"
					icon="lucide:refresh-cw"
					@click="refreshData('habit')">
					Refresh
				</Button>
			</div>
			<div class="p-6 border rounded-xl bg-white h-[300px]">
				<Heatmap
					:data="habitData"
					layout="sequential"
					:color-config="{ scheme: 'green', emptyColor: '#e5e7eb' }"
					:sequential-config="
						responsive
							? { itemsPerRow: 5, gap: 4 }
							: { itemsPerRow: 5, cellSize: 14, gap: 4 }
					"
					:tooltip-config="{ enabled: true }"
					:show-legend="showLegend"
					:interactive="interactive"
					:responsive="responsive"
					@cell-click="handleCellClick" />
			</div>
		</section>

		<!-- Demo 3: Sequential Timeline -->
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">
					Sequential Timeline (90 Days)
				</h3>
				<Button
					size="sm"
					variant="outline"
					icon="lucide:refresh-cw"
					@click="refreshData('sequential')">
					Refresh
				</Button>
			</div>
			<div class="p-6 border rounded-xl bg-white h-[300px]">
				<Heatmap
					:data="sequentialData"
					layout="sequential"
					:color-config="{ scheme: 'blue' }"
					:sequential-config="
						responsive
							? { itemsPerRow: 7, gap: 3 }
							: { itemsPerRow: 7, cellSize: 12, gap: 3 }
					"
					:tooltip-config="{ enabled: true }"
					:show-legend="showLegend"
					:interactive="interactive"
					:responsive="responsive"
					@cell-click="handleCellClick" />
			</div>
		</section>

		<!-- Demo 4: Responsive Container Demo -->
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">
					Responsive Container (Resize to see it adapt)
				</h3>
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<Label class="text-sm">Width:</Label>
						<input
							type="range"
							v-model.number="containerWidth"
							min="300"
							max="1200"
							class="w-32" />
						<span class="text-xs text-gray-500 w-16"
							>{{ containerWidth }}px</span
						>
					</div>
					<div class="flex items-center gap-2">
						<Label class="text-sm">Height:</Label>
						<input
							type="range"
							v-model.number="containerHeight"
							min="200"
							max="800"
							class="w-32" />
						<span class="text-xs text-gray-500 w-16"
							>{{ containerHeight }}px</span
						>
					</div>
				</div>
			</div>
			<div
				class="border rounded-xl bg-white overflow-hidden transition-all duration-300"
				:style="{
					width: `${containerWidth}px`,
					height: `${containerHeight}px`,
				}">
				<Heatmap
					:data="activityData"
					layout="grid"
					:color-config="{ scheme: 'github' }"
					:grid-config="{ rows: 7, gap: 3 }"
					:tooltip-config="{
						enabled: true,
						formatter: customTooltipFormatter,
					}"
					:show-legend="showLegend"
					:interactive="interactive"
					:responsive="true"
					class="h-full"
					@cell-click="handleCellClick" />
			</div>
			<p class="text-xs text-gray-500">
				The heatmap automatically adjusts cell size to fit the
				container. Try resizing the window or adjusting the sliders
				above.
			</p>
		</section>

		<!-- Demo 5: Custom Grid -->
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">Custom Grid Layout</h3>
				<Button
					size="sm"
					variant="outline"
					icon="lucide:refresh-cw"
					@click="refreshData('random')">
					Refresh
				</Button>
			</div>
			<div class="p-6 border rounded-xl bg-white h-[300px]">
				<Heatmap
					:data="randomData"
					layout="grid"
					:color-config="{ scheme: colorScheme }"
					:grid-config="
						responsive
							? { rows: 6, cols: 7, gap: 4 }
							: { rows: 6, cols: 7, cellSize: 16, gap: 4 }
					"
					:tooltip-config="{ enabled: true }"
					:show-legend="showLegend"
					:show-labels="showLabels"
					:interactive="interactive"
					:responsive="responsive"
					@cell-click="handleCellClick" />
			</div>
		</section>

		<!-- Demo 6: Custom Color Scheme -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Custom Color Scheme</h3>
			<div class="p-6 border rounded-xl bg-white h-[300px]">
				<Heatmap
					:data="randomData"
					layout="grid"
					:color-config="{
						scheme: 'custom',
						colors: customColorScheme,
					}"
					:grid-config="
						responsive
							? { rows: 6, cols: 7, gap: 4 }
							: { rows: 6, cols: 7, cellSize: 16, gap: 4 }
					"
					:tooltip-config="{ enabled: true }"
					:show-legend="showLegend"
					:interactive="interactive"
					:responsive="responsive"
					@cell-click="handleCellClick" />
			</div>
		</section>

		<!-- Demo 7: With Min/Max Range -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">With Custom Min/Max Range</h3>
			<div class="p-6 border rounded-xl bg-white h-[300px]">
				<Heatmap
					:data="randomData"
					layout="grid"
					:color-config="{ scheme: 'purple' }"
					:grid-config="
						responsive
							? { rows: 6, cols: 7, gap: 4 }
							: { rows: 6, cols: 7, cellSize: 16, gap: 4 }
					"
					:min-value="2"
					:max-value="8"
					:tooltip-config="{ enabled: true }"
					:show-legend="showLegend"
					:interactive="interactive"
					:responsive="responsive"
					@cell-click="handleCellClick" />
				<p class="mt-2 text-xs text-gray-500">
					Values are normalized between 2 and 8 instead of the actual
					min/max.
				</p>
			</div>
		</section>


	</div>
</template>
