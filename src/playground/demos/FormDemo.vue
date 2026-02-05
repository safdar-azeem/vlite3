<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import Icon from '@/components/Icon.vue'

// ==========================================
// DEMO TAB SECTIONS
// ==========================================

const activeTab = ref('basic')

const tabs = [
	{ id: 'basic', label: 'Basic Forms', icon: 'lucide:layout-list' },
	{ id: 'validation', label: 'Validation', icon: 'lucide:shield-check' },
	{ id: 'advanced', label: 'Advanced', icon: 'lucide:sparkles' },
	{ id: 'grouped', label: 'Grouped Forms', icon: 'lucide:layout-grid' },
	{ id: 'multistep', label: 'Multi-Step', icon: 'tdesign:component-steps' },
	{ id: 'custom', label: 'Custom Fields', icon: 'lucide:layers' },
	{ id: 'uploads', label: 'Uploads', icon: 'lucide:upload-cloud' },
]

// Store submitted values for display
const submittedValues = ref<{
	tab: string
	values: any
	timestamp: Date
} | null>(null)

const handleSubmit = (tab: string, payload: IFormSubmitPayload) => {
	submittedValues.value = {
		tab,
		values: payload.values,
		timestamp: new Date(),
	}
}

const clearSubmitted = () => {
	submittedValues.value = null
}

// ==========================================
// 1. BASIC FORMS
// ==========================================

// Login Form Schema
const loginSchema: IForm[] = [
	{
		name: 'email',
		label: 'Email Address',
		type: 'email',
		placeholder: 'john@example.com',
		icon: 'lucide:mail',
		required: true,
	},
	{
		name: 'password',
		label: 'Password',
		type: 'password',
		placeholder: '••••••••',
		icon: 'lucide:lock',
		required: true,
	},
	{
		name: 'rememberMe',
		label: 'Remember me',
		type: 'switch',
		value: false,
	},
]

// Contact Form Schema
const contactSchema: IForm[] = [
	{
		name: 'image',
		label: 'Avatar',
		type: 'avatarUpload',
		placeholder: 'John Doe',
		required: true,
	},
	{
		name: 'name',
		label: 'Full Name',
		type: 'text',
		placeholder: 'John Doe',
		required: true,
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'john@example.com',
		required: true,
	},
	{
		name: 'subject',
		label: 'Subject',
		type: 'select',
		placeholder: 'Select a subject',
		options: [
			{ label: 'General Inquiry', value: 'general' },
			{ label: 'Support', value: 'support' },
			{ label: 'Sales', value: 'sales' },
			{ label: 'Partnership', value: 'partnership' },
		],
		required: true,
	},
	{
		name: 'message',
		label: 'Message',
		type: 'textarea',
		placeholder: 'Your message...',
		props: { rows: 4 },
		itemClass: 'col-span-2',
		required: true,
	},
]

// ==========================================
// 2. VALIDATION FORMS
// ==========================================

const validationSchema: IForm[] = [
	{
		name: 'username',
		label: 'Username',
		type: 'text',
		placeholder: 'Enter username',
		required: true,
		validation: ({ value }) => {
			if (!value) return ''
			if (value.length < 3)
				return 'Username must be at least 3 characters'
			if (value.length > 20)
				return 'Username must be at most 20 characters'
			if (!/^[a-zA-Z0-9_]+$/.test(value))
				return 'Only letters, numbers and underscores allowed'
			return ''
		},
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'email@example.com',
		required: true,
		validation: ({ value }) => {
			if (!value) return ''
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
				return 'Please enter a valid email'
			return ''
		},
	},
	{
		name: 'password',
		label: 'Password',
		type: 'password',
		placeholder: '••••••••',
		required: true,
		validation: ({ value }) => {
			if (!value) return ''
			if (value.length < 8)
				return 'Password must be at least 8 characters'
			if (!/[A-Z]/.test(value))
				return 'Password must contain an uppercase letter'
			if (!/[0-9]/.test(value)) return 'Password must contain a number'
			return ''
		},
	},
	{
		name: 'confirmPassword',
		label: 'Confirm Password',
		type: 'password',
		placeholder: '••••••••',
		required: true,
		validation: ({ value, values }) => {
			if (!value) return ''
			if (value !== values.password) return 'Passwords do not match'
			return ''
		},
	},
	{
		name: 'age',
		label: 'Age',
		type: 'number',
		placeholder: '18',
		min: 0,
		max: 120,
		validation: ({ value }) => {
			if (value !== undefined && value !== null && value !== '') {
				if (Number(value) < 18)
					return 'You must be at least 18 years old'
			}
			return ''
		},
	},
	{
		name: 'website',
		label: 'Website (Optional)',
		type: 'url',
		placeholder: 'https://example.com',
		validation: ({ value }) => {
			if (!value) return ''
			try {
				new URL(value)
				return ''
			} catch {
				return 'Please enter a valid URL'
			}
		},
	},
	{
		name: 'acceptTerms',
		label: 'I accept the terms and conditions',
		type: 'check',
		required: true,
		itemClass: 'col-span-2',
	},
]

