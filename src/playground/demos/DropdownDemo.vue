<script setup lang="ts">
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import { ref, computed } from 'vue'

const val1 = ref('1')

const nestedVal = ref({})

const nestedOptions = [
	{ label: 'Diff', value: 'diff', key: 'diff' },
	{ label: 'Repo', value: 'repo', key: 'repo' },
	{ label: '---', value: 'divider' }, // Make sure dividers have unique value/key if needed, or just handle in rendering
	{
		label: 'Stash',
		key: 'stash',
		children: [
			{ label: 'Apply Stash', value: 'apply' },
			{ label: 'Drop Stash', value: 'drop' },
			{
				label: 'Advanced',
				key: 'advanced',
				children: [
					{ label: 'Force Push', value: 'force-push' },
					{
						label: 'Delete Branch',
						value: 'delete-branch',
						class: 'text-danger',
					},
				],
			},
		],
	},
]

const config = ref<Record<string, any>>({
	size: '2',
	style: 'border',
})

const recursiveOptions = [
	{
		label: 'Display',
		key: 'display',
		value: 'grid',
	},
	{
		label: 'Size',
		key: 'size',
		children: [
			{ label: 'Small (1)', value: '1' },
			{ label: 'Medium (2)', value: '2' },
			{ label: 'Large (3)', value: '3' },
		],
	},
	{
		label: 'Style',
		key: 'style',
		children: [
			{ label: 'Border', value: 'border' },
			{ label: 'Fill', value: 'fill' },
			{ label: 'Ghost', value: 'ghost' },
		],
	},
	{ label: '---', value: 'divider' },
	{
		label: 'Stash',
		key: 'stash',
		children: [
			{ label: 'Apply', value: 'apply' },
			{
				label: 'Advanced',
				key: 'advanced',
				children: [
					{
						label: 'Delete Branch',
						value: 'delete-branch',
						class: 'text-danger',
					},
					{ label: 'Force Push', value: 'force-push' },
				],
			},
		],
	},
]

const reset = () => {
	config.value = {}
}

const injectState = () => {
	// Simulate external update
	config.value = {
		size: '3',
		stash: { advanced: 'force-push' },
	}
}

const megaMenuOptions = [
	{
		label: 'Electronics',
		icon: 'lucide:cpu',
		children: [
			{ label: 'Computers', value: 'computers' },
			{ label: 'Phones', value: 'phones' },
			{ label: 'Tablets', value: 'tablets' },
			{
				label: 'Accessories',
				value: 'acc',
				children: [
					{ label: 'Chargers', value: 'chargers' },
					{ label: 'Cases', value: 'cases' },
				],
			},
		],
	},
	{
		label: 'Clothing',
		icon: 'lucide:shirt',
		children: [
			{ label: 'Men', value: 'men' },
			{ label: 'Women', value: 'women' },
			{ label: 'Kids', value: 'kids' },
			{ label: 'Shoes', value: 'shoes' },
		],
	},
	{
		label: 'Home & Garden',
		icon: 'lucide:home',
		children: [
			{ label: 'Furniture', value: 'furniture' },
			{ label: 'Kitchen', value: 'kitchen' },
			{ label: 'Lighting', value: 'lighting' },
			{ label: 'Decor', value: 'decor' },
		],
	},
]

// --- Pagination State ---
const paginatedVal = ref('')
const paginatedOptions = ref(
	Array.from({ length: 20 }, (_, i) => ({
		label: `Item ${i + 1}`,
		value: `${i + 1}`,
	})),
)
const paginatedLoading = ref(false)
const paginatedHasMore = ref(true)

const loadMoreItems = async () => {
	if (paginatedLoading.value) return
	paginatedLoading.value = true

	// Simulate API delay
	await new Promise((r) => setTimeout(r, 1000))

	const currentLength = paginatedOptions.value.length
	const newItems = Array.from({ length: 10 }, (_, i) => ({
		label: `Item ${currentLength + i + 1}`,
		value: `${currentLength + i + 1}`,
	}))

	paginatedOptions.value = [...paginatedOptions.value, ...newItems]

	if (paginatedOptions.value.length >= 60) {
		paginatedHasMore.value = false
	}
	paginatedLoading.value = false
}

