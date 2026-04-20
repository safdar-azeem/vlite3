<script setup lang="ts">
import { ref } from 'vue'
import { OTPInput } from '@/components/OTPInput'
import DemoSection from '../DemoSection.vue'
import sourceCode from './OTPInputDemo.vue?raw'

const code1 = ref('')
const code2 = ref('')
const code3 = ref('')
const code4 = ref('')
const code5 = ref('')
const code6 = ref('')
const code7 = ref('')
const codeMask = ref('')
const codeFluid = ref('')
const codeMaskFluid = ref('')
const codeResend = ref('')

const handleComplete = (val: string) => {
	console.log('OTP Complete:', val)
}

const handleResend = (count: number) => {
	console.log(`OTP Resend triggered: ${count} times`)
}

const handleResendLimit = () => {
	console.log('OTP Resend Limit Reached!')
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
		<DemoSection title="Default" :code="sourceCode">
			<div class="p-4 border rounded-lg">
				<OTPInput
					v-model="code1"
					@complete="handleComplete" />
				<p class="mt-2 text-sm text-gray-500">Value: {{ code1 }}</p>
			</div>
		</DemoSection>

		<!-- Variants -->
		<DemoSection title="Variants" :code="sourceCode">
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
		</DemoSection>

		<!-- Attached -->
		<DemoSection title="Attached / Grouped" :code="sourceCode">
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
		</DemoSection>

		<!-- Sizes -->
		<DemoSection title="Sizes" :code="sourceCode">
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
		</DemoSection>

		<!-- Custom Length & Type -->
		<DemoSection title="Custom configuration" :code="sourceCode">
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
		</DemoSection>

		<!-- Mask (hidden input) -->
		<DemoSection title="Mask (Password-like)" :code="sourceCode">
			<div class="grid gap-6">
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Masked — digits hidden like a password
					</p>
					<OTPInput
						v-model="codeMask"
						mask
						@complete="handleComplete" />
					<p class="mt-2 text-sm text-gray-500">Value: {{ codeMask }}</p>
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Masked + Solid variant
					</p>
					<OTPInput
						v-model="codeMask"
						mask
						variant="solid" />
				</div>
			</div>
		</DemoSection>

		<!-- Fluid (stretch to parent) -->
		<DemoSection title="Fluid (fills parent width)" :code="sourceCode">
			<div class="grid gap-6">
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Fluid — inputs stretch equally to fill container
					</p>
					<div class="w-full max-w-sm">
						<OTPInput
							v-model="codeFluid"
							fluid />
					</div>
					<p class="mt-2 text-sm text-gray-500">Value: {{ codeFluid }}</p>
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Fluid + Attached + Solid
					</p>
					<div class="w-full max-w-sm">
						<OTPInput
							v-model="codeFluid"
							fluid
							attached
							variant="solid" />
					</div>
				</div>
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Fluid + Mask (hidden + stretched)
					</p>
					<div class="w-full max-w-sm">
						<OTPInput
							v-model="codeMaskFluid"
							fluid
							mask
							@complete="handleComplete" />
					</div>
					<p class="mt-2 text-sm text-gray-500">Value: {{ codeMaskFluid }}</p>
				</div>
			</div>
		</DemoSection>

		<!-- Resend functionality -->
		<DemoSection title="Resend Configuration" :code="sourceCode">
			<div class="grid gap-6">
				<div>
					<p class="text-sm font-medium mb-2 text-gray-600">
						Built-in Resend (Demo: 5s countdown, max 3 attempts)
					</p>
					<OTPInput
						v-model="codeResend"
						allow-resend
						:resend-duration="5"
						:max-resends="3"
						@resend="handleResend"
						@resend-limit-reached="handleResendLimit" />
				</div>
			</div>
		</DemoSection>

		<!-- States -->
		<DemoSection title="States" :code="sourceCode">
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
		</DemoSection>
	</div>
</template>
