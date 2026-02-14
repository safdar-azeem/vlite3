<script setup lang="ts">
import ColorPicker from '@/components/ColorPicker/ColorPicker.vue'
import Label from '@/components/Label.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ColorPickerDemo.vue?raw'

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

		<DemoSection title="Usage" :code="sourceCode">
			<div class="flex flex-col gap-2">
				<Label>Accent Color</Label>
				<ColorPicker v-model="color" />
				<p class="text-sm text-gray-500 mt-2">
					Selected:
					<span class="font-mono text-gray-900">{{ color }}</span>
				</p>
			</div>
		</DemoSection>
	</div>
</template>
