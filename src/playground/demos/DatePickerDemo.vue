<script setup lang="ts">
import DatePicker from '@/components/DatePicker.vue'
import { ref } from 'vue'

const date = ref<Date | null>(new Date())
const emptyDate = ref<Date | null>(null)
</script>

<template>
	<div class="space-y-10">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold">DatePicker</h2>
			<p class="text-gray-500">A component for selecting a date.</p>
		</div>

		<section class="space-y-8 max-w-sm">
			<!-- <div class="space-y-2">
				<h3 class="text-lg font-semibold">Basic</h3>
				<DatePicker
					v-model="date"
					mode="date" />
				<p class="text-xs text-gray-500">Value: {{ date }}</p>
			</div>

			<div class="space-y-2">
				<h3 class="text-lg font-semibold">Empty State</h3>
				<DatePicker
					v-model="emptyDate"
					mode="date"
					placeholder="Choose a date" />
			</div> -->

			<!-- DateTime Mode -->
			<div class="space-y-2">
				<h3 class="text-lg font-semibold">DateTime Mode</h3>
				<DatePicker
					v-model="date"
					mode="dateTime" />
				<p class="text-xs text-gray-500">Value: {{ date }}</p>
			</div>
		</section>
	</div>
</template>
