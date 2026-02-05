<script setup lang="ts">
import ColorPicker from '@/components/ColorPicker/ColorPicker.vue'
import Label from '@/components/Label.vue'
import { ref } from 'vue'

const color = ref('#4f46e5')
</script>

<template>
	<div class="space-y-10">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold">ColorPicker</h2>
			<p class="text-gray-500">
				A component to pick colors conveniently.
			</p>
		</div>

		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Usage</h3>
			<div class="flex flex-col gap-2">
				<Label>Accent Color</Label>
				<ColorPicker v-model="color" />
				<p class="text-sm text-gray-500 mt-2">
					Selected:
					<span class="font-mono text-gray-900">{{ color }}</span>
				</p>
			</div>
		</section>
	</div>
</template>
