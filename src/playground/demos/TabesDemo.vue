<script setup lang="ts">
import { ref } from 'vue'
import { Tabes, TabesOption, TabesVariant } from '@/components/Tabes'

// Demo 1: Basic
const selectedMode = ref('write')
const basicOptions: TabesOption[] = [
	{ label: 'Write', value: 'write', icon: 'lucide:pen-line' },
	{ label: 'Preview', value: 'preview', icon: 'lucide:eye' },
	{ label: 'Settings', value: 'settings', icon: 'lucide:settings' },
]

// Demo 2: Block (Full Width)
const selectedPlan = ref('monthly')
const planOptions: TabesOption[] = [
	{ label: 'Monthly', value: 'monthly' },
	{ label: 'Yearly', value: 'yearly' },
]

// Demo 3: Sizes
const sizeVal = ref('small')
const sizeOptions: TabesOption[] = [
	{ label: 'Small', value: 'small' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Large', value: 'large' },
]

// Demo 4: Variants
const variantVal = ref('1')
const variantOptions: TabesOption[] = [
	{ label: 'Option 1', value: '1' },
	{ label: 'Option 2', value: '2' },
	{ label: 'Option 3', value: '3' },
]
</script>

<template>
	<div class="space-y-12">
		<!-- Header -->
		<div>
			<h2 class="text-2xl font-bold text-gray-900">
				Tabes
				<span
					class="text-xs font-normal text-gray-400 align-middle ml-2"
					>(Segmented Control)</span
				>
			</h2>
			<p class="mt-2 text-gray-500">
				A premium segmented control for switching modes or views.
			</p>
		</div>

		<!-- Basic Usage -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900">Basic Usage</h3>
			<div
				class="p-8 border rounded-xl bg-white shadow-sm flex flex-col items-center gap-6">
				<Tabes
					v-model="selectedMode"
					:options="basicOptions" />
				<div class="text-sm text-gray-500">
					Selected: {{ selectedMode }}
				</div>
			</div>
		</div>

		<!-- Block Usage -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900">
				Full Width (Block)
			</h3>
			<div
				class="p-8 border rounded-xl bg-white shadow-sm w-full max-w-md mx-auto">
				<Tabes
					v-model="selectedPlan"
					:options="planOptions"
					block />
			</div>
		</div>

		<!-- Sizes -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900">Sizes</h3>
			<div
				class="p-8 border rounded-xl bg-white shadow-sm flex flex-col items-center gap-6">
				<Tabes
					v-model="sizeVal"
					:options="sizeOptions"
					size="sm" />
				<Tabes
					v-model="sizeVal"
					:options="sizeOptions"
					size="md" />
				<Tabes
					v-model="sizeVal"
					:options="sizeOptions"
					size="lg" />
			</div>
		</div>

		<!-- Variants -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-gray-900">Variants</h3>
			<div
				class="flex flex-col w-full gap-8 p-8 border rounded-xl bg-white shadow-sm">
				<div class="space-y-2">
					<span class="text-xs font-medium text-gray-500 uppercase"
						>Surface (Default)</span
					>
					<Tabes
						v-model="variantVal"
						:options="variantOptions"
						variant="surface" />
				</div>

				<div class="space-y-2">
					<span class="text-xs font-medium text-gray-500 uppercase"
						>Primary</span
					>
					<Tabes
						v-model="variantVal"
						:options="variantOptions"
						variant="primary" />
				</div>

				<div class="space-y-2">
					<span class="text-xs font-medium text-gray-500 uppercase"
						>Secondary</span
					>
					<Tabes
						v-model="variantVal"
						:options="variantOptions"
						variant="secondary" />
				</div>

				<div class="space-y-2">
					<span class="text-xs font-medium text-gray-500 uppercase"
						>Outline</span
					>
					<Tabes
						v-model="variantVal"
						:options="variantOptions"
						variant="outline" />
				</div>

				<div class="space-y-2">
					<span class="text-xs font-medium text-gray-500 uppercase"
						>Danger</span
					>
					<Tabes
						v-model="variantVal"
						:options="variantOptions"
						variant="danger" />
				</div>

				<div class="space-y-2">
					<span class="text-xs font-medium text-gray-500 uppercase"
						>Success</span
					>
					<Tabes
						v-model="variantVal"
						:options="variantOptions"
						variant="success" />
				</div>

				<div class="space-y-2 md:col-span-2">
					<span class="text-xs font-medium text-gray-500 uppercase"
						>Line (Underline)</span
					>
					<Tabes
						v-model="variantVal"
						:options="variantOptions"
						variant="line" />
				</div>
			</div>
		</div>
	</div>
</template>
