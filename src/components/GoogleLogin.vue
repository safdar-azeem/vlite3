<script setup lang="ts">
import { ref } from 'vue'
import { googleTokenLogin } from 'vue3-google-login'
import Button from '@/components/Button.vue'

export interface GoogleLoginProps {
  clientId: string
  buttonText?: string
  variant?: any
  size?: any
  rounded?: any
  disabled?: boolean
}

const props = withDefaults(defineProps<GoogleLoginProps>(), {
  buttonText: 'Sign in with Google',
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'success', response: any): void
  (e: 'error', error: any): void
}>()

const isLoading = ref(false)

const triggerLogin = async () => {
  if (props.disabled || isLoading.value) return

  isLoading.value = true
  try {
    const response = await googleTokenLogin({
      clientId: props.clientId,
    })
    emit('success', response)
  } catch (error) {
    emit('error', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="google-login-wrapper inline-block w-full">
    <slot :login="triggerLogin" :loading="isLoading" :disabled="disabled">
      <Button
        :variant="variant"
        :size="size"
        :rounded="rounded"
        :disabled="disabled || isLoading"
        :loading="isLoading"
        @click="triggerLogin"
        class="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors">
        <svg
          v-if="!isLoading"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          class="w-5 h-5 shrink-0">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        <span class="font-medium">{{ buttonText }}</span>
      </Button>
    </slot>
  </div>
</template>
