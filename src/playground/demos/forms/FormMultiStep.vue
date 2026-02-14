<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormMultiStep.vue?raw'

const steps = [
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

const currentStep = ref(1)
const formData = ref<any>({})

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

const nextStep = (payload: IFormSubmitPayload) => {
  formData.value = { ...formData.value, ...payload.values }
  if (currentStep.value < steps.length) {
    currentStep.value++
  } else {
    // Final submission
    console.log('Final Submission:', formData.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const resetForm = () => {
  currentStep.value = 1
  formData.value = {}
}
</script>

<template>
  <DemoSection title="Multi-Step Form" :code="sourceCode">
    <div class="space-y-8">
      <div>
        <p class="text-sm text-gray-500 mb-4">
          Wizard style form with state preservation between steps.
        </p>

        <div
          class="max-w-3xl mx-auto bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          <!-- Stepper Header -->
          <div class="bg-gray-50 border-b border-border p-6">
            <div class="flex justify-between relative">
              <!-- Connecting Line -->
              <div
                class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 z-0 -translate-y-1/2"></div>

              <div
                v-for="step in steps"
                :key="step.id"
                class="relative z-10 flex flex-col items-center bg-gray-50 px-2">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200"
                  :class="
                    currentStep >= step.id
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  ">
                  <Icon :icon="step.icon" class="w-5 h-5" />
                </div>
                <span
                  class="mt-2 text-xs font-medium"
                  :class="currentStep >= step.id ? 'text-primary' : 'text-gray-500'"
                  >{{ step.title }}</span
                >
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="p-8">
            <div v-if="currentStep === 1">
              <h4 class="text-xl font-semibold mb-4">Account Details</h4>
              <Form
                key="step1"
                :schema="accountSchema"
                :initial-values="formData"
                submitText="Next Step"
                class-name="grid-cols-2"
                @onSubmit="nextStep" />
            </div>

            <div v-else-if="currentStep === 2">
              <h4 class="text-xl font-semibold mb-4">Profile Information</h4>
              <Form
                key="step2"
                :schema="profileSchema"
                :initial-values="formData"
                submitText="Next Step"
                class-name="grid-cols-2"
                @onSubmit="nextStep">
                <template #actions="{ submit }">
                  <div class="flex justify-between w-full">
                    <Button variant="outline" @click="prevStep" type="button">Back</Button>
                    <Button @click="submit">Next Step</Button>
                  </div>
                </template>
              </Form>
            </div>

            <div v-else-if="currentStep === 3">
              <h4 class="text-xl font-semibold mb-4">Review & Submit</h4>
              <div class="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
                <p><strong>Email:</strong> {{ formData.email }}</p>
                <p><strong>Name:</strong> {{ formData.displayName }}</p>
              </div>

              <Form
                key="step3"
                :schema="reviewSchema"
                :initial-values="formData"
                submitText="Complete Registration"
                class-name="grid-cols-2"
                @onSubmit="nextStep">
                <template #actions="{ submit }">
                  <div class="flex justify-between w-full">
                    <Button variant="outline" @click="prevStep" type="button">Back</Button>
                    <Button @click="submit" color="success">Complete Registration</Button>
                  </div>
                </template>
              </Form>
            </div>

            <!-- Success State -->
            <div v-if="currentStep > steps.length" class="text-center py-10">
              <div
                class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:check" class="w-8 h-8" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Registration Complete!</h3>
              <p class="text-gray-500 mt-2">Welcome aboard, {{ formData.displayName }}</p>
              <Button class="mt-8" @click="resetForm">Start Over</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
