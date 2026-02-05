<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect } from '@/components/MultiSelect'
import Icon from '@/components/Icon.vue'

// --- Data ---
const options = [
	{ label: 'Vue.js', value: 'vue' },
	{ label: 'React', value: 'react' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Svelte', value: 'svelte' },
	{ label: 'Solid', value: 'solid' },
	{ label: 'Qwik', value: 'qwik' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'Next.js', value: 'next' },
	{ label: 'Remix', value: 'remix' },
	{ label: 'Astro', value: 'astro' },
]

const groupedOptions = [
    {
        label: 'Frontend',
        children: [
            { label: 'Vue.js', value: 'vue' },
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'angular' },
        ]
    },
    {
        label: 'Backend',
        children: [
            { label: 'Node.js', value: 'node' },
            { label: 'Python', value: 'python' },
            { label: 'Go', value: 'go' },
        ]
    }
]

// --- State ---
const selectedFrameworks = ref(['vue', 'nuxt'])
const selectedEmpty = ref([])
const selectedMany = ref(['vue', 'react', 'angular', 'svelte', 'solid'])
const selectedGrouped = ref(['vue', 'node'])

// Remote Search State
const remoteOptions = ref<{label: string, value: string}[]>([])
const remoteSelected = ref([])
const isLoading = ref(false)

// Rich Options
const richOptions = [
    { label: 'Profile', value: 'profile', subtitle: '⌘P', icon: 'lucide:user' },
    { label: 'Settings', value: 'settings', subtitle: '⌘,', icon: 'lucide:settings' },
    { label: 'Print (Native)', value: 'print', description: 'Recommended for high fidelity', icon: 'lucide:printer' },
    { label: 'Export PDF', value: 'export', description: 'Best for digital sharing', subtitle: '⌘E', icon: 'lucide:file-down' },
]
const selectedRich = ref(['profile'])

// --- Methods ---
const handleChange = (label: string, val: any) => {
	console.log(`[${label}] Changed:`, val)
}

const handleSearch = (query: string) => {
    console.log('Searching:', query)
    isLoading.value = true
    // Simulate API call
    setTimeout(() => {
        if (!query) {
            remoteOptions.value = []
        } else {
            remoteOptions.value = [
                { label: `${query} Result 1`, value: `${query}-1` },
                { label: `${query} Result 2`, value: `${query}-2` },
                { label: `${query} Result 3`, value: `${query}-3` },
            ]
        }
        isLoading.value = false
    }, 1000)
}

// Pagination State
const pagedOptions = ref([...options, ...Array.from({ length: 40 }, (_, i) => ({ label: `Item ${i + 11}`, value: `item-${i + 11}` }))])
const hasMore = ref(true)
const isPageLoading = ref(false)
const selectedPaged = ref([])

const handleLoadMore = () => {
    if (isPageLoading.value || !hasMore.value) return
    console.log('Loading more...')
    isPageLoading.value = true
    
    setTimeout(() => {
        const currentLength = pagedOptions.value.length
        const nextBatch = Array.from({ length: 20 }, (_, i) => ({ 
            label: `Deferred Item ${currentLength + i + 1}`, 
            value: `deferred-${currentLength + i + 1}` 
        }))
        pagedOptions.value.push(...nextBatch)
        
        if (pagedOptions.value.length >= 100) {
            hasMore.value = false
        }
        isPageLoading.value = false
    }, 1000)
}

</script>

