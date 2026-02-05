<script setup lang="ts">
import { ref } from 'vue'
import { OTPInput } from '@/components/OTPInput'
import Button from '@/components/Button.vue'

const code1 = ref('')
const code2 = ref('')
const code3 = ref('')
const code4 = ref('')
const code5 = ref('')
const code6 = ref('')
const code7 = ref('')

const handleComplete = (val: string) => {
	console.log('OTP Complete:', val)
}
</script>

<template>
	<div class="space-y-10 p-4">
		<div class="space-y-2">
			<h2 class="text-2xl font-bold">OTP Input</h2>
			<p class="text-gray-500">
				For entering one-time passwords, verification codes, and PINs.
			</p>
		</div>

		<!-- Default -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Default</h3>
			<div class="p-4 border rounded-lg">
				<OTPInput
					v-model="code1"
					@complete="handleComplete" />
				<p class="mt-2 text-sm text-gray-500">Value: {{ code1 }}</p>
			</div>
		</section>

		<!-- Variants -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Variants</h3>
			<div class="grid gap-6">
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Outline (Default)
					</p>
					<OTPInput
						v-model="code2"
						variant="outline" />
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">Solid</p>
					<OTPInput
						v-model="code2"
						variant="solid" />
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">Ghost</p>
					<OTPInput
						v-model="code2"
						variant="ghost" />
				</div>
			</div>
		</section>

		<!-- Attached -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Attached / Grouped</h3>
			<div class="grid gap-6">
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Attached Outline
					</p>
					<OTPInput
						v-model="code3"
						attached
						variant="outline" />
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Attached Solid
					</p>
					<OTPInput
						v-model="code3"
						attached
						variant="solid" />
				</div>
			</div>
		</section>

		<!-- Sizes -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Sizes</h3>
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-4">
					<span class="w-20 text-sm text-gray-500">Small</span>
					<OTPInput
						v-model="code4"
						size="sm" />
				</div>
				<div class="flex items-center gap-4">
					<span class="w-20 text-sm text-gray-500">Medium</span>
					<OTPInput
						v-model="code4"
						size="md" />
				</div>
				<div class="flex items-center gap-4">
					<span class="w-20 text-sm text-gray-500">Large</span>
					<OTPInput
						v-model="code4"
						size="lg" />
				</div>
			</div>
		</section>

		<!-- Custom Length & Type -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">Custom configuration</h3>
			<div class="grid gap-6">
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						4 Digits (Number only)
					</p>
					<OTPInput
						v-model="code5"
						:length="4" />
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						8 Chars (Text allowed - e.g. License Plate)
					</p>
					<OTPInput
						v-model="code6"
						:length="8"
						type="text"
						class="uppercase" />
					<p class="text-xs text-gray-400 mt-1">Try typing letters</p>
				</div>
			</div>
		</section>

		<!-- States -->
		<section class="space-y-4">
			<h3 class="text-lg font-semibold">States</h3>
			<div class="grid gap-6">
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">Error</p>
					<OTPInput
						v-model="code7"
						error />
					<p class="text-xs text-danger mt-1">Verification failed</p>
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Disabled
					</p>
					<OTPInput
						modelValue="123456"
						disabled />
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Autofocus (chk console/reload)
					</p>
					<OTPInput autofocus />
				</div>
			</div>
		</section>
	</div>
</template>
