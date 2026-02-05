<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@/components/Pagination'
import Icon from '@/components/Icon.vue'

const page1 = ref(1)
const page2 = ref(5)
const page3 = ref(1)
const page4 = ref(1)
const page5 = ref(1)

// Full Featured state
const itemsPerPage = ref(10)
const totalItems = 100 // Hypothetical total
// const totalPages is derived in real apps, but here we just mock it or calculate
// totalPages = Math.ceil(totalItems / itemsPerPage.value)

const handleChange = (label: string, val: number) => {
	console.log(`[${label}] Page changed to:`, val)
}

const handlePerPageChange = (val: number) => {
	console.log('[Full Featured] Items per page changed to:', val)
	// In real app, you'd fetch new data and update total pages if needed
}
</script>

<template>
	<div class="space-y-8 p-4 max-w-4xl mx-auto">
		<div>
			<h2 class="text-2xl font-bold mb-2">Pagination Component</h2>
			<p class="text-gray-500 mb-6">
				Navigate through large lists of data with ease. Now with page
				info, items per page selector, and configurable navigation
				styles.
			</p>
		</div>

		<!-- 1. Full Featured -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:star"
					class="text-primary" />
				Full Featured
			</h3>
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page5"
					v-model:items-per-page="itemsPerPage"
					:total-pages="10"
					show-items-per-page
					show-edges
					@change="(v) => handleChange('Full', v)"
					@change:items-per-page="handlePerPageChange" />
			</div>
		</section>

		<!-- 2. Icon Navigation -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:arrow-right-circle"
					class="text-primary" />
				Icon Only Navigation
			</h3>
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page1"
					:total-pages="5"
					nav-type="icon"
					@change="(v) => handleChange('Icon Only', v)" />
			</div>
		</section>

		<!-- 3. Smart Truncation -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:more-horizontal"
					class="text-primary" />
				Smart Truncation
			</h3>
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page2"
					:total-pages="20"
					@change="(v) => handleChange('Truncation', v)" />
			</div>
		</section>

		<!-- 4. With Edges (First/Last) -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:chevrons-left-right"
					class="text-primary" />
				With First/Last Buttons
			</h3>
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page3"
					:total-pages="15"
					show-edges
					@change="(v) => handleChange('Edges', v)" />
			</div>
		</section>

		<!-- 5. Disabled -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:ban"
					class="text-primary" />
				Disabled State
			</h3>
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page4"
					:total-pages="10"
					disabled />
			</div>
		</section>
	</div>
</template>