// ==========================================
// 3. ADVANCED FORMS (Conditional, updateValues)
// ==========================================

const advancedSchema: IForm[] = [
	{
		name: 'paymentMethod',
		label: 'Payment Method',
		type: 'select',
		options: [
			{ label: 'Credit Card', value: 'credit' },
			{ label: 'PayPal', value: 'paypal' },
			{ label: 'Bank Transfer', value: 'bank' },
		],
		required: true,
	},
	// Credit card fields - only shown when credit card selected
	{
		name: 'cardNumber',
		label: 'Card Number',
		type: 'text',
		placeholder: '4242 4242 4242 4242',
		when: ({ values }) => values.paymentMethod === 'credit',
		required: true,
	},
	{
		name: 'cardExpiry',
		label: 'Expiry Date',
		type: 'text',
		placeholder: 'MM/YY',
		when: ({ values }) => values.paymentMethod === 'credit',
		required: true,
	},
	{
		name: 'cardCvc',
		label: 'CVC',
		type: 'text',
		placeholder: '123',
		when: ({ values }) => values.paymentMethod === 'credit',
		required: true,
	},
	// PayPal field - only shown when PayPal selected
	{
		name: 'paypalEmail',
		label: 'PayPal Email',
		type: 'email',
		placeholder: 'paypal@example.com',
		when: ({ values }) => values.paymentMethod === 'paypal',
		required: true,
		itemClass: 'col-span-2',
	},
	// Bank fields - only shown when bank selected
	{
		name: 'bankName',
		label: 'Bank Name',
		type: 'text',
		placeholder: 'Enter bank name',
		when: ({ values }) => values.paymentMethod === 'bank',
		required: true,
	},
	{
		name: 'accountNumber',
		label: 'Account Number',
		type: 'text',
		placeholder: 'Enter account number',
		when: ({ values }) => values.paymentMethod === 'bank',
		required: true,
	},
	// Pricing with updateValues
	{
		name: 'quantity',
		label: 'Quantity',
		type: 'number',
		value: 1,
		min: 1,
		max: 100,
		updateValues: ({ values }) => {
			const price = 29.99
			return {
				subtotal: (values.quantity || 0) * price,
				total: (values.quantity || 0) * price * 1.1, // 10% tax
			}
		},
	},
	{
		name: 'subtotal',
		label: 'Subtotal',
		type: 'text',
		addonLeft: '$',
		disabled: true,
		value: 29.99,
	},
	{
		name: 'total',
		label: 'Total (incl. 10% tax)',
		type: 'text',
		addonLeft: '$',
		disabled: true,
		value: 32.99,
		itemClass: 'col-span-2',
	},
]

// ==========================================
// 4. GROUPED FORMS
// ==========================================

const personalInfoSchema: IForm[] = [
	{
		name: 'firstName',
		label: 'First Name',
		type: 'text',
		placeholder: 'John',
		required: true,
	},
	{
		name: 'lastName',
		label: 'Last Name',
		type: 'text',
		placeholder: 'Doe',
		required: true,
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'john@example.com',
		required: true,
	},
	{
		name: 'phone',
		label: 'Phone',
		type: 'tel',
		placeholder: '+1 (555) 000-0000',
	},
]

const addressSchema: IForm[] = [
	{
		name: 'street',
		label: 'Street Address',
		type: 'text',
		placeholder: '123 Main St',
		itemClass: 'col-span-2',
	},
	{
		name: 'city',
		label: 'City',
		type: 'text',
		placeholder: 'New York',
	},
	{
		name: 'state',
		label: 'State',
		type: 'select',
		options: [
			{ label: 'California', value: 'CA' },
			{ label: 'New York', value: 'NY' },
			{ label: 'Texas', value: 'TX' },
			{ label: 'Florida', value: 'FL' },
		],
	},
	{
		name: 'zipCode',
		label: 'ZIP Code',
		type: 'text',
		placeholder: '10001',
	},
	{
		name: 'country',
		label: 'Country',
		type: 'select',
		options: [
			{ label: 'United States', value: 'US' },
			{ label: 'Canada', value: 'CA' },
			{ label: 'United Kingdom', value: 'UK' },
		],
	},
]

