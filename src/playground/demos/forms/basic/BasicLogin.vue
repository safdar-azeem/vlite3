<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../../DemoSection.vue'
import sourceCode from './BasicLogin.vue?raw'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})

const loginSchema: IForm[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'john@example.com',
    icon: 'lucide:mail',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    icon: 'lucide:lock',
    required: true,
  },
  {
    name: 'rememberMe',
    type: 'switch',
  },
]

const submittedValues = ref<any>({
  email: 'john@example.com',
  password: '123456',
  rememberMe: true,
})

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Login Form" :code="sourceCode">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 max-w-3xl">
        <Form
          :schema="loginSchema"
          submitText="Sign In"
          :values="submittedValues"
          @onSubmit="handleSubmit"
          :schema-loading="loading" />
      </div>
      <!-- Inline Submitted Values -->
      <div v-if="submittedValues" class="flex-1 max-w-md">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
          <div class="flex items-center gap-2 mb-3">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
            <h4 class="font-semibold text-green-800">Submitted Values</h4>
          </div>
          <div class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
              JSON.stringify(submittedValues, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
