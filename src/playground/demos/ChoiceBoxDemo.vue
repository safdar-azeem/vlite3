<script setup lang="ts">
import { ref } from 'vue'
import { ChoiceBox, type ChoiceBoxOption } from '@/components/ChoiceBox'
import Icon from '@/components/Icon.vue'

const plans: ChoiceBoxOption[] = [
	{
		id: 'basic',
		title: 'Basic Plan',
		description:
			'Perfect for starters. Includes basic features and community support.',
		icon: 'lucide:box',
		badge: 'Free',
	},
	{
		id: 'pro',
		title: 'Pro Plan',
		description:
			'For growing businesses. Advanced analytics and priority support.',
		icon: 'lucide:zap',
		badge: 'Popular',
	},
	{
		id: 'enterprise',
		title: 'Enterprise',
		description: 'Unlimited possibilities for large scale organizations.',
		icon: 'lucide:building-2',
	},
]

const features: ChoiceBoxOption[] = [
	{
		id: 'seo',
		title: 'SEO Optimization',
		description: 'Rank higher on search engines.',
		icon: 'lucide:search',
	},
	{
		id: 'analytics',
		title: 'Advanced Analytics',
		description: 'Know your audience better.',
		icon: 'lucide:bar-chart',
	},
	{
		id: 'security',
		title: 'Enhanced Security',
		description: 'Keep your data safe.',
		icon: 'lucide:shield-check',
	},
	{
		id: 'backup',
		title: 'Daily Backups',
		description: 'Never lose your data.',
		icon: 'lucide:database',
		disabled: true,
	},
]

const selectedPlan = ref<string>('pro')
const selectedFeatures = ref<string[]>(['seo', 'security'])
const layoutVal = ref('grid')

const handleChange = (label: string, val: any) => {
	console.log(`[${label}] Changed:`, val)
}
</script>

<template>
	<div class="space-y-8 p-4 max-w-4xl mx-auto">
		<div>
			<h2 class="text-2xl font-bold mb-2">ChoiceBox Component</h2>
			<p class="text-gray-500 mb-6">
				A rich selection component for presenting options with titles,
				descriptions, and icons.
			</p>
		</div>

		<!-- 1. Single Select (Plans) -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:check-circle"
					class="text-primary" />
				Single Selection (Radio Style)
			</h3>
			<div class="p-6 border rounded-xl bg-gray-50/50">
				<ChoiceBox
					v-model="selectedPlan"
					:options="plans"
					title="Choose your plan"
					description="Select the plan that fits your needs best."
					:grid="3"
					@change="(v) => handleChange('Plan', v)" />
				<div
					class="mt-6 text-sm text-gray-600 bg-white p-3 rounded border">
					Selected Plan ID: <strong>{{ selectedPlan }}</strong>
				</div>
			</div>
		</section>

		<!-- 2. Multi Select (Features) -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:check-square"
					class="text-primary" />
				Multi Selection (Checkbox Style)
			</h3>
			<div class="p-6 border rounded-xl bg-gray-50/50">
				<ChoiceBox
					v-model="selectedFeatures"
					:options="features"
					multiple
					title="Add-on Features"
					description="Enhance your workspace with these powerful tools."
					:grid="2"
					@change="(v) => handleChange('Features', v)" />
				<div
					class="mt-6 text-sm text-gray-600 bg-white p-3 rounded border">
					Selected Features: <strong>{{ selectedFeatures }}</strong>
				</div>
			</div>
		</section>

		<!-- 3. Layout Variations -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:layout-grid"
					class="text-primary" />
				Layout Options
			</h3>
			<div class="p-6 border rounded-xl bg-gray-50/50 space-y-6">
				<!-- Stacked list -->
				<div>
					<p class="text-sm font-medium mb-3">
						Vertical List (Grid = 1)
					</p>
					<ChoiceBox
						v-model="layoutVal"
						:options="[
							{
								id: 'grid',
								title: 'Grid Layout',
								description: 'Items arranged in columns',
								icon: 'lucide:layout-grid',
							},
							{
								id: 'list',
								title: 'List Layout',
								description: 'Items stacked vertically',
								icon: 'lucide:list',
							},
						]"
						:grid="1" />
				</div>
			</div>
		</section>
	</div>
</template>
