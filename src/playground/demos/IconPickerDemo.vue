<script setup lang="ts">
import IconPicker from '@/components/IconPicker.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './IconPickerDemo.vue?raw'

const icon = ref('lucide:home')
</script>

<template>
	<div class="space-y-10">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold">IconPicker</h2>
			<p class="text-gray-500">A component to search and select icons.</p>
		</div>

		<DemoSection title="Usage" :code="sourceCode">
			<div class="max-w-xs space-y-2">
				<IconPicker
					:value="icon"
					@on-select="icon = $event" />
				<p class="text-sm text-gray-500">
					Selected: <span class="font-mono">{{ icon }}</span>
				</p>
			</div>
		</DemoSection>
	</div>
</template>
