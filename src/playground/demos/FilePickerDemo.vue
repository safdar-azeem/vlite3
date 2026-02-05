<script setup lang="ts">
import { ref } from 'vue'
import { FilePicker, type FilePickerValue } from '@/components/FilePicker'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

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
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:file"
					class="text-primary" />
				Basic Usage
			</h3>
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="basicFiles"
					@change="(val) => logChange('Basic', val)"
					@error="handleError" />
			</div>
		</section>

		<!-- 2. Multi-Select -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:files"
					class="text-primary" />
				Multi-Select
			</h3>
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="multiFiles"
					multi-select
					@change="(val) => logChange('Multi', val)"
					@error="handleError" />
			</div>
		</section>

		<!-- 3. Restricted File Types (Images) -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:image"
					class="text-primary" />
				Restricted Types (Images Only)
			</h3>
			<div class="p-4 border rounded-xl bg-gray-50/50">
				<FilePicker
					v-model="imageFiles"
					:file-types="['image/*', '.png', '.jpg', '.jpeg', '.webp']"
					@change="(val) => logChange('Images', val)"
					@error="handleError" />
			</div>
		</section>

		<!-- 4. Base64 Return Format -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:code-2"
					class="text-primary" />
				Base64 Output
			</h3>
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
		</section>

		<!-- 5. Custom Trigger -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:mouse-pointer-click"
					class="text-primary" />
				Custom Trigger
			</h3>
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
		</section>

		<!-- 6. States -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold flex items-center gap-2">
				<Icon
					icon="lucide:toggle-left"
					class="text-primary" />
				States
			</h3>
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
		</section>
	</div>
</template>