const preferencesSchema: IForm[] = [
	{
		name: 'notifications',
		label: 'Email Notifications',
		type: 'switch',
		value: true,
	},
	{
		name: 'newsletter',
		label: 'Subscribe to Newsletter',
		type: 'switch',
		value: false,
	},
	{
		name: 'theme',
		label: 'Theme',
		type: 'select',
		options: [
			{ label: 'Light', value: 'light' },
			{ label: 'Dark', value: 'dark' },
			{ label: 'System', value: 'system' },
		],
		value: 'system',
	},
	{
		name: 'language',
		label: 'Language',
		type: 'select',
		options: [
			{ label: 'English', value: 'en' },
			{ label: 'Spanish', value: 'es' },
			{ label: 'French', value: 'fr' },
		],
		value: 'en',
	},
]

// ==========================================
// 5. MULTI-STEP FORM
// ==========================================

const multiStepTabs = [
	{
		id: 1,
		title: 'Account',
		icon: 'lucide:user',
		description: 'Create your account',
	},
	{
		id: 2,
		title: 'Profile',
		icon: 'lucide:user-circle',
		description: 'Set up your profile',
	},
	{
		id: 3,
		title: 'Complete',
		icon: 'lucide:check-circle',
		description: 'Review and finish',
	},
]

const accountSchema: IForm[] = [
	{
		name: 'email',
		label: 'Email Address',
		type: 'email',
		placeholder: 'you@example.com',
		required: true,
		itemClass: 'col-span-2',
	},
	{
		name: 'password',
		label: 'Password',
		type: 'password',
		placeholder: '••••••••',
		required: true,
	},
	{
		name: 'confirmPassword',
		label: 'Confirm Password',
		type: 'password',
		placeholder: '••••••••',
		required: true,
		validation: ({ value, values }) => {
			if (value !== values.password) return 'Passwords do not match'
			return ''
		},
	},
]

const profileSchema: IForm[] = [
	{
		name: 'displayName',
		label: 'Display Name',
		type: 'text',
		placeholder: 'John Doe',
		required: true,
		itemClass: 'col-span-2',
	},
	{
		name: 'bio',
		label: 'Bio',
		type: 'textarea',
		placeholder: 'Tell us about yourself...',
		props: { rows: 3 },
		itemClass: 'col-span-2',
	},
	{
		name: 'birthDate',
		label: 'Birth Date',
		type: 'date',
	},
	{
		name: 'gender',
		label: 'Gender',
		type: 'select',
		options: [
			{ label: 'Male', value: 'male' },
			{ label: 'Female', value: 'female' },
			{ label: 'Other', value: 'other' },
			{ label: 'Prefer not to say', value: 'none' },
		],
	},
]

const reviewSchema: IForm[] = [
	{
		name: 'acceptTerms',
		label: 'I accept the Terms of Service',
		type: 'check',
		required: true,
		itemClass: 'col-span-2',
	},
	{
		name: 'acceptPrivacy',
		label: 'I accept the Privacy Policy',
		type: 'check',
		required: true,
		itemClass: 'col-span-2',
	},
	{
		name: 'marketing',
		label: 'Send me product updates and offers',
		type: 'switch',
		value: false,
		itemClass: 'col-span-2',
	},
]

// ==========================================
// 6. CUSTOM FIELDS
// ==========================================

