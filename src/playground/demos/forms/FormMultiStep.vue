<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormMultiStep.vue?raw'

const submitData = ref<any>(null)

const steps = [
  { id: 1, title: 'Account', icon: 'lucide:user', description: 'Create your account' },
  { id: 2, title: 'Profile', icon: 'lucide:user-circle', description: 'Set up your profile' },
  { id: 3, title: 'Complete', icon: 'lucide:check-circle', description: 'Review and finish' },
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

const handleSubmit = ({ values }: IFormSubmitPayload) => {
  console.log('values :>> ', values)
  submitData.value = values
}
</script>

<template>
  <DemoSection title="Multi-Step Form" :code="sourceCode" class="w-full">
    <div class="space-y-8 w-full">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Wizard style form with state preservation between steps.
        </p>
      </div>

      <div
        class="max-w-3xl w-full bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div class="p-8">
          <div v-if="!submitData">
            <Form
              :schema="[accountSchema, profileSchema, reviewSchema]"
              :groups-headings="['Account Details', 'Profile Information', 'Review & Submit']"
              :tabs="steps"
              class-name="grid-cols-2"
              @on-submit="handleSubmit" />
          </div>

          <!-- Success State -->
          <div v-else class="text-center py-10">
            <div
              class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="lucide:check" class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Registration Complete!</h3>
            <p class="text-gray-500 mt-2">Welcome aboard, {{ submitData.displayName }}</p>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
