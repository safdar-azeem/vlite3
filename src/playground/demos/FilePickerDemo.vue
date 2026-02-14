<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './FilePickerDemo.vue?raw'

const basicFiles = ref<FilePickerValue | null>(null)
const multiFiles = ref<FilePickerValue[] | null>(null)
const imageFiles = ref<FilePickerValue | null>(null)
const base64Files = ref<FilePickerValue | null>(null)
const customTriggerFiles = ref<FilePickerValue | null>(null)

const logChange = (label: string, val: any) => {
	console.log(`[${label}] Changed:`, val)
}

const handleError = (err: string) => {
	alert(err)
}
</script>

<template>
	<div class="space-y-8 p-4 max-w-3xl mx-auto">
		<div>
			<h2 class="text-2xl font-bold mb-2">FilePicker Component</h2>
			<p class="text-gray-500 mb-6">
				A versatile file selection component with drag & drop,
				multi-select, and custom trigger support.
			</p>
		</div>

		<!-- 1. Basic Usage -->
		<DemoSection title="Basic Usage" :code="sourceCode">
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="basicFiles"
					@change="(val) => logChange('Basic', val)"
					@error="handleError" />
			</div>
		</DemoSection>

		<!-- 2. Multi-Select -->
		<DemoSection title="Multi-Select" :code="sourceCode">
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="multiFiles"
					multi-select
					@change="(val) => logChange('Multi', val)"
					@error="handleError" />
			</div>
		</DemoSection>

		<!-- 3. Restricted File Types (Images) -->
		<DemoSection title="Restricted Types (Images Only)" :code="sourceCode">
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="imageFiles"
					:file-types="['image/*', '.png', '.jpg', '.jpeg', '.webp']"
					@change="(val) => logChange('Images', val)"
					@error="handleError" />
			</div>
		</DemoSection>

		<!-- 4. Base64 Return Format -->
		<DemoSection title="Base64 Output" :code="sourceCode">
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="base64Files"
					return-format="base64"
					:file-types="['image/*']"
					@change="(val) => logChange('Base64', val)"
					@error="handleError" />
				<div
					v-if="base64Files && base64Files.base64"
					class="mt-4">
					<p class="text-xs text-gray-500 mb-2">
						Preview from Base64:
					</p>
					<img
						:src="base64Files.base64"
						class="h-20 w-auto rounded border shadow-sm" />
				</div>
			</div>
		</DemoSection>

		<!-- 5. Custom Trigger -->
		<DemoSection title="Custom Trigger" :code="sourceCode">
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="customTriggerFiles"
					@change="(val) => logChange('Custom', val)"
					@error="handleError">
					<template #trigger="{ trigger, files, isLoading }">
						<div class="flex items-center gap-4">
							<Button
								:loading="isLoading"
								icon="lucide:upload"
								@click="trigger">
								{{
									files && files.length
										? 'Change File'
										: 'Upload File'
								}}
							</Button>

							<div
								v-if="files && files.length > 0"
								class="flex items-center gap-2 text-sm text-gray-700">
								<Icon
									icon="lucide:check-circle"
									class="text-success h-4 w-4" />
								{{ files[0].fileName }}
							</div>
							<div
								v-else
								class="text-sm text-gray-400 italic">
								No file selected
							</div>
						</div>
					</template>
				</FilePicker>
			</div>
		</DemoSection>

		<!-- 6. States -->
		<DemoSection title="States" :code="sourceCode">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="p-4 border rounded-xl bg-gray-50/50">
					<p class="text-sm font-medium mb-2">Disabled</p>
					<FilePicker disabled />
				</div>
				<div class="p-4 border rounded-xl bg-gray-50/50">
					<p class="text-sm font-medium mb-2">Loading</p>
					<FilePicker loading />
				</div>
			</div>
		</DemoSection>
	</div>
</template>
