<script setup lang="ts">
import { ref } from 'vue'
import { Chip } from '@/components/Chip'

const deletedChips = ref<string[]>([])

const handleClick = (msg: string) => {
	console.log('Clicked:', msg)
	alert('Clicked: ' + msg)
}

const handleDelete = (id: string) => {
	console.log('Deleted:', id)
	deletedChips.value.push(id)
}

const restore = () => {
	deletedChips.value = []
}
</script>

<template>
	<div class="space-y-10">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold">Chip</h2>
			<p class="text-gray-500">
				Compact elements that represent an input, attribute, or action.
			</p>
		</div>

		<!-- Basic Variants -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Variants</h3>
			<div class="flex flex-wrap gap-2">
				<Chip
					text="Solid"
					variant="solid" />
				<Chip
					text="Outline"
					variant="outline" />
				<Chip
					text="Secondary"
					variant="secondary" />
				<Chip
					text="Subtle"
					variant="subtle" />
				<Chip
					text="Ghost"
					variant="ghost" />
			</div>
		</section>

		<!-- Semantic Variants -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Semantic Colors</h3>
			<div class="flex flex-wrap gap-2">
				<Chip
					text="Primary"
					variant="solid" />
				<Chip
					text="Success"
					variant="success"
					icon="lucide:check" />
				<Chip
					text="Warning"
					variant="warning"
					icon="lucide:alert-triangle" />
				<Chip
					text="Danger"
					variant="danger"
					icon="lucide:x-circle" />
				<Chip
					text="Info"
					variant="info"
					icon="lucide:info" />
			</div>
		</section>

		<!-- Sizes -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Sizes</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Chip
					text="Small"
					size="small" />
				<Chip
					text="Medium (Default)"
					size="medium" />
				<Chip
					text="Large"
					size="large" />
			</div>
		</section>

		<!-- Icons & Avatars -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Icons & Avatars</h3>
			<div class="flex flex-wrap gap-2">
				<Chip
					text="With Icon"
					icon="lucide:star"
					variant="secondary" />
				<Chip
					text="Solid Icon"
					icon="lucide:check"
					variant="solid" />
				<Chip
					text="Avatar"
					icon="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
				<Chip
					icon="lucide:bell"
					variant="outline" />
				<!-- Icon Only -->
			</div>
		</section>

		<!-- Interactions -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Interactions</h3>
			<div class="space-y-4">
				<div class="flex flex-wrap gap-2">
					<Chip
						text="Click Me"
						clickable
						variant="outline"
						@click="handleClick('Click Me Chip')" />
					<Chip
						text="Clickable Solid"
						clickable
						variant="solid"
						icon="lucide:mouse-pointer-2"
						@click="handleClick('Solid Clicked')" />
				</div>

				<div class="flex flex-wrap gap-2 items-center">
					<Chip
						v-if="!deletedChips.includes('chip-1')"
						text="Deletable"
						deletable
						variant="secondary"
						@delete="handleDelete('chip-1')" />
					<Chip
						v-if="!deletedChips.includes('chip-2')"
						text="Clickable & Deletable"
						clickable
						deletable
						variant="secondary"
						@click="handleClick('Mixed Interaction')"
						@delete="handleDelete('chip-2')" />

					<button
						v-if="deletedChips.length > 0"
						class="text-sm text-primary hover:underline"
						@click="restore">
						Restore Deleted
					</button>
				</div>
			</div>
		</section>

		<!-- States -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">States</h3>
			<div class="flex flex-wrap gap-2">
				<Chip
					text="Disabled"
					disabled />
				<Chip
					text="Disabled Outline"
					variant="outline"
					disabled />
				<Chip
					text="Disabled Clickable"
					clickable
					disabled />
			</div>
		</section>

		<!-- Custom Styling -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Custom Styling (Override)</h3>
			<div class="flex flex-wrap gap-2">
				<!-- Example of overriding classes manually if needed, distinct from semantic variants -->
				<Chip
					text="Custom Class"
					class="bg-indigo-100 text-indigo-700 border-indigo-200" />
			</div>
		</section>
	</div>
</template>