// --- Remote Search State ---
const remoteVal = ref('')
const remoteOptions = ref<any[]>([])
const remoteLoading = ref(false)
const remoteLabel = computed(
	() =>
		remoteOptions.value.find((o) => o.value === remoteVal.value)?.label ||
		remoteVal.value,
)

// Mock Database
const allRemoteUsers = [
	{ label: 'Alice', value: 'alice' },
	{ label: 'Bob', value: 'bob' },
	{ label: 'Charlie', value: 'charlie' },
	{ label: 'Dave', value: 'dave' },
	{ label: 'Eve', value: 'eve' },
	{ label: 'Frank', value: 'frank' },
	{ label: 'George', value: 'george' },
	{ label: 'Helen', value: 'helen' },
]

const handleRemoteSearch = async (query: string) => {
	remoteLoading.value = true
	// Simulate Network
	await new Promise((r) => setTimeout(r, 600))

	if (!query) {
		remoteOptions.value = [] // Or set to default list
	} else {
		remoteOptions.value = allRemoteUsers.filter((u) =>
			u.label.toLowerCase().includes(query.toLowerCase()),
		)
	}
	remoteLoading.value = false
}
</script>

<template>
	<div class="space-y-10">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold">Dropdown</h2>
			<p class="text-gray-500">
				Displays a list of options for the user to pick from.
			</p>
		</div>

		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Basic Usage</h3>
			<div class="flex items-center gap-4">
				<Dropdown
					closeOnSelect
					:options="[
						{
							value: '1',
							label: 'Dashboard',
							icon: 'https://cdn.prod.website-files.com/666ad77562dfabab1eb27f63/6747850440da96e6bc2d78b3_friso_ai3.webp',
							confirmation: true,
						},
						{
							value: '2',
							label: 'Settings',
							icon: 'lucide:settings',
						},
						{
							value: '3',
							label: 'Logout',
							icon: 'lucide:log-out',
							disabled: true,
						},
					]"
					:selected="val1"
					@on-select="(opt) => (val1 = opt.value)">
					<template #trigger>
						<Button
							variant="outline"
							icon-right="lucide:chevron-down"
							>Menu</Button
						>
					</template>
				</Dropdown>
				<span class="text-sm text-gray-500">Selected: {{ val1 }}</span>
			</div>
		</section>

		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Scrollable (Many Options)</h3>
			<Dropdown
				:options="
					Array.from({ length: 20 }, (_, i) => ({
						value: `${i}`,
						label: `Option ${i + 1}`,
					}))
				"
				:selected="val1">
				<template #trigger>
					<Button
						variant="outline"
						icon-right="lucide:chevron-down"
						>Long List</Button
					>
				</template>
			</Dropdown>
		</section>

		<!-- Variants Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Variants & Sizes</h3>
			<div class="flex flex-wrap items-center gap-4">
				<!-- Default/Outline -->
				<Dropdown
					:options="[{ value: 1, label: 'Option 1' }]"
					:selected="val1">
					<template #trigger>
						<Button
							variant="outline"
							size="sm"
							icon-right="lucide:chevron-down"
							>Outline (sm)</Button
						>
					</template>
				</Dropdown>

				<!-- Solid/Primary -->
				<Dropdown
					:options="[{ value: 1, label: 'Option 1' }]"
					:selected="val1">
					<template #trigger>
						<Button
							variant="primary"
							icon-right="lucide:chevron-down"
							>Primary</Button
						>
					</template>
				</Dropdown>

				<!-- Ghost -->
				<Dropdown
					:options="[{ value: 1, label: 'Option 1' }]"
					:selected="val1">
					<template #trigger>
						<Button
							variant="ghost"
							icon-right="lucide:chevron-down"
							>Ghost</Button
						>
					</template>
				</Dropdown>
			</div>
		</section>

		<!-- Custom Item Slot Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Custom Item Slot</h3>
			<p class="text-sm text-gray-500">
				Customize the look of each option using the
				<code>#item</code> slot.
			</p>

			<Dropdown
				:options="[
					{
						value: 'u1',
						label: 'Alex Doe',
						data: {
							email: 'alex@example.com',
							avatar: 'https://i.pravatar.cc/150?u=a',
						},
					},
					{
						value: 'u2',
						label: 'Jane Smith',
						data: {
							email: 'jane@example.com',
							avatar: 'https://i.pravatar.cc/150?u=b',
						},
					},
					{
						value: 'u3',
						label: 'John Pix',
						data: {
							email: 'john@example.com',
							avatar: 'https://i.pravatar.cc/150?u=c',
						},
					},
				]"
				:selected="val1"
				class="min-w-[240px]">
				<template #trigger>
					<Button
						variant="outline"
						icon-right="lucide:user"
						>Select User</Button
					>
				</template>

				<template #item="{ option, selected }">
					<div class="flex items-center gap-3 w-full">
						<img
							:src="option.data?.avatar"
							class="w-8 h-8 rounded-full bg-gray-100" />
						<div class="flex flex-col text-left">
							<span class="font-medium text-gray-900">{{
								option.label
							}}</span>
							<span class="text-xs text-gray-500">{{
								option.data?.email
							}}</span>
						</div>
						<div
							v-if="selected === option.value"
							class="ml-auto text-primary">
							<!-- Iconify usage in template context if auto-imported or globally available -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-check">
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
					</div>
				</template>
			</Dropdown>
		</section>

		<!-- Rich Options Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Rich Options (Subtitle & Description)</h3>
			<p class="text-sm text-gray-500">
				Options can have proper subtitles (shortcuts) and descriptions.
			</p>

			<Dropdown
				:options="[
					{ label: 'Profile', value: 'profile', subtitle: '⌘P', icon: 'lucide:user' },
					{ label: 'Settings', value: 'settings', subtitle: '⌘,', icon: 'lucide:settings' },
					{ label: 'Print (Native)', value: 'print', description: 'Recommended for high fidelity', icon: 'lucide:printer' },
					{ label: 'Export PDF', value: 'export', description: 'Best for digital sharing', subtitle: '⌘E', icon: 'lucide:file-down' },
				]"
				:selected="val1"
				width="w-[280px]">
				<template #trigger>
					<Button
						variant="outline"
						icon-right="lucide:layout-list"
						class="w-[280px] justify-between">
						Rich Options
					</Button>
				</template>
			</Dropdown>
		</section>

		<!-- Multi Nested Dropdowns Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">
				Multi-Nested Dropdowns (Schema Driven)
			</h3>
			<p class="text-sm text-gray-500">
				Demonstrating recursive nested menus using the
				<code>children</code> property in the options schema.
			</p>

			<div class="flex items-center gap-4">
				<Dropdown
					:options="nestedOptions"
					:selected="nestedVal"
					@on-select="(payload) => (nestedVal = payload.value)">
					<template #trigger>
						<Button
							variant="outline"
							icon-right="lucide:chevron-down"
							>Options Menu</Button
						>
					</template>
				</Dropdown>
				<span class="text-sm text-gray-500"
					>Selected Value: {{ nestedVal }}</span
				>
			</div>
		</section>
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Recursive Form (v-model)</h3>
			<p class="text-sm text-gray-500">
				Demonstrating recursive state management with
				<code>v-model</code>. Supports deep merging, toggling, and
				static trigger labels.
			</p>

			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-8 border p-4 rounded-lg bg-gray-50/50">
				<!-- Controls -->
				<div class="space-y-4">
					<h4 class="font-medium text-sm">Configuration Menu</h4>
					<Dropdown
						v-model:modelValue="config"
						:options="recursiveOptions"
						width="w-56"
						:close-on-select="false"
						:show-selected-label="false">
						<template #trigger="{ selectedLabel }">
							<Button
								:text="selectedLabel || 'Configure View'"
								variant="outline"
								class="w-56 justify-between font-normal"
								icon-right="lucide:chevron-down" />
						</template>
					</Dropdown>

					<div class="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							@click="reset"
							>Reset State</Button
						>
						<Button
							variant="outline"
							size="sm"
							@click="injectState"
							>Inject State</Button
						>
					</div>
				</div>

				<!-- Live State -->
				<div
					class="space-y-2 p-4 bg-gray-900 rounded-lg text-gray-100 font-mono text-sm overflow-auto">
					<div class="text-xs text-gray-500 uppercase font-semibold">
						Live State (modelValue)
					</div>
					<pre>{{ JSON.stringify(config, null, 2) }}</pre>
				</div>
			</div>
		</section>

		<!-- Mega Menu Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Mega Menu (Grouped Layout)</h3>
			<p class="text-sm text-gray-500">
				Displays a flattened, grouped view suitable for navigational
				menus. using <code>layout="grouped"</code>.
			</p>

			<Dropdown
				:options="megaMenuOptions"
				layout="grouped"
				closeOnSelect
				:columns="3"
				:searchable="false"
				width="w-[600px]"
				:selected="val1"
				@on-select="(opt) => (val1 = opt.value)">
				<template #trigger>
					<Button
						variant="outline"
						icon-right="lucide:chevron-down"
						class="w-48 justify-between">
						Shop Categories
					</Button>
				</template>
			</Dropdown>
		</section>

		<!-- Pagination / Infinite Scroll Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Pagination (Infinite Scroll)</h3>
			<p class="text-sm text-gray-500">
				Loads more items as you scroll to the bottom.
			</p>

			<Dropdown
				:options="paginatedOptions"
				:loading="paginatedLoading"
				:hasMore="paginatedHasMore"
				:selected="paginatedVal"
				width="w-64"
				@on-select="(opt) => (paginatedVal = opt.value)"
				@load-more="loadMoreItems">
				<template #trigger>
					<Button
						variant="outline"
						icon-right="lucide:chevron-down"
						class="w-64 justify-between">
						Pick a Number ({{ paginatedOptions.length }} loaded)
					</Button>
				</template>
			</Dropdown>
		</section>

		<!-- Remote Search Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Remote Search (Async)</h3>
			<p class="text-sm text-gray-500">
				Fetches results from a Simulated API as you type. Disables local
				filtering.
			</p>

			<Dropdown
				:options="remoteOptions"
				:loading="remoteLoading"
				remote
				searchable
				:selected="remoteVal"
				width="w-64"
				@on-select="(opt) => (remoteVal = opt.value)"
				@search="handleRemoteSearch">
				<template #trigger>
					<Button
						variant="outline"
						icon-right="lucide:search"
						class="w-64 justify-between">
						{{ remoteLabel || 'Search Users...' }}
					</Button>
				</template>
			</Dropdown>
		</section>
		<!-- Sticky Header & Footer Section -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Sticky Header & Footer Slots</h3>
			<p class="text-sm text-gray-500">
				Use <code>#header</code> and <code>#footer</code> slots to add
				fixed content that stays visible while scrolling.
			</p>

			<Dropdown
				:options="
					Array.from({ length: 20 }, (_, i) => ({
						value: `${i}`,
						label: `Item ${i + 1}`,
					}))
				"
				:selected="val1"
				width="w-[300px]"
				class="min-h-[200px]">
				<template #trigger>
					<Button
						variant="outline"
						class="w-[300px] justify-between"
						icon-right="lucide:chevron-down"
						>Sticky Slots Example</Button
					>
				</template>

				<template #header>
					<div
						class="p-2 border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 flex justify-between items-center">
						<span>Filter Options</span>
						<Button
							size="xs"
							variant="ghost"
							>Clear</Button
						>
					</div>
				</template>

				<template #footer>
					<div class="p-2 border-t bg-gray-50 flex gap-2">
						<Button
							size="sm"
							class="flex-1"
							>Apply</Button
						>
						<Button
							size="sm"
							variant="outline"
							class="flex-1"
							>Cancel</Button
						>
					</div>
				</template>
			</Dropdown>
		</section>
	</div>
</template>