const customFieldsSchema: IForm[] = [
	{
		name: 'projectName',
		label: 'Project Name',
		type: 'text',
		placeholder: 'My Awesome Project',
		required: true,
		itemClass: 'col-span-2',
	},
	{
		name: 'description',
		label: 'Description',
		type: 'textarea',
		placeholder: 'Describe your project...',
		props: { rows: 2 },
		itemClass: 'col-span-2',
	},
	{
		name: 'socialLinks',
		label: 'Social Media Links',
		type: 'customFields',
		itemClass: 'col-span-2',
		props: {
			schema: [
				{
					name: 'platform',
					label: 'Platform',
					type: 'select',
					options: [
						{ label: 'Twitter', value: 'twitter' },
						{ label: 'LinkedIn', value: 'linkedin' },
						{ label: 'GitHub', value: 'github' },
						{ label: 'Website', value: 'website' },
					],
				},
				{
					name: 'url',
					label: 'URL',
					type: 'url',
					placeholder: 'https://',
				},
			],
			headers: ['Platform', 'URL'],
		},
		value: [],
	},
	{
		name: 'teamMembers',
		label: 'Team Members',
		type: 'customFields',
		itemClass: 'col-span-2',
		props: {
			schema: [
				{
					name: 'name',
					label: 'Name',
					type: 'text',
					placeholder: 'John Doe',
				},
				{
					name: 'role',
					label: 'Role',
					type: 'select',
					options: [
						{ label: 'Developer', value: 'developer' },
						{ label: 'Designer', value: 'designer' },
						{ label: 'Manager', value: 'manager' },
						{ label: 'QA', value: 'qa' },
					],
				},
				{
					name: 'email',
					label: 'Email',
					type: 'email',
					placeholder: 'email@example.com',
				},
			],
			headers: ['Name', 'Role', 'Email'],
		},
		value: [],
	},
]
// ==========================================
// 7. UPLOAD FORMS
// ==========================================

const uploadSchema: IForm[] = [
	{
		name: 'avatar',
		label: 'Avatar Upload',
		type: 'avatarUpload',
		placeholder: 'John Doe',
		required: true,
	},
	{
		name: 'idProof',
		label: 'ID Proof (Input Style)',
		type: 'file',
		required: true,
		placeholder: 'Select ID document',
		props: {
			accept: 'image/*,.pdf',
		},
	},
	{
		name: 'resume',
		label: 'Resume (Dropzone)',
		type: 'fileUploader',
		required: true,
		props: {
			accept: '.pdf,.doc,.docx',
		},
	},
	{
		name: 'gallery',
		label: 'Project Gallery (Multiple Files)',
		type: 'fileUploader',
		props: {
			multiple: true,
			accept: 'image/*',
		},
	},
	{
		name: 'documents',
		label: 'Document Collection (Custom Fields with File)',
		type: 'customFields',
		props: {
			schema: [
				{
					name: 'title',
					label: 'Document Title',
					type: 'text',
					placeholder: 'e.g. Identity Proof',
				},
				{
					name: 'file',
					label: 'File Attachment',
					type: 'file',
					props: {
						accept: '.pdf,.jpg,.png',
					},
				},
				{
					name: 'category',
					label: 'Category',
					type: 'select',
					options: [
						{ label: 'Personal', value: 'personal' },
						{ label: 'Business', value: 'business' },
						{ label: 'Legal', value: 'legal' },
					],
				},
			],
			headers: ['Title', 'File', 'Category'],
		},
		value: [],
	},
]
</script>