<template>
	<div class="space-y-8 p-4 max-w-3xl mx-auto">
		<div>
			<h2 class="text-2xl font-bold mb-2">MultiSelect Component</h2>
			<p class="text-gray-500 mb-6">
				A robust multi-select dropdown with tag display, search, and
				virtualization support via DropdownMenu.
			</p>
		</div>

		<!-- 1. Basic Usage -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:check-square"
					class="text-primary" />
				Basic Usage
			</h3>
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<MultiSelect
					v-model="selectedFrameworks"
					:options="options"
					@change="(v) => handleChange('Basic', v)" />
				<div
					class="mt-4 text-xs text-gray-500 font-mono bg-white p-2 rounded border">
					Model: {{ selectedFrameworks }}
				</div>
			</div>
		</section>

        <!-- 2. Remote Search -->
        <section class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
                <Icon
                    icon="lucide:search"
                    class="text-primary" />
                Remote Search (Async)
            </h3>
            <div class="p-4 border rounded-xl bg-gray-50/50">
                <MultiSelect
                    v-model="remoteSelected"
                    :options="remoteOptions"
                    placeholder="Type to search..."
                    remote
                    :loading="isLoading"
                    @search="handleSearch"
                    @change="(v) => handleChange('Remote', v)"
                />
                 <div class="mt-2 text-xs text-gray-500">
                    Type anything to simulate an API search.
                </div>
            </div>
        </section>

        <!-- 3. Rich Options (Subtitle & Description) -->
        <section class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
                <Icon
                    icon="lucide:layout-list"
                    class="text-primary" />
                Rich Options
            </h3>
            <div class="p-4 border rounded-xl bg-gray-50/50">
                <MultiSelect
                    v-model="selectedRich"
                    :options="richOptions"
                    placeholder="Select actions..."
                    @change="(v) => handleChange('Rich', v)"
                />
                 <div class="mt-2 text-xs text-gray-500">
                    Options with subtitles (shortcuts) and descriptions.
                </div>
            </div>
        </section>

        <!-- 4. Pagination / Infinite Scroll -->
        <section class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
                <Icon
                    icon="lucide:list-plus"
                    class="text-primary" />
                Pagination (Load More)
            </h3>
            <div class="p-4 border rounded-xl bg-gray-50/50">
                <MultiSelect
                    v-model="selectedPaged"
                    :options="pagedOptions"
                    placeholder="Scroll for more..."
                    :has-more="hasMore"
                    :loading="isPageLoading"
                    @load-more="handleLoadMore"
                    @change="(v) => handleChange('Paged', v)"
                />
                 <div class="mt-2 text-xs text-gray-500">
                    Scroll to the bottom of the list to load more items.
                </div>
            </div>
        </section>

        <!-- 4. Grouped Options -->
        <section class="space-y-4">
            <h3 class="text-lg font-semibold flex items-center gap-2">
                <Icon
                    icon="lucide:layers"
                    class="text-primary" />
                Grouped Options
            </h3>
            <div class="p-4 border rounded-xl bg-gray-50/50">
                <MultiSelect
                    v-model="selectedGrouped"
                    :options="groupedOptions"
                    layout="grouped"
                    placeholder="Select from groups..."
                    @change="(v) => handleChange('Grouped', v)"
                />
                <div
					class="mt-4 text-xs text-gray-500 font-mono bg-white p-2 rounded border">
					Model: {{ selectedGrouped }}
				</div>
            </div>
        </section>

		<!-- 5. Empty State & Placeholder -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:message-square"
					class="text-primary" />
				Placeholder
			</h3>
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<MultiSelect
					v-model="selectedEmpty"
					:options="options"
					placeholder="Choose your stack..."
					@change="(v) => handleChange('Empty', v)" />
			</div>
		</section>

		<!-- 6. Overflow Handling (+N) -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:more-horizontal"
					class="text-primary" />
				Overflow Handling (+N)
			</h3>
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<MultiSelect
					v-model="selectedMany"
					:options="options"
					:max-visible="3"
					@change="(v) => handleChange('Overflow', v)" />
				<p class="mt-2 text-xs text-gray-500">
					Max visible set to 3. Selection has 5 items.
				</p>
			</div>
		</section>

		<!-- 7. States -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:toggle-left"
					class="text-primary" />
				States
			</h3>
			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl bg-gray-50/50">
				<div>
					<label class="text-sm font-medium mb-1 block"
						>Disabled</label
					>
					<MultiSelect
						v-model="selectedFrameworks"
						:options="options"
						disabled />
				</div>
				<div>
					<label class="text-sm font-medium mb-1 block"
						>Solid Variant</label
					>
					<MultiSelect
						v-model="selectedFrameworks"
						:options="options"
						variant="solid" />
				</div>
			</div>
		</section>
	</div>
</template>
