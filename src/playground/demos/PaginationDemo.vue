<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@/components/Pagination'
import Icon from '@/components/Icon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './PaginationDemo.vue?raw'

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
		<DemoSection title="Full Featured" :code="sourceCode">
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
		</DemoSection>

		<!-- 2. Icon Navigation -->
		<DemoSection title="Icon Only Navigation" :code="sourceCode">
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page1"
					:total-pages="5"
					nav-type="icon"
					@change="(v) => handleChange('Icon Only', v)" />
			</div>
		</DemoSection>

		<!-- 3. Smart Truncation -->
		<DemoSection title="Smart Truncation" :code="sourceCode">
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page2"
					:total-pages="20"
					@change="(v) => handleChange('Truncation', v)" />
			</div>
		</DemoSection>

		<!-- 4. With Edges (First/Last) -->
		<DemoSection title="With First/Last Buttons" :code="sourceCode">
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page3"
					:total-pages="15"
					show-edges
					@change="(v) => handleChange('Edges', v)" />
			</div>
		</DemoSection>

		<!-- 5. Disabled -->
		<DemoSection title="Disabled State" :code="sourceCode">
			<div
				class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
				<Pagination
					v-model:current-page="page4"
					:total-pages="10"
					disabled />
			</div>
		</DemoSection>
	</div>
</template>