<template>
	<div class="space-y-8">
		<div>
			<h2 class="text-2xl font-bold text-gray-900 mb-2">
				Form Component
			</h2>
			<p class="text-gray-600">
				A powerful schema-driven form system with validation,
				conditional fields, grouped layouts, and multi-step wizards.
			</p>
		</div>

		<!-- Tab Navigation -->
		<div class="border-b border-border">
			<div class="flex flex-wrap gap-1">
				<button
					v-for="tab in tabs"
					:key="tab.id"
					@click="activeTab = tab.id"
					class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors"
					:class="
						activeTab === tab.id
							? 'bg-white border-t border-x border-border -mb-px text-primary'
							: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
					">
					<Icon
						:icon="tab.icon"
						class="w-4 h-4" />
					{{ tab.label }}
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		<div class="bg-white rounded-lg border border-border p-6">
			<!-- Basic Forms Tab -->
			<template v-if="activeTab === 'basic'">
				<div class="space-y-8">
					<div>
						<h3 class="text-lg font-semibold mb-1">Login Form</h3>
						<p class="text-sm text-gray-500 mb-4">
							Simple login form with email, password, and remember
							me.
						</p>
						<div class="flex flex-col lg:flex-row gap-6">
							<div class="flex-1 max-w-md">
								<Form
									:schema="loginSchema"
									submitText="Sign In"
									@onSubmit="
										(payload) =>
											handleSubmit('Login Form', payload)
									" />
							</div>
							<!-- Inline Submitted Values -->
							<div
								v-if="
									submittedValues &&
									submittedValues.tab === 'Login Form'
								"
								class="flex-1 max-w-md">
								<div
									class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
									<div class="flex items-center gap-2 mb-3">
										<Icon
											icon="lucide:check-circle"
											class="w-5 h-5 text-green-600" />
										<h4
											class="font-semibold text-green-800">
											Submitted Values
										</h4>
									</div>
									<div
										class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
										<pre
											class="text-xs text-gray-700 whitespace-pre-wrap"
											>{{
												JSON.stringify(
													submittedValues.values,
													null,
													2,
												)
											}}</pre
										>
									</div>
								</div>
							</div>
						</div>
					</div>

					<hr class="border-border" />

					<div>
						<h3 class="text-lg font-semibold mb-1">Contact Form</h3>
						<p class="text-sm text-gray-500 mb-4">
							Contact form with dropdown, textarea, and grid
							layout.
						</p>
						<div class="flex flex-col lg:flex-row gap-6">
							<div class="flex-1 max-w-2xl">
								<Form
									:schema="contactSchema"
									class-name="grid-cols-2"
									submitText="Send Message"
									@onSubmit="
										(payload) =>
											handleSubmit(
												'Contact Form',
												payload,
											)
									" />
							</div>
							<!-- Inline Submitted Values -->
							<div
								v-if="
									submittedValues &&
									submittedValues.tab === 'Contact Form'
								"
								class="flex-1 max-w-md">
								<div
									class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
									<div class="flex items-center gap-2 mb-3">
										<Icon
											icon="lucide:check-circle"
											class="w-5 h-5 text-green-600" />
										<h4
											class="font-semibold text-green-800">
											Submitted Values
										</h4>
									</div>
									<div
										class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
										<pre
											class="text-xs text-gray-700 whitespace-pre-wrap"
											>{{
												JSON.stringify(
													submittedValues.values,
													null,
													2,
												)
											}}</pre
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>

			<!-- Validation Tab -->
			<template v-else-if="activeTab === 'validation'">
				<div>
					<h3 class="text-lg font-semibold mb-1">
						Registration with Validation
					</h3>
					<p class="text-sm text-gray-500 mb-4">
						Comprehensive validation including regex patterns,
						password matching, age checks, and URL validation.
					</p>
					<div class="flex flex-col lg:flex-row gap-6">
						<div class="flex-1 max-w-2xl">
							<Form
								:schema="validationSchema"
								submitText="Create Account"
								@onSubmit="
									(payload) =>
										handleSubmit('Validation Form', payload)
								" />
						</div>
						<!-- Inline Submitted Values -->
						<div
							v-if="
								submittedValues &&
								submittedValues.tab === 'Validation Form'
							"
							class="flex-1 max-w-md">
							<div
								class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
								<div class="flex items-center gap-2 mb-3">
									<Icon
										icon="lucide:check-circle"
										class="w-5 h-5 text-green-600" />
									<h4 class="font-semibold text-green-800">
										Submitted Values
									</h4>
								</div>
								<div
									class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-80">
									<pre
										class="text-xs text-gray-700 whitespace-pre-wrap"
										>{{
											JSON.stringify(
												submittedValues.values,
												null,
												2,
											)
										}}</pre
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>

			<!-- Advanced Tab -->
			<template v-else-if="activeTab === 'advanced'">
				<div>
					<h3 class="text-lg font-semibold mb-1">
						Conditional Fields & Computed Values
					</h3>
					<p class="text-sm text-gray-500 mb-4">
						Shows/hides fields based on selection (payment method)
						and auto-calculates totals using
						<code>updateValues</code>.
					</p>
					<div class="max-w-2xl">
						<Form
							:schema="advancedSchema"
							submitText="Complete Payment"
							@onSubmit="
								(payload) =>
									handleSubmit('Advanced Form', payload)
							" />
					</div>
				</div>
			</template>

			<!-- Grouped Forms Tab -->
			<template v-else-if="activeTab === 'grouped'">
				<div>
					<h3 class="text-lg font-semibold mb-1">
						Grouped Form with Cards
					</h3>
					<p class="text-sm text-gray-500 mb-4">
						Form sections displayed as cards with headings and
						descriptions.
					</p>
					<div class="max-w-3xl">
						<Form
							:schema="[
								personalInfoSchema,
								addressSchema,
								preferencesSchema,
							]"
							:groupsHeadings="[
								'Personal Information',
								'Address',
								'Preferences',
							]"
							:groupHeadingsDescription="[
								'Enter your basic information',
								'Where should we ship your orders?',
								'Customize your experience',
							]"
							submitText="Save Profile"
							@onSubmit="
								(payload) =>
									handleSubmit('Grouped Form', payload)
							" />
					</div>
				</div>
			</template>

			<!-- Multi-Step Tab -->
			<template v-else-if="activeTab === 'multistep'">
				<div>
					<h3 class="text-lg font-semibold mb-1">
						Multi-Step Wizard
					</h3>
					<p class="text-sm text-gray-500 mb-4">
						Step-by-step form with Timeline navigation. Each step
						validates before proceeding.
					</p>
					<div class="max-w-3xl">
						<Form
							:tabs="multiStepTabs"
							:schema="[
								accountSchema,
								profileSchema,
								reviewSchema,
							]"
							submitText="Create Account"
							@onSubmit="
								(payload) =>
									handleSubmit('Multi-Step Form', payload)
							" />
					</div>
				</div>
			</template>

			<!-- Custom Fields Tab -->
			<template v-else-if="activeTab === 'custom'">
				<div>
					<h3 class="text-lg font-semibold mb-1">
						Dynamic Custom Fields
					</h3>
					<p class="text-sm text-gray-500 mb-4">
						Add/remove dynamic rows like social links and team
						members using the CustomFields component.
					</p>
					<div class="max-w-4xl">
						<Form
							:schema="customFieldsSchema"
							:columns="2"
							submitText="Save Project"
							@onSubmit="
								(payload) =>
									handleSubmit('Custom Fields Form', payload)
							" />
					</div>
				</div>
			</template>

			<!-- Uploads Tab -->
			<template v-else-if="activeTab === 'uploads'">
				<div>
					<h3 class="text-lg font-semibold mb-1">File Uploads</h3>
					<p class="text-sm text-gray-500 mb-4">
						Demonstration of avatar upload, single/multiple file
						uploads, and files within custom fields.
					</p>
					<div class="flex flex-col lg:flex-row gap-6">
						<div class="flex-1 max-w-2xl">
							<Form
								:schema="uploadSchema"
								submitText="Upload Files"
								class-name="grid-cols-1"
								:values="{
									documents: [
										{
											title: '1',
											file: 'https://storage.googleapis.com/vlite-bucket/fx4rzr/25_Algorithms_Every_Programmer_Should_Know.pdf',
											category: 'personal',
										},
									],
									avatar: 'https://cdn.prod.website-files.com/666ad77562dfabab1eb27f63/67477a47fb8225b8ce5d1813_44cc44f1c9_15800_1_1732686878.webp',
									idProof:
										'https://storage.googleapis.com/vlite-bucket/yxycao/safdar-azeem-cv.pdf',
									resume: 'https://storage.googleapis.com/vlite-bucket/rv65j/dummy.pdf',
								}"
								@onSubmit="
									(payload) =>
										handleSubmit('Uploads', payload)
								" />
						</div>
						<!-- Inline Submitted Values -->
						<div
							v-if="
								submittedValues &&
								submittedValues.tab === 'Uploads'
							"
							class="flex-1 max-w-md">
							<div
								class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
								<div class="flex items-center gap-2 mb-3">
									<Icon
										icon="lucide:check-circle"
										class="w-5 h-5 text-green-600" />
									<h4 class="font-semibold text-green-800">
										Submitted Values
									</h4>
								</div>
								<div
									class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-[500px]">
									<pre
										class="text-xs text-gray-700 whitespace-pre-wrap"
										>{{
											JSON.stringify(
												submittedValues.values,
												null,
												2,
											)
										}}</pre
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>

		<!-- Submitted Values Display -->
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="opacity-0 translate-y-4"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-4">
			<div
				v-if="submittedValues"
				class="bg-green-50 border border-green-200 rounded-lg p-4">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-2">
						<Icon
							icon="lucide:check-circle"
							class="w-5 h-5 text-green-600" />
						<h4 class="font-semibold text-green-800">
							Form Submitted Successfully!
						</h4>
						<Badge
							variant="success"
							size="sm"
							>{{ submittedValues.tab }}</Badge
						>
					</div>
					<Button
						variant="ghost"
						size="xs"
						icon="lucide:x"
						@click="clearSubmitted" />
				</div>
				<p class="text-xs text-green-600 mb-2">
					Submitted at
					{{ submittedValues.timestamp.toLocaleTimeString() }}
				</p>
				<div
					class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
					<pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
						JSON.stringify(submittedValues.values, null, 2)
					}}</pre>
				</div>
			</div>
		</Transition>
	</div>
</template>
